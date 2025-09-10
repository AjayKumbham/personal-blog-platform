import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import { blogService } from '../../services/blogService';
import { settingsService } from '../../services/settingsService';
import { publishToHashnode, publishToDevTo } from '../../services/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  slug: yup.string().required('Slug is required'),
  excerpt: yup.string().required('Excerpt is required'),
  content: yup.string().required('Content is required'),
  tags: yup.string().required('Tags are required'),
  readTime: yup.number().positive('Read time must be positive').required('Read time is required'),
  featured: yup.boolean(),
  published: yup.boolean(),
});

type FormData = yup.InferType<typeof schema>;

const EditPost: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [autoPublish, setAutoPublish] = useState({
    hashnode: false,
    devTo: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const watchedData = watch();
  const { title, content } = watchedData;

  const loadPost = React.useCallback(async () => {
    try {
      const posts = await blogService.getAllPosts();
      const post = posts.find(p => p.id === id);
      
      if (post) {
        setValue('title', post.title);
        setValue('slug', post.slug);
        setValue('excerpt', post.excerpt);
        setValue('content', post.content);
        setValue('tags', post.tags.join(', '));
        setValue('readTime', post.readTime);
        setValue('featured', post.featured);
        setValue('published', post.published);
        
        if (post.coverImage) {
          setCoverImageUrl(post.coverImage);
        }
      }
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setInitialLoading(false);
    }
  }, [id, setValue]);

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id, loadPost]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverImageUrl(previewUrl);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    
    setLoading(true);
    try {
      let finalCoverImageUrl = coverImageUrl;

      // Upload new cover image if selected
      if (coverImage) {
        try {
          finalCoverImageUrl = await blogService.uploadCoverImage(coverImage);
        } catch (error) {
          console.error('Error uploading image:', error);
          // Keep existing image if upload fails
        }
      }

      // Update the post
      await blogService.updatePost(id, {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        tags: data.tags.split(',').map(tag => tag.trim()),
        readTime: data.readTime,
        featured: data.featured,
        published: data.published,
        coverImage: finalCoverImageUrl || null,
      });

      // Auto-publish to external platforms if enabled and post is published
      if (data.published) {
        const settings = await settingsService.getSiteSettings();

        if (autoPublish.hashnode && settings.hashnodeApiKey && settings.hashnodePublicationId) {
          try {
            await publishToHashnode(
              {
                id: id,
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                content: data.content,
                tags: data.tags.split(',').map(tag => tag.trim()),
                publishedAt: new Date(),
                readTime: data.readTime,
                featured: data.featured,
                published: data.published,
                coverImage: finalCoverImageUrl || undefined,
              },
              settings.hashnodeApiKey,
              settings.hashnodePublicationId
            );
          } catch (error) {
            console.error('Failed to publish to Hashnode:', error);
          }
        }

        if (autoPublish.devTo && settings.devToApiKey) {
          try {
            await publishToDevTo(
              {
                id: id,
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                content: data.content,
                tags: data.tags.split(',').map(tag => tag.trim()),
                publishedAt: new Date(),
                readTime: data.readTime,
                featured: data.featured,
                published: data.published,
                coverImage: finalCoverImageUrl || undefined,
              },
              settings.devToApiKey,
              settings.siteUrl
            );
          } catch (error) {
            console.error('Failed to publish to Dev.to:', error);
          }
        }
      }

      navigate('/admin');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post');
    } finally {
      setLoading(false);
    }
  };

  const formatPreviewContent = (content: string) => {
    if (!content) return [];
    
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeBlockContent = '';
    let codeBlockLanguage = '';
    
    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <div key={`code-${index}`} className="my-4">
              <div className="bg-gray-800 text-gray-100 rounded-t-lg px-3 py-2 text-xs font-mono">
                {codeBlockLanguage || 'code'}
              </div>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-b-lg overflow-x-auto">
                <code className="text-xs font-mono leading-relaxed">{codeBlockContent}</code>
              </pre>
            </div>
          );
          inCodeBlock = false;
          codeBlockContent = '';
          codeBlockLanguage = '';
        } else {
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
          <h1 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3 leading-tight">
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-xl font-bold text-gray-900 mt-5 mb-2 leading-tight">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-lg font-bold text-gray-900 mt-4 mb-2 leading-tight">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <ul key={index} className="ml-4 mb-2">
            <li className="text-gray-700 leading-relaxed list-disc text-sm">
              {line.slice(2)}
            </li>
          </ul>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={index} className="mb-2" />);
      } else if (line.trim() !== '') {
        elements.push(
          <p key={index} className="mb-3 text-gray-700 leading-relaxed text-sm">
            {line}
          </p>
        );
      }
    });
    
    return elements;
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            icon={ArrowLeft}
            className="mb-4"
          >
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
        </div>

        {/* Preview/Edit Toggle */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !showPreview 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showPreview 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {!showPreview ? (
                <Card className="p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        {...register('title')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                        placeholder="Enter post title"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug *
                      </label>
                      <input
                        {...register('slug')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="post-slug"
                      />
                      {errors.slug && (
                        <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Excerpt *
                      </label>
                      <textarea
                        {...register('excerpt')}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Brief description of the post"
                      />
                      {errors.excerpt && (
                        <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content *
                      </label>
                      <textarea
                        {...register('content')}
                        rows={25}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        placeholder="Write your post content in Markdown..."
                      />
                      {errors.content && (
                        <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {title || 'Post Title'}
                      </h1>
                      {coverImageUrl && (
                        <img
                          src={coverImageUrl}
                          alt="Cover preview"
                          className="w-full h-64 object-cover rounded-lg mb-6"
                        />
                      )}
                      <div className="prose max-w-none">
                        {content ? formatPreviewContent(content) : (
                          <p className="text-gray-500 italic">Start writing to see preview...</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Post Settings */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags *
                    </label>
                    <input
                      {...register('tags')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="React, TypeScript, Web Development"
                    />
                    {errors.tags && (
                      <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Read Time (minutes) *
                    </label>
                    <input
                      {...register('readTime')}
                      type="number"
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.readTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.readTime.message}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      {...register('featured')}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Featured Post
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      {...register('published')}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Published
                    </label>
                  </div>
                </div>
              </Card>

              {/* Cover Image */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cover Image</h3>
                <div className="space-y-4">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="cover-image"
                    />
                    <label
                      htmlFor="cover-image"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload new image</p>
                    </label>
                  </div>
                  {coverImageUrl && (
                    <img
                      src={coverImageUrl}
                      alt="Cover preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </Card>

              {/* Auto-publish Settings */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Auto-publish</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={autoPublish.hashnode}
                      onChange={(e) => setAutoPublish(prev => ({ ...prev, hashnode: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Publish to Hashnode
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={autoPublish.devTo}
                      onChange={(e) => setAutoPublish(prev => ({ ...prev, devTo: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Publish to Dev.to
                    </label>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  loading={loading}
                  icon={Save}
                  className="w-full"
                >
                  Update Post
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;