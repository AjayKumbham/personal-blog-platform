import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { blogService } from '../services/blogService';
import { BlogPost as BlogPostType } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPost = React.useCallback(async () => {
    try {
      const [postData, allPosts] = await Promise.all([
        blogService.getPostBySlug(slug!),
        blogService.getPublishedPosts(),
      ]);
      
      if (postData) {
        setPost(postData);
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
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeBlockContent = '';
    let codeBlockLanguage = '';
    
    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          elements.push(
            <div key={`code-${index}`} className="my-6">
              <div className="bg-gray-800 text-gray-100 rounded-t-lg px-4 py-2 text-sm font-mono">
                {codeBlockLanguage || 'code'}
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto">
                <code className="text-sm font-mono leading-relaxed">{codeBlockContent}</code>
              </pre>
            </div>
          );
          inCodeBlock = false;
          codeBlockContent = '';
          codeBlockLanguage = '';
        } else {
          // Start code block
          inCodeBlock = true;
          codeBlockLanguage = line.slice(3).trim();
        }
        return;
      }
      
      if (inCodeBlock) {
        codeBlockContent += line + '\n';
        return;
      }
      
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-4xl font-bold text-gray-900 mt-12 mb-6 leading-tight">
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-3xl font-bold text-gray-900 mt-10 mb-5 leading-tight">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4 leading-tight">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <ul key={index} className="ml-6 mb-2">
            <li className="text-gray-700 leading-relaxed list-disc">
              {line.slice(2)}
            </li>
          </ul>
        );
      } else if (line.startsWith('`') && line.endsWith('`') && line.length > 2) {
        elements.push(
          <p key={index} className="mb-4">
            <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
              {line.slice(1, -1)}
            </code>
          </p>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={index} className="mb-4" />);
      } else if (line.trim() !== '') {
        elements.push(
          <p key={index} className="mb-6 text-gray-700 leading-relaxed text-lg">
            {line}
          </p>
        );
      }
    });
    
    return elements;
  };

  return (
    <article className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-blue-300 hover:text-white mb-12 transition-colors text-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-4 py-2 bg-blue-800 text-blue-100 text-sm font-medium rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8 text-blue-200 text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {format(post.publishedAt, 'MMMM d, yyyy')}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {post.readTime} min read
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={handleShare}
              icon={Share2}
              className="border-white text-white hover:bg-white hover:text-slate-900 text-lg px-6 py-3"
            >
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 mb-12">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-80 object-cover rounded-xl shadow-2xl"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Card className="p-8 md:p-12">
          <div className="prose prose-xl max-w-none">
            <div className="blog-content">
              {formatContent(post.content)}
            </div>
          </div>
        </Card>

        {/* Related Posts */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">More Posts</h3>
          {relatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map(relatedPost => (
                <Card
                  key={relatedPost.id}
                  className="p-6 hover:shadow-xl transition-all duration-300"
                >
                  <Link to={`/blog/${relatedPost.slug}`} className="block">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg hover:text-blue-600 transition-colors">
                      {relatedPost.title}
                    </h4>
                    <p className="text-gray-600 mb-4 leading-relaxed">{relatedPost.excerpt}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(relatedPost.publishedAt, 'MMM d, yyyy')}
                      <Clock className="w-4 h-4 ml-4 mr-1" />
                      {relatedPost.readTime} min read
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No related posts available.</p>
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogPost;