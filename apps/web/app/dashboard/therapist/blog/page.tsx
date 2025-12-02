'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Send,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Archive,
} from 'lucide-react';
import { BlogPostStatus } from '@prisma/client';

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  status: BlogPostStatus;
  featuredImageUrl: string | null;
  category: string | null;
  publishedAt: string | null;
  updatedAt: string;
  readingTimeMinutes: number | null;
  viewCount: number;
  author: {
    id: string;
    displayName: string | null;
    profileImageUrl: string | null;
  } | null;
  _count: {
    relatedFrom: number;
  };
  isStatic?: boolean;
};

const statusConfig: Record<BlogPostStatus, { label: string; icon: typeof FileText; color: string }> = {
  DRAFT: { label: 'Entwurf', icon: FileText, color: 'bg-gray-100 text-gray-700' },
  PENDING_REVIEW: { label: 'Zur Prüfung', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  REVIEWED: { label: 'Geprüft', icon: CheckCircle2, color: 'bg-blue-100 text-blue-700' },
  PUBLISHED: { label: 'Veröffentlicht', icon: Eye, color: 'bg-green-100 text-green-700' },
  ARCHIVED: { label: 'Archiviert', icon: Archive, color: 'bg-gray-100 text-gray-500' },
};

// Only show these statuses in the filter dropdown (the ones that can actually be set)
const filterableStatuses: BlogPostStatus[] = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

// Sort options
type SortOption = 'updatedAt' | 'publishedAt' | 'viewCount' | 'title';
const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'updatedAt', label: 'Zuletzt geändert' },
  { value: 'publishedAt', label: 'Veröffentlichungsdatum' },
  { value: 'viewCount', label: 'Meiste Aufrufe' },
  { value: 'title', label: 'Titel (A-Z)' },
];

