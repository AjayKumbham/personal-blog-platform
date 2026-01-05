import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Tag, ArrowLeft, Share2, User } from 'lucide-react';
import { format } from 'date-fns';
import { marked } from 'marked';
import { blogService } from '../services/blogService';
import { settingsService } from '../services/settingsService';
import { BlogPost as BlogPostType } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [authorName, setAuthorName] = useState('');

  const loadPost = React.useCallback(async () => {
    try {
      const [postData, allPosts, settings] = await Promise.all([
        blogService.getPostBySlug(slug!),
        blogService.getPublishedPosts(),
        settingsService.getSiteSettings(),
      ]);

      if (postData) {
        setPost(postData);
        setAuthorName(settings.author?.name || 'Admin');
        // Get related posts (same tags, excluding current post)
        const related = allPosts
          .filter(p => p.id !== postData.id && p.tags.some(tag => postData.tags.includes(tag)))
          .slice(0, 3);
        setRelatedPosts(related);
      } else {
        setError('Post not found');
      }
    } catch (error) {
      console.error('Error loading post:', error);
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug, loadPost]);

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const trackLength = documentHeight - windowHeight;
      const progress = (scrollTop / trackLength) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-blue-600 hover:text-blue-700">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatContent = (content: string) => {
    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    const html = marked(content);
    return html;
  };

  return (
    <article className="min-h-screen bg-gray-50">
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 z-50 transition-all duration-150"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            to="/blog"
            className="inline-flex items-center text-blue-300 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-200 text-sm font-medium rounded-full hover:bg-blue-500/30 transition-colors"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg md:text-xl text-blue-100/90 mb-8 leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex flex-wrap items-center gap-6 text-blue-200">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{format(post.publishedAt, 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={handleShare}
              icon={Share2}
              className="!border-2 !border-white/30 !bg-white/10 backdrop-blur-sm !text-white hover:!bg-white hover:!text-slate-900 hover:!border-white transition-all"
            >
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Cover Image - FIXED: Now shows full image without cropping */}
      {post.coverImage && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 md:-mt-20 relative z-10 mb-12">
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-white p-2">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto rounded-xl object-contain"
              style={{ maxHeight: '600px' }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Card className="p-6 sm:p-8 md:p-12 shadow-lg">
          <div
            className="prose prose-lg md:prose-xl max-w-none blog-content"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />
        </Card>

        {/* Share Section */}
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Enjoyed this article?</h3>
            <p className="text-gray-600 mb-6">Share it with your network!</p>
            <Button
              onClick={handleShare}
              icon={Share2}
              className="mx-auto"
            >
              Share Article
            </Button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Continue Reading</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    {relatedPost.coverImage && (
                      <div className="aspect-video overflow-hidden bg-gray-100">
                        <img
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {relatedPost.tags.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(relatedPost.publishedAt, 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {relatedPost.readTime} min
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogPost;