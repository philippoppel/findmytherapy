'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Image as ImageIcon,
  Plus,
  Trash2,
  GripVertical,
  Link as LinkIcon,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2,
  Check,
  Copy,
} from 'lucide-react';
import BlogPreview from './BlogPreview';
import { DEEP_RESEARCH_PROMPT, parseBlogImport, ParsedBlogData } from '@/lib/blogImportTemplate';
import { useTranslation } from '@/lib/i18n/useTranslation';

type SectionImage = {
  src: string;
  alt: string;
  caption?: string;
};

type Section = {
  heading: string;
  paragraphs: string[];
  list?: string[];
  image?: SectionImage;
};

type Source = {
  id?: string;
  title: string;
  url?: string;
  description?: string;
};

type BlogImage = {
  id?: string;
  url: string;
  alt?: string;
  caption?: string;
  isUploaded?: boolean;
};

type FAQItem = {
  question: string;
  answer: string;
};

type BlogPostData = {
  id?: string;
  slug?: string;
  title: string;
  excerpt: string;
  content: { sections: Section[] };
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  featuredImageCaption?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  tags: string[];
  category?: string;
  summaryPoints: string[];
  faq?: FAQItem[];
  sources: Source[];
  images: BlogImage[];
  relatedPostIds?: string[];
  status?: string;
  authorId?: string;
};

// Available blog authors
const BLOG_AUTHORS = [
  { id: 'cmioi9m9z0001jebh7q1lgeic', name: 'Thomas Kaufmann BA pth.', title: 'Psychotherapeut' },
  { id: 'cmioi9mg50004jebhox1rq688', name: 'MMag. Dr. Gregor Studlar BA', title: 'Klinischer Psychologe & Psychotherapeut' },
];

// Category values (stored in database) with translation key mappings
const CATEGORY_KEYS: Record<string, string> = {
  'Angst & Panik': 'categoryAnxiety',
  'Depression': 'categoryDepression',
  'Burnout & Stress': 'categoryBurnout',
  'Beziehungen': 'categoryRelationships',
  'Trauma': 'categoryTrauma',
  'Selbstwert': 'categorySelfWorth',
  'Schlaf': 'categorySleep',
  'Allgemein': 'categoryGeneral',
};

const CATEGORIES = Object.keys(CATEGORY_KEYS);

type BlogEditorProps = {
  initialData?: BlogPostData;
  isEditing?: boolean;
};

