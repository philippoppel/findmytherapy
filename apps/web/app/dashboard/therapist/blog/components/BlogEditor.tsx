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
} from 'lucide-react';
import BlogPreview from './BlogPreview';

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

const CATEGORIES = [
  'Angst & Panik',
  'Depression',
  'Burnout & Stress',
  'Beziehungen',
  'Trauma',
  'Selbstwert',
  'Schlaf',
  'Allgemein',
];

type BlogEditorProps = {
  initialData?: BlogPostData;
  isEditing?: boolean;
};

export default function BlogEditor({ initialData, isEditing }: BlogEditorProps) {
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
        throw new Error(data.error || 'Upload fehlgeschlagen');
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
      setError('Fehler beim Hochladen des Bildes');
    }
  };

  // Save and publish
  const handleSave = async (publish = false) => {
    setError(null);

    if (!formData.title.trim()) {
      setError('Bitte geben Sie einen Titel ein');
      return;
    }

    if (!formData.excerpt.trim()) {
      setError('Bitte geben Sie einen Auszug ein');
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
        throw new Error(data.error || 'Fehler beim Speichern');
      }

      // If publishing, make a second request
      if (publish) {
        const publishRes = await fetch(`/api/therapist/blog/${data.post.id}/publish`, {
          method: 'POST',
        });

        if (!publishRes.ok) {
          throw new Error('Fehler beim Veröffentlichen');
        }
      }

      router.push('/dashboard/therapist/blog');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
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
              {isEditing ? 'Beitrag bearbeiten' : 'Neuer Beitrag'}
            </h1>
            <p className="text-sm text-neutral-500">
              {isEditing ? `Slug: ${initialData?.slug}` : 'Erstellen Sie einen neuen Fachartikel'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Vorschau</span>
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving || publishing}
            className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Speichern
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving || publishing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Veröffentlichen
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
          { id: 'content', label: 'Inhalt' },
          { id: 'seo', label: 'SEO & Meta' },
          { id: 'sources', label: 'Quellen' },
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
            <label htmlFor="blog-author" className="block text-sm font-medium text-neutral-700 mb-2">Autor:in *</label>
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
            <label htmlFor="blog-title" className="block text-sm font-medium text-neutral-700 mb-2">Titel *</label>
            <input
              id="blog-title"
              type="text"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              placeholder="z.B. Panikattacken verstehen und bewältigen"
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label htmlFor="blog-excerpt" className="block text-sm font-medium text-neutral-700 mb-2">
              Auszug / Kurzbeschreibung *
            </label>
            <textarea
              id="blog-excerpt"
              value={formData.excerpt}
              onChange={(e) => updateFormData({ excerpt: e.target.value })}
              placeholder="Eine kurze Zusammenfassung des Artikels (erscheint in der Vorschau)"
              rows={3}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <span className="block text-sm font-medium text-neutral-700 mb-2">Titelbild</span>
            <div className="space-y-4">
              {formData.featuredImageUrl ? (
                <div className="relative aspect-[2/1] rounded-xl overflow-hidden bg-neutral-100">
                  <Image
                    src={formData.featuredImageUrl}
                    alt={formData.featuredImageAlt || 'Titelbild'}
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
                  <p className="text-neutral-600">Bild hochladen</p>
                  <p className="text-sm text-neutral-400">oder Bild-URL unten eingeben</p>
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
                  <label htmlFor="featured-image-url" className="block text-xs text-neutral-500 mb-1">Bild-URL (extern)</label>
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
                  <label htmlFor="featured-image-alt" className="block text-xs text-neutral-500 mb-1">Alt-Text</label>
                  <input
                    id="featured-image-alt"
                    type="text"
                    value={formData.featuredImageAlt}
                    onChange={(e) => updateFormData({ featuredImageAlt: e.target.value })}
                    placeholder="Bildbeschreibung für Barrierefreiheit"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label htmlFor="blog-category" className="block text-sm font-medium text-neutral-700 mb-2">Kategorie</label>
            <select
              id="blog-category"
              value={formData.category}
              onChange={(e) => updateFormData({ category: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Kategorie wählen</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Summary Points */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="block text-sm font-medium text-neutral-700">
                Auf einen Blick (Zusammenfassung)
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSummaryImportModal(true)}
                  className="text-sm text-neutral-600 hover:text-neutral-700 flex items-center gap-1"
                >
                  <Upload className="w-4 h-4" /> Importieren
                </button>
                <button
                  onClick={addSummaryPoint}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Punkt hinzufügen
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
                    placeholder="Wichtiger Punkt..."
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
                  Keine Zusammenfassungspunkte. Klicken Sie auf &quot;Punkt hinzufügen&quot;.
                </p>
              )}
            </div>
          </div>

          {/* Content Sections */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="block text-sm font-medium text-neutral-700">Inhaltssektionen</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowImportModal(true)}
                  className="text-sm text-neutral-600 hover:text-neutral-700 flex items-center gap-1"
                >
                  <Upload className="w-4 h-4" /> Text importieren
                </button>
                <button
                  onClick={addSection}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Sektion hinzufügen
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
                        {section.heading || `Sektion ${sectionIndex + 1}`}
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
                        aria-label={isExpanded ? 'Sektion zuklappen' : 'Sektion aufklappen'}
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
                          <label htmlFor={`section-heading-${sectionIndex}`} className="block text-xs text-neutral-500 mb-1">Überschrift</label>
                          <input
                            id={`section-heading-${sectionIndex}`}
                            type="text"
                            value={section.heading}
                            onChange={(e) => updateSection(sectionIndex, { heading: e.target.value })}
                            placeholder="Sektionsüberschrift..."
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="block text-xs text-neutral-500">Absätze</span>
                            <button
                              onClick={() => addParagraph(sectionIndex)}
                              className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" /> Absatz
                            </button>
                          </div>
                          <div className="space-y-2">
                            {section.paragraphs.map((paragraph, pIndex) => (
                              <div key={pIndex} className="flex gap-2">
                                <textarea
                                  value={paragraph}
                                  onChange={(e) => updateParagraph(sectionIndex, pIndex, e.target.value)}
                                  placeholder="Absatztext..."
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
                            <span className="block text-xs text-neutral-500">Bild (optional)</span>
                            {!section.image && (
                              <button
                                onClick={() => updateSection(sectionIndex, {
                                  image: { src: '', alt: '', caption: '' }
                                })}
                                className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                              >
                                <ImageIcon className="w-3 h-3" /> Bild hinzufügen
                              </button>
                            )}
                          </div>

                          {section.image && (
                            <div className="space-y-3 p-3 bg-neutral-50 rounded-lg">
                              <div>
                                <label htmlFor={`section-image-src-${sectionIndex}`} className="block text-xs text-neutral-500 mb-1">Bild-URL</label>
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
                                <label htmlFor={`section-image-alt-${sectionIndex}`} className="block text-xs text-neutral-500 mb-1">Alt-Text</label>
                                <input
                                  id={`section-image-alt-${sectionIndex}`}
                                  type="text"
                                  value={section.image.alt}
                                  onChange={(e) => updateSection(sectionIndex, {
                                    image: { ...section.image!, alt: e.target.value }
                                  })}
                                  placeholder="Beschreibung des Bildes..."
                                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label htmlFor={`section-image-caption-${sectionIndex}`} className="block text-xs text-neutral-500 mb-1">Bildunterschrift (optional)</label>
                                <input
                                  id={`section-image-caption-${sectionIndex}`}
                                  type="text"
                                  value={section.image.caption || ''}
                                  onChange={(e) => updateSection(sectionIndex, {
                                    image: { ...section.image!, caption: e.target.value }
                                  })}
                                  placeholder="Bildunterschrift..."
                                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                                />
                              </div>
                              {section.image.src && (
                                <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-100">
                                  <Image
                                    src={section.image.src}
                                    alt={section.image.alt || 'Vorschau'}
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
                                <Trash2 className="w-3 h-3" /> Bild entfernen
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
                  <p>Keine Inhaltssektionen. Klicken Sie auf &quot;Sektion hinzufügen&quot;.</p>
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
              SEO Titel (optional)
            </label>
            <input
              id="meta-title"
              type="text"
              value={formData.metaTitle}
              onChange={(e) => updateFormData({ metaTitle: e.target.value })}
              placeholder="Leer lassen um Artikel-Titel zu verwenden"
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="text-xs text-neutral-400 mt-1">
              {(formData.metaTitle || formData.title).length}/60 Zeichen
            </p>
          </div>

          {/* Meta Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label htmlFor="meta-description" className="block text-sm font-medium text-neutral-700 mb-2">
              Meta-Beschreibung (optional)
            </label>
            <textarea
              id="meta-description"
              value={formData.metaDescription}
              onChange={(e) => updateFormData({ metaDescription: e.target.value })}
              placeholder="Leer lassen um Auszug zu verwenden"
              rows={3}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="text-xs text-neutral-400 mt-1">
              {(formData.metaDescription || formData.excerpt).length}/160 Zeichen
            </p>
          </div>

          {/* Keywords */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label htmlFor="keyword-input" className="block text-sm font-medium text-neutral-700 mb-2">Keywords</label>
            <div className="flex gap-2 mb-3">
              <input
                id="keyword-input"
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                placeholder="Keyword eingeben..."
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
            <label htmlFor="tag-input" className="block text-sm font-medium text-neutral-700 mb-2">Tags</label>
            <div className="flex gap-2 mb-3">
              <input
                id="tag-input"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Tag eingeben..."
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
              <span className="block text-sm font-medium text-neutral-700">Quellen</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSourcesImportModal(true)}
                  className="text-sm text-neutral-600 hover:text-neutral-700 flex items-center gap-1"
                >
                  <Upload className="w-4 h-4" /> Importieren
                </button>
                <button
                  onClick={addSource}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Quelle hinzufügen
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {formData.sources.map((source, index) => (
                <div key={index} className="p-4 border border-neutral-200 rounded-xl space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium text-neutral-500">Quelle {index + 1}</span>
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
                      placeholder="Titel der Quelle"
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
                    placeholder="Kurze Beschreibung (optional)"
                    rows={2}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm resize-none"
                  />
                </div>
              ))}

              {formData.sources.length === 0 && (
                <p className="text-sm text-neutral-400 py-4 text-center">
                  Keine Quellen. Klicken Sie auf &quot;Quelle hinzufügen&quot;.
                </p>
              )}
            </div>
          </div>

          {/* Additional Images Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <ImageIcon className="w-5 h-5 text-neutral-400" />
              <span className="block text-sm font-medium text-neutral-700">Bilder im Artikel</span>
            </div>
            <p className="text-sm text-neutral-500">
              Bilder können direkt in den Inhaltssektionen über die Bild-URL eingebunden werden.
              Sie können auch Bilder über das Titelbild-Feld hochladen und die URL kopieren.
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
              <h3 className="text-lg font-semibold text-neutral-900">Text importieren</h3>
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
                Füge deinen Text ein. Überschriften werden automatisch erkannt wenn sie:
              </p>
              <ul className="text-sm text-neutral-500 mb-4 list-disc list-inside space-y-1">
                <li>Mit ## beginnen (Markdown)</li>
                <li>Mit einem Doppelpunkt enden</li>
                <li>Kurze Zeilen gefolgt von längerem Text sind</li>
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
                {importText.trim() ? `${parseTextToSections(importText).length} Sektion(en) erkannt` : 'Noch kein Text eingefügt'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportText('');
                  }}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-200 rounded-lg transition"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleImportText}
                  disabled={!importText.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Importieren
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
              <h3 className="text-lg font-semibold text-neutral-900">Zusammenfassung importieren</h3>
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
                Füge deine Zusammenfassungspunkte ein (ein Punkt pro Zeile).
              </p>
              <ul className="text-sm text-neutral-500 mb-4 list-disc list-inside space-y-1">
                <li>Ein Punkt pro Zeile</li>
                <li>Bindestriche (-) oder Aufzählungszeichen (•) werden automatisch entfernt</li>
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
                {summaryImportText.trim() ? `${parseSummaryPoints(summaryImportText).length} Punkt(e) erkannt` : 'Noch kein Text eingefügt'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSummaryImportModal(false);
                    setSummaryImportText('');
                  }}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-200 rounded-lg transition"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleImportSummary}
                  disabled={!summaryImportText.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Importieren
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
              <h3 className="text-lg font-semibold text-neutral-900">Quellen importieren</h3>
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
                Füge deine Quellen ein (eine pro Zeile).
              </p>
              <ul className="text-sm text-neutral-500 mb-4 list-disc list-inside space-y-1">
                <li>Eine Quelle pro Zeile</li>
                <li>Optional: Titel | URL | Beschreibung</li>
                <li>URLs werden automatisch erkannt</li>
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
                {sourcesImportText.trim() ? `${parseSources(sourcesImportText).length} Quelle(n) erkannt` : 'Noch kein Text eingefügt'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSourcesImportModal(false);
                    setSourcesImportText('');
                  }}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-200 rounded-lg transition"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleImportSources}
                  disabled={!sourcesImportText.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Importieren
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
