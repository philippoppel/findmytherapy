'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import BlogEditor from '../components/BlogEditor';

export default function EditBlogPostPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<Parameters<typeof BlogEditor>[0]['initialData'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/therapist/blog/${id}`);
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || 'Post nicht gefunden');
        }

        // Transform data for editor
        setPost({
          id: data.post.id,
          slug: data.post.slug,
          title: data.post.title,
          excerpt: data.post.excerpt,
          content: data.post.content as { sections: Array<{ heading: string; paragraphs: string[]; list?: string[] }> },
          featuredImageUrl: data.post.featuredImageUrl || '',
          featuredImageAlt: data.post.featuredImageAlt || '',
          featuredImageCaption: data.post.featuredImageCaption || '',
          metaTitle: data.post.metaTitle || '',
          metaDescription: data.post.metaDescription || '',
          keywords: data.post.keywords || [],
          tags: data.post.tags || [],
          category: data.post.category || '',
          summaryPoints: data.post.summaryPoints || [],
          faq: data.post.faq as Array<{ question: string; answer: string }> || [],
          sources: data.post.sources || [],
          images: data.post.images || [],
          relatedPostIds: data.post.relatedFrom?.map((r: { relatedPost: { id: string } }) => r.relatedPost.id) || [],
          status: data.post.status,
        });
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err instanceof Error ? err.message : 'Fehler beim Laden');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Post nicht gefunden'}</p>
        <button
          onClick={() => router.push('/dashboard/therapist/blog')}
          className="text-primary-600 hover:underline"
        >
          Zurück zur Übersicht
        </button>
      </div>
    );
  }

  return <BlogEditor initialData={post} isEditing />;
}