export default function BlogDashboardPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<BlogPostStatus | ''>('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updatedAt');
  const [showAllPosts, setShowAllPosts] = useState(true); // Default: show all posts
  const [includeStatic, setIncludeStatic] = useState(false); // Default: don't include static (they're now in DB)
  const [categories, setCategories] = useState<string[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set('status', filterStatus);
      if (filterCategory) params.set('category', filterCategory);
      if (showAllPosts) params.set('showAll', 'true');
      if (includeStatic) params.set('includeStatic', 'true');

      const res = await fetch(`/api/therapist/blog?${params}`);
      const data = await res.json();

      if (data.success) {
        setPosts(data.posts);
        if (data.categories) {
          setCategories(data.categories);
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterCategory, showAllPosts, includeStatic]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = posts
    .filter((post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'updatedAt':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'publishedAt':
          // Put unpublished posts at the end
          if (!a.publishedAt && !b.publishedAt) return 0;
          if (!a.publishedAt) return 1;
          if (!b.publishedAt) return -1;
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'viewCount':
          return b.viewCount - a.viewCount;
        case 'title':
          return a.title.localeCompare(b.title, 'de');
        default:
          return 0;
      }
    });

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diesen Beitrag wirklich löschen?')) return;

    try {
      const res = await fetch(`/api/therapist/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
    setActiveMenu(null);
  };

  const handlePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/therapist/blog/${id}/publish`, { method: 'POST' });
      if (res.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error publishing post:', error);
    }
    setActiveMenu(null);
  };

  const handleUnpublish = async (id: string) => {
    try {
      const res = await fetch(`/api/therapist/blog/${id}/publish`, { method: 'DELETE' });
      if (res.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error unpublishing post:', error);
    }
    setActiveMenu(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('de-AT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Blog-Beiträge</h1>
          <p className="text-neutral-600">Verwalten Sie Ihre Fachartikel und Beiträge</p>
        </div>
        <Link
          href="/dashboard/therapist/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition shadow-lg shadow-primary-500/25"
        >
          <Plus className="w-5 h-5" />
          Neuer Beitrag
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Beiträge durchsuchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as BlogPostStatus | '')}
            className="px-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
          >
            <option value="">Alle Status</option>
            {filterableStatuses.map((status) => (
              <option key={status} value={status}>
                {statusConfig[status].label}
              </option>
            ))}
          </select>
          {categories.length > 0 && (
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="">Alle Kategorien</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showAllPosts}
              onChange={(e) => setShowAllPosts(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-neutral-700">Alle Beiträge anzeigen</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeStatic}
              onChange={(e) => setIncludeStatic(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-neutral-700">Statische Beiträge einbeziehen</span>
          </label>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-32 h-24 bg-neutral-200 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-neutral-200 rounded w-3/4" />
                  <div className="h-4 bg-neutral-200 rounded w-full" />
                  <div className="h-4 bg-neutral-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
            <FileText className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            {search || filterStatus ? 'Keine Beiträge gefunden' : 'Noch keine Beiträge'}
          </h3>
          <p className="text-neutral-600 mb-6">
            {search || filterStatus
              ? 'Versuchen Sie eine andere Suche oder Filter'
              : 'Erstellen Sie Ihren ersten Fachartikel'}
          </p>
          {!search && !filterStatus && (
            <Link
              href="/dashboard/therapist/blog/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
            >
              <Plus className="w-4 h-4" />
              Ersten Beitrag erstellen
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post) => {
            const status = statusConfig[post.status];
            const StatusIcon = status.icon;

            return (
              <div
                key={post.id}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition group"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Image */}
                  <div className="relative w-full sm:w-40 h-32 sm:h-28 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                    {post.featuredImageUrl ? (
                      <Image
                        src={post.featuredImageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="w-10 h-10 text-neutral-300" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                          {post.isStatic && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              Statisch
                            </span>
                          )}
                          {post.category && (
                            <span className="text-xs text-neutral-500">{post.category}</span>
                          )}
                        </div>
                        <h3 className="font-semibold text-neutral-900 truncate">{post.title}</h3>
                        <p className="text-sm text-neutral-600 line-clamp-2 mt-1">{post.excerpt}</p>
                      </div>

                      {/* Actions Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === post.id ? null : post.id)}
                          className="p-2 hover:bg-neutral-100 rounded-lg transition"
                        >
                          <MoreVertical className="w-5 h-5 text-neutral-500" />
                        </button>

                        {activeMenu === post.id && (
                          <>
                            <button
                              type="button"
                              className="fixed inset-0 z-10 cursor-default"
                              onClick={() => setActiveMenu(null)}
                              aria-label="Menü schließen"
                            />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-1 z-20">
                              {/* Static posts: only view option */}
                              {post.isStatic ? (
                                <>
                                  <a
                                    href={`/blog/${post.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                                    onClick={() => setActiveMenu(null)}
                                  >
                                    <Eye className="w-4 h-4" />
                                    Ansehen
                                  </a>
                                  <div className="px-4 py-2 text-xs text-neutral-400">
                                    Statische Beiträge können nicht bearbeitet werden
                                  </div>
                                </>
                              ) : (
                                <>
                                  <Link
                                    href={`/dashboard/therapist/blog/${post.id}`}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                                    onClick={() => setActiveMenu(null)}
                                  >
                                    <Edit className="w-4 h-4" />
                                    Bearbeiten
                                  </Link>
                                  {post.status === 'PUBLISHED' && (
                                    <a
                                      href={`/blog/${post.slug}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                                      onClick={() => setActiveMenu(null)}
                                    >
                                      <Eye className="w-4 h-4" />
                                      Ansehen
                                    </a>
                                  )}
                                  {post.status !== 'PUBLISHED' && (
                                    <button
                                      onClick={() => handlePublish(post.id)}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                                    >
                                      <Send className="w-4 h-4" />
                                      Veröffentlichen
                                    </button>
                                  )}
                                  {post.status === 'PUBLISHED' && (
                                    <button
                                      onClick={() => handleUnpublish(post.id)}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50"
                                    >
                                      <AlertCircle className="w-4 h-4" />
                                      Zurückziehen
                                    </button>
                                  )}
                                  <hr className="my-1" />
                                  <button
                                    onClick={() => handleDelete(post.id)}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Löschen
                                  </button>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-neutral-500">
                      {post.author?.displayName && (
                        <span className="font-medium text-neutral-700">
                          Von: {post.author.displayName}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.viewCount || 0} Aufrufe
                      </span>
                      <span>Aktualisiert: {formatDate(post.updatedAt)}</span>
                      {post.publishedAt && (
                        <span>Veröffentlicht: {formatDate(post.publishedAt)}</span>
                      )}
                      {post.readingTimeMinutes && (
                        <span>{post.readingTimeMinutes} Min. Lesezeit</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