export default function BlogEditor({ initialData, isEditing }: BlogEditorProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'sources'>('content');
  const [showPreview, setShowPreview] = useState(false);

  // Form state
  const [formData, setFormData] = useState<BlogPostData>({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || { sections: [] },
    featuredImageUrl: initialData?.featuredImageUrl || '',
    featuredImageAlt: initialData?.featuredImageAlt || '',
    featuredImageCaption: initialData?.featuredImageCaption || '',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    keywords: initialData?.keywords || [],
    tags: initialData?.tags || [],
    category: initialData?.category || '',
    summaryPoints: initialData?.summaryPoints || [],
    faq: initialData?.faq || [],
    sources: initialData?.sources || [],
    images: initialData?.images || [],
    relatedPostIds: initialData?.relatedPostIds || [],
    status: initialData?.status || 'DRAFT',
    authorId: initialData?.authorId || BLOG_AUTHORS[0].id,
  });

  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [keywordInput, setKeywordInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [showSummaryImportModal, setShowSummaryImportModal] = useState(false);
  const [summaryImportText, setSummaryImportText] = useState('');
  const [showSourcesImportModal, setShowSourcesImportModal] = useState(false);
  const [sourcesImportText, setSourcesImportText] = useState('');
  const [showFullImportModal, setShowFullImportModal] = useState(false);
  const [fullImportText, setFullImportText] = useState('');
  const [fullImportPreview, setFullImportPreview] = useState<ParsedBlogData | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateCopied, setTemplateCopied] = useState(false);

  // Parse imported text into sections
  const parseTextToSections = (text: string): Section[] => {
    const sections: Section[] = [];
    const lines = text.split('\n');

    let currentSection: Section | null = null;
    let currentParagraph = '';

    const isHeading = (line: string): boolean => {
      // Markdown headings (## Heading)
      if (/^#{1,3}\s+.+/.test(line)) return true;
      // Lines ending with : that are short (likely headings)
      if (line.endsWith(':') && line.length < 80) return true;
      // Short lines (< 60 chars) followed by longer content - detected by context
      return false;
    };

    const cleanHeading = (line: string): string => {
      return line.replace(/^#{1,3}\s+/, '').replace(/:$/, '').trim();
    };

    const finishParagraph = () => {
      if (currentParagraph.trim() && currentSection) {
        currentSection.paragraphs.push(currentParagraph.trim());
        currentParagraph = '';
      }
    };

    const finishSection = () => {
      finishParagraph();
      if (currentSection && (currentSection.heading || currentSection.paragraphs.length > 0)) {
        sections.push(currentSection);
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const nextLine = lines[i + 1]?.trim() || '';

      // Skip empty lines - they separate paragraphs
      if (!line) {
        finishParagraph();
        continue;
      }

      // Check if this line is a heading
      const looksLikeHeading = isHeading(line) ||
        (line.length < 60 && !line.endsWith('.') && nextLine.length > line.length * 1.5);

      if (looksLikeHeading && (line.startsWith('#') || line.endsWith(':') || (!currentSection && line.length < 60))) {
        finishSection();
        currentSection = {
          heading: cleanHeading(line),
          paragraphs: []
        };
      } else {
        // Regular text - add to current paragraph
        if (!currentSection) {
          currentSection = { heading: '', paragraphs: [] };
        }
        currentParagraph += (currentParagraph ? ' ' : '') + line;
      }
    }

    finishSection();

    // If no sections were detected, create one with all text
    if (sections.length === 0 && text.trim()) {
      const paragraphs = text.split(/\n\n+/).map(p => p.replace(/\n/g, ' ').trim()).filter(Boolean);
      sections.push({ heading: '', paragraphs });
    }

    return sections;
  };

  const handleImportText = () => {
    if (!importText.trim()) return;

    const newSections = parseTextToSections(importText);
    const existingSections = formData.content.sections;

    updateFormData({
      content: { sections: [...existingSections, ...newSections] }
    });

    // Expand newly added sections
    const newIndices = new Set(expandedSections);
    for (let i = existingSections.length; i < existingSections.length + newSections.length; i++) {
      newIndices.add(i);
    }
    setExpandedSections(newIndices);

    setImportText('');
    setShowImportModal(false);
  };

  // Parse summary points (one per line, dash or bullet prefix optional)
  const parseSummaryPoints = (text: string): string[] => {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^[-•*]\s*/, '')); // Remove leading dashes/bullets
  };

  const handleImportSummary = () => {
    if (!summaryImportText.trim()) return;
    const newPoints = parseSummaryPoints(summaryImportText);
    updateFormData({
      summaryPoints: [...formData.summaryPoints, ...newPoints]
    });
    setSummaryImportText('');
    setShowSummaryImportModal(false);
  };

  // Parse sources (one per line, format: "Title | URL | Description" or just "Title")
  const parseSources = (text: string): Source[] => {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Try to detect URL in the line
        const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
        const url = urlMatch ? urlMatch[1] : '';

        // If line contains pipe separators
        if (line.includes('|')) {
          const parts = line.split('|').map(p => p.trim());
          return {
            title: parts[0] || '',
            url: parts[1] || url,
            description: parts[2] || ''
          };
        }

        // Otherwise, use the whole line as title (minus URL if found)
        const title = url ? line.replace(url, '').trim() : line;
        return { title, url, description: '' };
      });
  };

  const handleImportSources = () => {
    if (!sourcesImportText.trim()) return;
    const newSources = parseSources(sourcesImportText);
    updateFormData({
      sources: [...formData.sources, ...newSources]
    });
    setSourcesImportText('');
    setShowSourcesImportModal(false);
  };

  // Full article import - parses entire blog post from template
  const handleFullImportPreview = () => {
    if (!fullImportText.trim()) return;
    const parsed = parseBlogImport(fullImportText);
    setFullImportPreview(parsed);
  };

  const handleFullImport = () => {
    if (!fullImportPreview) return;

    // Map parsed data to form data
    updateFormData({
      title: fullImportPreview.title || formData.title,
      slug: fullImportPreview.slug || formData.slug,
      excerpt: fullImportPreview.excerpt || formData.excerpt,
      category: fullImportPreview.category || formData.category,
      metaTitle: fullImportPreview.metaTitle || formData.metaTitle,
      metaDescription: fullImportPreview.metaDescription || formData.metaDescription,
      keywords: fullImportPreview.keywords.length > 0 ? fullImportPreview.keywords : formData.keywords,
      tags: fullImportPreview.tags.length > 0 ? fullImportPreview.tags : formData.tags,
      featuredImageUrl: fullImportPreview.featuredImageUrl || formData.featuredImageUrl,
      featuredImageAlt: fullImportPreview.featuredImageAlt || formData.featuredImageAlt,
      featuredImageCaption: fullImportPreview.featuredImageCaption || formData.featuredImageCaption,
      summaryPoints: fullImportPreview.summaryPoints.length > 0 ? fullImportPreview.summaryPoints : formData.summaryPoints,
      content: fullImportPreview.content.sections.length > 0 ? fullImportPreview.content : formData.content,
      faq: fullImportPreview.faq.length > 0 ? fullImportPreview.faq : formData.faq,
      sources: fullImportPreview.sources.length > 0 ? fullImportPreview.sources : formData.sources,
    });

    // Expand all sections
    const newExpanded = new Set<number>();
    for (let i = 0; i < fullImportPreview.content.sections.length; i++) {
      newExpanded.add(i);
    }
    setExpandedSections(newExpanded);

    setFullImportText('');
    setFullImportPreview(null);
    setShowFullImportModal(false);
  };

  const updateFormData = (updates: Partial<BlogPostData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Section management
  const addSection = () => {
    const newSections = [...formData.content.sections, { heading: '', paragraphs: [''] }];
    updateFormData({ content: { sections: newSections } });
    setExpandedSections((prev) => new Set([...prev, newSections.length - 1]));
  };

  const updateSection = (index: number, updates: Partial<Section>) => {
    const newSections = [...formData.content.sections];
    newSections[index] = { ...newSections[index], ...updates };
    updateFormData({ content: { sections: newSections } });
  };

  const removeSection = (index: number) => {
    const newSections = formData.content.sections.filter((_, i) => i !== index);
    updateFormData({ content: { sections: newSections } });
  };

  const addParagraph = (sectionIndex: number) => {
    const newSections = [...formData.content.sections];
    newSections[sectionIndex].paragraphs.push('');
    updateFormData({ content: { sections: newSections } });
  };

  const updateParagraph = (sectionIndex: number, paragraphIndex: number, value: string) => {
    const newSections = [...formData.content.sections];
    newSections[sectionIndex].paragraphs[paragraphIndex] = value;
    updateFormData({ content: { sections: newSections } });
  };

  const removeParagraph = (sectionIndex: number, paragraphIndex: number) => {
    const newSections = [...formData.content.sections];
    newSections[sectionIndex].paragraphs = newSections[sectionIndex].paragraphs.filter(
      (_, i) => i !== paragraphIndex
    );
    updateFormData({ content: { sections: newSections } });
  };

  // Sources management
  const addSource = () => {
    updateFormData({ sources: [...formData.sources, { title: '', url: '', description: '' }] });
  };

  const updateSource = (index: number, updates: Partial<Source>) => {
    const newSources = [...formData.sources];
    newSources[index] = { ...newSources[index], ...updates };
    updateFormData({ sources: newSources });
  };

  const removeSource = (index: number) => {
    updateFormData({ sources: formData.sources.filter((_, i) => i !== index) });
  };

  // Summary points management
  const addSummaryPoint = () => {
    updateFormData({ summaryPoints: [...formData.summaryPoints, ''] });
  };

  const updateSummaryPoint = (index: number, value: string) => {
    const newPoints = [...formData.summaryPoints];
    newPoints[index] = value;
    updateFormData({ summaryPoints: newPoints });
  };

  const removeSummaryPoint = (index: number) => {
    updateFormData({ summaryPoints: formData.summaryPoints.filter((_, i) => i !== index) });
  };

  // Keywords and tags
  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      updateFormData({ keywords: [...formData.keywords, keywordInput.trim()] });
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    updateFormData({ keywords: formData.keywords.filter((k) => k !== keyword) });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      updateFormData({ tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    updateFormData({ tags: formData.tags.filter((t) => t !== tag) });
  };

  // Image upload
  const handleImageUpload = useCallback(async (file: File) => {
    const formDataObj = new FormData();
    formDataObj.append('file', file);

    try {
      const res = await fetch('/api/blog/images/upload', {
        method: 'POST',
        body: formDataObj,
      });

      const data = await res.json();
      if (data.success) {
        return data.image.url;
      } else {
        throw new Error(data.error || t('blogEditor.uploadFailed'));
      }
    } catch (err) {
      console.error('Image upload error:', err);
      throw err;
    }
  }, []);

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await handleImageUpload(file);
      updateFormData({ featuredImageUrl: url });
    } catch (err) {
      setError(t('blogEditor.imageUploadError'));
    }
  };

  // Save and publish
  const handleSave = async (publish = false) => {
    setError(null);

    if (!formData.title.trim()) {
      setError(t('blogEditor.enterTitle'));
      return;
    }

    if (!formData.excerpt.trim()) {
      setError(t('blogEditor.enterExcerpt'));
      return;
    }

    publish ? setPublishing(true) : setSaving(true);

    try {
      const endpoint = isEditing
        ? `/api/therapist/blog/${initialData?.id}`
        : '/api/therapist/blog';

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || t('blogEditor.saveError'));
      }

      // If publishing, make a second request
      if (publish) {
        const publishRes = await fetch(`/api/therapist/blog/${data.post.id}/publish`, {
          method: 'POST',
        });

        if (!publishRes.ok) {
          throw new Error(t('blogEditor.publishError'));
        }
      }

      router.push('/dashboard/therapist/blog');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('blogEditor.genericError'));
    } finally {
      setSaving(false);
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/therapist/blog"
            className="p-2 hover:bg-neutral-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-neutral-900">
              {isEditing ? t('blogEditor.editPost') : t('blogEditor.newPost')}
            </h1>
            <p className="text-sm text-neutral-500">
              {isEditing ? t('blogEditor.slugLabel', { slug: initialData?.slug || '' }) : t('blogEditor.createNew')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              onClick={() => setShowFullImportModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 hover:bg-emerald-100 transition"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">{t('blogEditor.importArticle')}</span>
            </button>
          )}
          <button
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">{t('blogEditor.preview')}</span>
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving || publishing}
            className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {t('blogEditor.save')}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving || publishing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {t('blogEditor.publish')}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-neutral-100 rounded-xl mb-6">
        {[
          { id: 'content', label: t('blogEditor.tabContent') },
          { id: 'seo', label: t('blogEditor.tabSeo') },
          { id: 'sources', label: t('blogEditor.tabSources') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Author Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label htmlFor="blog-author" className="block text-sm font-medium text-neutral-700 mb-2">{t('blogEditor.author')} *</label>
            <select
              id="blog-author"
              value={formData.authorId}
              onChange={(e) => updateFormData({ authorId: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {BLOG_AUTHORS.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name} – {author.title}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label htmlFor="blog-title" className="block text-sm font-medium text-neutral-700 mb-2">{t('blogEditor.title')} *</label>
            <input
              id="blog-title"
              type="text"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              placeholder={t('blogEditor.titlePlaceholder')}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label htmlFor="blog-excerpt" className="block text-sm font-medium text-neutral-700 mb-2">
              {t('blogEditor.excerpt')} *
            </label>
            <textarea
              id="blog-excerpt"
              value={formData.excerpt}
              onChange={(e) => updateFormData({ excerpt: e.target.value })}
              placeholder={t('blogEditor.excerptPlaceholder')}
              rows={3}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <span className="block text-sm font-medium text-neutral-700 mb-2">{t('blogEditor.featuredImage')}</span>
            <div className="space-y-4">
              {formData.featuredImageUrl ? (
                <div className="relative aspect-[2/1] rounded-xl overflow-hidden bg-neutral-100">
                  <Image
                    src={formData.featuredImageUrl}
                    alt={formData.featuredImageAlt || t('blogEditor.featuredImage')}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => updateFormData({ featuredImageUrl: '' })}
                    className="absolute top-2 right-2 p-2 bg-white/90 rounded-lg hover:bg-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-[2/1] rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 transition"
                >
                  <Upload className="w-10 h-10 text-neutral-400 mb-2" />
                  <p className="text-neutral-600">{t('blogEditor.uploadImage')}</p>
                  <p className="text-sm text-neutral-400">{t('blogEditor.orEnterUrl')}</p>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFeaturedImageUpload}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="featured-image-url" className="block text-xs text-neutral-500 mb-1">{t('blogEditor.imageUrl')}</label>
                  <div className="flex gap-2">
                    <input
                      id="featured-image-url"
                      type="url"
                      value={formData.featuredImageUrl}
                      onChange={(e) => updateFormData({ featuredImageUrl: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="featured-image-alt" className="block text-xs text-neutral-500 mb-1">{t('blogEditor.altText')}</label>
                  <input
                    id="featured-image-alt"
                    type="text"
                    value={formData.featuredImageAlt}
                    onChange={(e) => updateFormData({ featuredImageAlt: e.target.value })}
                    placeholder={t('blogEditor.altTextPlaceholder')}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label htmlFor="blog-category" className="block text-sm font-medium text-neutral-700 mb-2">{t('blogEditor.category')}</label>
            <select
              id="blog-category"
              value={formData.category}
              onChange={(e) => updateFormData({ category: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">{t('blogEditor.selectCategory')}</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {t(`blogEditor.${CATEGORY_KEYS[cat]}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Summary Points */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="block text-sm font-medium text-neutral-700">
                {t('blogEditor.summaryTitle')}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSummaryImportModal(true)}
                  className="text-sm text-neutral-600 hover:text-neutral-700 flex items-center gap-1"
                >
                  <Upload className="w-4 h-4" /> {t('blogEditor.import')}
                </button>
                <button
                  onClick={addSummaryPoint}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> {t('blogEditor.addPoint')}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {formData.summaryPoints.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => updateSummaryPoint(index, e.target.value)}
                    placeholder={t('blogEditor.pointPlaceholder')}
                    className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => removeSummaryPoint(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formData.summaryPoints.length === 0 && (
                <p className="text-sm text-neutral-400 py-4 text-center">
                  {t('blogEditor.noSummaryPoints')}
                </p>
              )}
            </div>
          </div>

          {/* Content Sections */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="block text-sm font-medium text-neutral-700">{t('blogEditor.contentSections')}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowImportModal(true)}
                  className="text-sm text-neutral-600 hover:text-neutral-700 flex items-center gap-1"
                >
                  <Upload className="w-4 h-4" /> {t('blogEditor.importText')}
                </button>
                <button
                  onClick={addSection}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> {t('blogEditor.addSection')}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {formData.content.sections.map((section, sectionIndex) => {
                const isExpanded = expandedSections.has(sectionIndex);

                return (
                  <div key={sectionIndex} className="border border-neutral-200 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-3 p-4 bg-neutral-50">
                      <GripVertical className="w-4 h-4 text-neutral-400" />
                      <button
                        type="button"
                        className="flex-1 text-left font-medium text-neutral-700 hover:text-neutral-900"
                        onClick={() => {
                          const newExpanded = new Set(expandedSections);
                          if (isExpanded) {
                            newExpanded.delete(sectionIndex);
                          } else {
                            newExpanded.add(sectionIndex);
                          }
                          setExpandedSections(newExpanded);
                        }}
                      >
                        {section.heading || t('blogEditor.sectionNumber', { number: sectionIndex + 1 })}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSection(sectionIndex)}
                        className="p-1 text-red-500 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newExpanded = new Set(expandedSections);
                          if (isExpanded) {
                            newExpanded.delete(sectionIndex);
                          } else {
                            newExpanded.add(sectionIndex);
                          }
                          setExpandedSections(newExpanded);
                        }}
                        className="p-1 hover:bg-neutral-200 rounded"
                        aria-label={isExpanded ? t('blogEditor.collapseSection') : t('blogEditor.expandSection')}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-neutral-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-neutral-400" />
                        )}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="p-4 space-y-4">
                        <div>
                          <label htmlFor={`section-heading-${sectionIndex}`} className="block text-xs text-neutral-500 mb-1">{t('blogEditor.heading')}</label>
                          <input
                            id={`section-heading-${sectionIndex}`}
                            type="text"
                            value={section.heading}
                            onChange={(e) => updateSection(sectionIndex, { heading: e.target.value })}
                            placeholder={t('blogEditor.headingPlaceholder')}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="block text-xs text-neutral-500">{t('blogEditor.paragraphs')}</span>
                            <button
                              onClick={() => addParagraph(sectionIndex)}
                              className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" /> {t('blogEditor.addParagraph')}
                            </button>
                          </div>
                          <div className="space-y-2">
                            {section.paragraphs.map((paragraph, pIndex) => (
                              <div key={pIndex} className="flex gap-2">
                                <textarea
                                  value={paragraph}
                                  onChange={(e) => updateParagraph(sectionIndex, pIndex, e.target.value)}
                                  placeholder={t('blogEditor.paragraphPlaceholder')}
                                  rows={3}
                                  className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-sm resize-none"
                                />
                                {section.paragraphs.length > 1 && (
                                  <button
                                    onClick={() => removeParagraph(sectionIndex, pIndex)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg self-start"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Section Image */}
                        <div className="border-t border-neutral-100 pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="block text-xs text-neutral-500">{t('blogEditor.imageOptional')}</span>
                            {!section.image && (
                              <button
                                onClick={() => updateSection(sectionIndex, {
                                  image: { src: '', alt: '', caption: '' }
                                })}
                                className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                              >
                                <ImageIcon className="w-3 h-3" /> {t('blogEditor.addImage')}
                              </button>
                            )}
                          </div>

                          {section.image && (
                            <div className="space-y-3 p-3 bg-neutral-50 rounded-lg">
                              <div>
                                <label htmlFor={`section-image-src-${sectionIndex}`} className="block text-xs text-neutral-500 mb-1">{t('blogEditor.imageSrc')}</label>
                                <input
                                  id={`section-image-src-${sectionIndex}`}
                                  type="text"
                                  value={section.image.src}
                                  onChange={(e) => updateSection(sectionIndex, {
                                    image: { ...section.image!, src: e.target.value }
                                  })}
                                  placeholder="https://images.unsplash.com/..."
                                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label htmlFor={`section-image-alt-${sectionIndex}`} className="block text-xs text-neutral-500 mb-1">{t('blogEditor.altText')}</label>
                                <input
                                  id={`section-image-alt-${sectionIndex}`}
                                  type="text"
                                  value={section.image.alt}
                                  onChange={(e) => updateSection(sectionIndex, {
                                    image: { ...section.image!, alt: e.target.value }
                                  })}
                                  placeholder={t('blogEditor.altTextPlaceholder')}
                                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label htmlFor={`section-image-caption-${sectionIndex}`} className="block text-xs text-neutral-500 mb-1">{t('blogEditor.imageCaption')}</label>
                                <input
                                  id={`section-image-caption-${sectionIndex}`}
                                  type="text"
                                  value={section.image.caption || ''}
                                  onChange={(e) => updateSection(sectionIndex, {
                                    image: { ...section.image!, caption: e.target.value }
                                  })}
                                  placeholder={t('blogEditor.altTextPlaceholder')}
                                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                                />
                              </div>
                              {section.image.src && (
                                <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-100">
                                  <Image
                                    src={section.image.src}
                                    alt={section.image.alt || t('blogEditor.preview')}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                              )}
                              <button
                                onClick={() => updateSection(sectionIndex, { image: undefined })}
                                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" /> {t('blogEditor.removeImage')}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {formData.content.sections.length === 0 && (
                <div className="text-center py-8 text-neutral-400">
                  <p>{t('blogEditor.noSections')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          {/* Meta Title */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label htmlFor="meta-title" className="block text-sm font-medium text-neutral-700 mb-2">
              {t('blogEditor.seoTitle')}
            </label>
            <input
              id="meta-title"
              type="text"
              value={formData.metaTitle}
              onChange={(e) => updateFormData({ metaTitle: e.target.value })}
              placeholder={t('blogEditor.seoTitlePlaceholder')}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="text-xs text-neutral-400 mt-1">
              {(formData.metaTitle || formData.title).length}/60 {t('blogEditor.characters')}
            </p>
          </div>

          {/* Meta Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label htmlFor="meta-description" className="block text-sm font-medium text-neutral-700 mb-2">
              {t('blogEditor.metaDescription')}
            </label>
            <textarea
              id="meta-description"
              value={formData.metaDescription}
              onChange={(e) => updateFormData({ metaDescription: e.target.value })}
              placeholder={t('blogEditor.metaDescPlaceholder')}
              rows={3}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="text-xs text-neutral-400 mt-1">
              {(formData.metaDescription || formData.excerpt).length}/160 {t('blogEditor.characters')}
            </p>
          </div>

          {/* Keywords */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label htmlFor="keyword-input" className="block text-sm font-medium text-neutral-700 mb-2">{t('blogEditor.keywords')}</label>
            <div className="flex gap-2 mb-3">
              <input
                id="keyword-input"
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                placeholder={t('blogEditor.keywordPlaceholder')}
                className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg"
              />
              <button
                onClick={addKeyword}
                className="px-4 py-2 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  {keyword}
                  <button onClick={() => removeKeyword(keyword)} className="hover:text-primary-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label htmlFor="tag-input" className="block text-sm font-medium text-neutral-700 mb-2">{t('blogEditor.tags')}</label>
            <div className="flex gap-2 mb-3">
              <input
                id="tag-input"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder={t('blogEditor.tagPlaceholder')}
                className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-neutral-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sources Tab */}
      {activeTab === 'sources' && (
        <div className="space-y-6">
          {/* Sources */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="block text-sm font-medium text-neutral-700">{t('blogEditor.sources')}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSourcesImportModal(true)}
                  className="text-sm text-neutral-600 hover:text-neutral-700 flex items-center gap-1"
                >
                  <Upload className="w-4 h-4" /> {t('blogEditor.import')}
                </button>
                <button
                  onClick={addSource}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> {t('blogEditor.addSource')}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {formData.sources.map((source, index) => (
                <div key={index} className="p-4 border border-neutral-200 rounded-xl space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium text-neutral-500">{t('blogEditor.sourceNumber', { number: index + 1 })}</span>
                    <button
                      onClick={() => removeSource(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={source.title}
                      onChange={(e) => updateSource(index, { title: e.target.value })}
                      placeholder={t('blogEditor.sourceTitle')}
                      className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-neutral-400" />
                      <input
                        type="url"
                        value={source.url}
                        onChange={(e) => updateSource(index, { url: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <textarea
                    value={source.description}
                    onChange={(e) => updateSource(index, { description: e.target.value })}
                    placeholder={t('blogEditor.sourceDesc')}
                    rows={2}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm resize-none"
                  />
                </div>
              ))}

              {formData.sources.length === 0 && (
                <p className="text-sm text-neutral-400 py-4 text-center">
                  {t('blogEditor.noSources')}
                </p>
              )}
            </div>
          </div>

          {/* Additional Images Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <ImageIcon className="w-5 h-5 text-neutral-400" />
              <span className="block text-sm font-medium text-neutral-700">{t('blogEditor.imagesInArticle')}</span>
            </div>
            <p className="text-sm text-neutral-500">
              {t('blogEditor.imagesInfo')}
            </p>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <BlogPreview
          title={formData.title}
          excerpt={formData.excerpt}
          content={formData.content}
          featuredImageUrl={formData.featuredImageUrl}
          featuredImageAlt={formData.featuredImageAlt}
          category={formData.category}
          keywords={formData.keywords}
          tags={formData.tags}
          summaryPoints={formData.summaryPoints}
          sources={formData.sources}
          faq={formData.faq}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* Import Text Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-neutral-900">{t('blogEditor.importTextTitle')}</h3>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportText('');
                }}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-auto">
              <p className="text-sm text-neutral-600 mb-4">
                {t('blogEditor.importTextHint')}
              </p>
              <ul className="text-sm text-neutral-500 mb-4 list-disc list-inside space-y-1">
                <li>{t('blogEditor.importTextHint1')}</li>
                <li>{t('blogEditor.importTextHint2')}</li>
                <li>{t('blogEditor.importTextHint3')}</li>
              </ul>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="## Erste Überschrift

Hier kommt der erste Absatz. Er kann mehrere Sätze enthalten.

Hier ist ein weiterer Absatz unter der gleichen Überschrift.

## Zweite Überschrift

Und hier geht es weiter mit neuem Inhalt..."
                rows={15}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
              />
            </div>

            <div className="flex items-center justify-between p-6 border-t bg-neutral-50 rounded-b-2xl">
              <p className="text-sm text-neutral-500">
                {importText.trim() ? t('blogEditor.sectionsDetected', { count: parseTextToSections(importText).length }) : t('blogEditor.noTextYet')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportText('');
                  }}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-200 rounded-lg transition"
                >
                  {t('blogEditor.cancel')}
                </button>
                <button
                  onClick={handleImportText}
                  disabled={!importText.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('blogEditor.import')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Summary Points Modal */}
      {showSummaryImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-neutral-900">{t('blogEditor.importSummaryTitle')}</h3>
              <button
                onClick={() => {
                  setShowSummaryImportModal(false);
                  setSummaryImportText('');
                }}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-auto">
              <p className="text-sm text-neutral-600 mb-4">
                {t('blogEditor.importSummaryHint')}
              </p>
              <ul className="text-sm text-neutral-500 mb-4 list-disc list-inside space-y-1">
                <li>{t('blogEditor.importSummaryHint1')}</li>
                <li>{t('blogEditor.importSummaryHint2')}</li>
              </ul>
              <textarea
                value={summaryImportText}
                onChange={(e) => setSummaryImportText(e.target.value)}
                placeholder="- Erster wichtiger Punkt
- Zweiter Punkt zur Zusammenfassung
- Dritter Kernaspekt des Artikels"
                rows={10}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>

            <div className="flex items-center justify-between p-6 border-t bg-neutral-50 rounded-b-2xl">
              <p className="text-sm text-neutral-500">
                {summaryImportText.trim() ? t('blogEditor.pointsDetected', { count: parseSummaryPoints(summaryImportText).length }) : t('blogEditor.noTextYet')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSummaryImportModal(false);
                    setSummaryImportText('');
                  }}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-200 rounded-lg transition"
                >
                  {t('blogEditor.cancel')}
                </button>
                <button
                  onClick={handleImportSummary}
                  disabled={!summaryImportText.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('blogEditor.import')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Sources Modal */}
      {showSourcesImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-neutral-900">{t('blogEditor.importSourcesTitle')}</h3>
              <button
                onClick={() => {
                  setShowSourcesImportModal(false);
                  setSourcesImportText('');
                }}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-auto">
              <p className="text-sm text-neutral-600 mb-4">
                {t('blogEditor.importSourcesHint')}
              </p>
              <ul className="text-sm text-neutral-500 mb-4 list-disc list-inside space-y-1">
                <li>{t('blogEditor.importSourcesHint1')}</li>
                <li>{t('blogEditor.importSourcesHint2')}</li>
                <li>{t('blogEditor.importSourcesHint3')}</li>
              </ul>
              <textarea
                value={sourcesImportText}
                onChange={(e) => setSourcesImportText(e.target.value)}
                placeholder="Beck, A.T. (2021): Cognitive Therapy https://example.com/article
WHO Guideline zur Depression | https://who.int/depression | Internationale Leitlinie
Studie zur Wirksamkeit von Psychotherapie"
                rows={10}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>

            <div className="flex items-center justify-between p-6 border-t bg-neutral-50 rounded-b-2xl">
              <p className="text-sm text-neutral-500">
                {sourcesImportText.trim() ? t('blogEditor.sourcesDetected', { count: parseSources(sourcesImportText).length }) : t('blogEditor.noTextYet')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSourcesImportModal(false);
                    setSourcesImportText('');
                  }}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-200 rounded-lg transition"
                >
                  {t('blogEditor.cancel')}
                </button>
                <button
                  onClick={handleImportSources}
                  disabled={!sourcesImportText.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('blogEditor.import')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Article Import Modal */}
      {showFullImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{t('blogEditor.fullImportTitle')}</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {t('blogEditor.fullImportDesc')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="px-3 py-1.5 text-sm bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition"
                >
                  {t('blogEditor.showTemplate')}
                </button>
                <button
                  onClick={() => {
                    setShowFullImportModal(false);
                    setFullImportText('');
                    setFullImportPreview(null);
                  }}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {!fullImportPreview ? (
                <>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                    <h4 className="font-medium text-emerald-800 mb-2">{t('blogEditor.howItWorks')}</h4>
                    <ol className="text-sm text-emerald-700 space-y-1 list-decimal list-inside">
                      <li>{t('blogEditor.howItWorksStep1')}</li>
                      <li>{t('blogEditor.howItWorksStep2')}</li>
                      <li>{t('blogEditor.howItWorksStep3')}</li>
                      <li>{t('blogEditor.howItWorksStep4')}</li>
                      <li>{t('blogEditor.howItWorksStep5')}</li>
                    </ol>
                  </div>
                  <textarea
                    value={fullImportText}
                    onChange={(e) => setFullImportText(e.target.value)}
                    placeholder="Füge hier den generierten Artikel im Template-Format ein...

---META---
Titel: Dein Artikel-Titel
Slug: dein-artikel-slug
Kategorie: Angststörungen
...

Der Parser erkennt automatisch alle Abschnitte und korrigiert kleine Formatfehler."
                    rows={18}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
                  />
                </>
              ) : (
                <div className="space-y-4">
                  {/* Warnings */}
                  {fullImportPreview.parseWarnings.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {t('blogEditor.warnings')} ({fullImportPreview.parseWarnings.length})
                      </h4>
                      <ul className="text-sm text-amber-700 space-y-1">
                        {fullImportPreview.parseWarnings.map((w, i) => (
                          <li key={i}>• {w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Preview Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Meta */}
                    <div className="bg-neutral-50 rounded-xl p-4">
                      <h4 className="font-medium text-neutral-700 mb-3">{t('blogEditor.metaData')}</h4>
                      <dl className="space-y-2 text-sm">
                        <div>
                          <dt className="text-neutral-500">{t('blogEditor.title')}</dt>
                          <dd className="font-medium">{fullImportPreview.title || '—'}</dd>
                        </div>
                        <div>
                          <dt className="text-neutral-500">Slug</dt>
                          <dd className="font-mono text-xs">{fullImportPreview.slug || '—'}</dd>
                        </div>
                        <div>
                          <dt className="text-neutral-500">{t('blogEditor.category')}</dt>
                          <dd>{fullImportPreview.category}</dd>
                        </div>
                        <div>
                          <dt className="text-neutral-500">{t('blogEditor.readingTime')}</dt>
                          <dd>{fullImportPreview.readingTime}</dd>
                        </div>
                      </dl>
                    </div>

                    {/* Content Overview */}
                    <div className="bg-neutral-50 rounded-xl p-4">
                      <h4 className="font-medium text-neutral-700 mb-3">{t('blogEditor.content')}</h4>
                      <dl className="space-y-2 text-sm">
                        <div>
                          <dt className="text-neutral-500">{t('blogEditor.shortDescription')}</dt>
                          <dd className="line-clamp-2">{fullImportPreview.excerpt || '—'}</dd>
                        </div>
                        <div>
                          <dt className="text-neutral-500">{t('blogEditor.summary')}</dt>
                          <dd>{fullImportPreview.summaryPoints.length} {t('blogEditor.points')}</dd>
                        </div>
                        <div>
                          <dt className="text-neutral-500">{t('blogEditor.contentSectionsPreview')}</dt>
                          <dd>{fullImportPreview.content.sections.length} {t('blogEditor.sections')}</dd>
                        </div>
                        <div>
                          <dt className="text-neutral-500">{t('blogEditor.faq')}</dt>
                          <dd>{fullImportPreview.faq.length} {t('blogEditor.questions')}</dd>
                        </div>
                        <div>
                          <dt className="text-neutral-500">{t('blogEditor.sources')}</dt>
                          <dd>{fullImportPreview.sources.length} {t('blogEditor.sources')}</dd>
                        </div>
                      </dl>
                    </div>

                    {/* SEO */}
                    <div className="bg-neutral-50 rounded-xl p-4">
                      <h4 className="font-medium text-neutral-700 mb-3">{t('blogEditor.seo')}</h4>
                      <dl className="space-y-2 text-sm">
                        <div>
                          <dt className="text-neutral-500">{t('blogEditor.metaTitleLabel')}</dt>
                          <dd className="line-clamp-1">{fullImportPreview.metaTitle || '—'}</dd>
                        </div>
                        <div>
                          <dt className="text-neutral-500">{t('blogEditor.keywords')}</dt>
                          <dd className="flex flex-wrap gap-1 mt-1">
                            {fullImportPreview.keywords.slice(0, 5).map((k, i) => (
                              <span key={i} className="px-2 py-0.5 bg-neutral-200 rounded text-xs">{k}</span>
                            ))}
                            {fullImportPreview.keywords.length === 0 && '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-neutral-500">{t('blogEditor.tags')}</dt>
                          <dd className="flex flex-wrap gap-1 mt-1">
                            {fullImportPreview.tags.slice(0, 5).map((tg, i) => (
                              <span key={i} className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs">{tg}</span>
                            ))}
                            {fullImportPreview.tags.length === 0 && '—'}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {/* Bild */}
                    <div className="bg-neutral-50 rounded-xl p-4">
                      <h4 className="font-medium text-neutral-700 mb-3">{t('blogEditor.featuredImage')}</h4>
                      {fullImportPreview.featuredImageUrl ? (
                        <div className="relative aspect-video bg-neutral-200 rounded-lg overflow-hidden">
                          <Image
                            src={fullImportPreview.featuredImageUrl}
                            alt={fullImportPreview.featuredImageAlt}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-500">{t('blogEditor.noImageFound')}</p>
                      )}
                    </div>
                  </div>

                  {/* Sections Preview */}
                  {fullImportPreview.content.sections.length > 0 && (
                    <div className="bg-neutral-50 rounded-xl p-4">
                      <h4 className="font-medium text-neutral-700 mb-3">{t('blogEditor.contentSectionsPreview')}</h4>
                      <div className="space-y-2">
                        {fullImportPreview.content.sections.map((section, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm">
                            <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-medium flex-shrink-0">
                              {i + 1}
                            </span>
                            <div>
                              <p className="font-medium">{section.heading}</p>
                              <p className="text-neutral-500 text-xs">
                                {t('blogEditor.paragraphCount', { count: section.paragraphs.length })}
                                {section.list ? t('blogEditor.listPoints', { count: section.list.length }) : ''}
                                {section.image ? t('blogEditor.oneImage') : ''}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-6 border-t bg-neutral-50 rounded-b-2xl">
              <p className="text-sm text-neutral-500">
                {fullImportPreview
                  ? t('blogEditor.readyToImport', { count: fullImportPreview.content.sections.length })
                  : fullImportText.trim()
                    ? t('blogEditor.clickPreview')
                    : t('blogEditor.pasteArticle')}
              </p>
              <div className="flex gap-3">
                {fullImportPreview ? (
                  <>
                    <button
                      onClick={() => setFullImportPreview(null)}
                      className="px-4 py-2 text-neutral-600 hover:bg-neutral-200 rounded-lg transition"
                    >
                      {t('blogEditor.back')}
                    </button>
                    <button
                      onClick={handleFullImport}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                    >
                      {t('blogEditor.import')}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setShowFullImportModal(false);
                        setFullImportText('');
                      }}
                      className="px-4 py-2 text-neutral-600 hover:bg-neutral-200 rounded-lg transition"
                    >
                      {t('blogEditor.cancel')}
                    </button>
                    <button
                      onClick={handleFullImportPreview}
                      disabled={!fullImportText.trim()}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('blogEditor.preview')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{t('blogEditor.templateTitle')}</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {t('blogEditor.templateDesc')}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowTemplateModal(false);
                  setTemplateCopied(false);
                }}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                <p className="text-sm text-emerald-700">
                  {t('blogEditor.templateTip')}
                </p>
              </div>
              <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-xl text-xs font-mono whitespace-pre-wrap overflow-auto max-h-[50vh]">
                {DEEP_RESEARCH_PROMPT}
              </pre>
            </div>

            <div className="flex items-center justify-between p-6 border-t bg-neutral-50 rounded-b-2xl">
              <p className="text-sm text-neutral-500">
                {t('blogEditor.templateContains')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowTemplateModal(false);
                    setTemplateCopied(false);
                  }}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-200 rounded-lg transition"
                >
                  {t('blogEditor.close')}
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(DEEP_RESEARCH_PROMPT);
                    setTemplateCopied(true);
                    setTimeout(() => setTemplateCopied(false), 2000);
                  }}
                  className={`px-4 py-2 rounded-lg transition inline-flex items-center gap-2 min-w-[120px] justify-center ${
                    templateCopied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {templateCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      {t('blogEditor.copied')}
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      {t('blogEditor.copy')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
