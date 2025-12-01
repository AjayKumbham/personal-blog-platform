import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import { marked } from 'marked';
import { blogService } from '../../services/blogService';
import { settingsService } from '../../services/settingsService';
import { publishToHashnode, publishToDevTo } from '../../services/api';
import { useAdminNavigation } from '../../hooks/useAdminNavigation';
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

const NewPost: React.FC = () => {
  const { navigateToAdmin } = useAdminNavigation();
  const [loading, setLoading] = useState(false);
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
    defaultValues: {
      featured: false,
      published: false,
      readTime: 5,
    },
  });

  const watchedData = watch();
  const { title, content } = watchedData;

  // Auto-generate slug from title
  React.useEffect(() => {
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [title, setValue]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setCoverImageUrl(previewUrl);
    }
  };

  const formatPreviewContent = (content: string) => {
    if (!content) return '';
    
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    
    return marked(content);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      let finalCoverImageUrl = coverImageUrl;

      // Upload cover image if selected
      if (coverImage) {
        try {
          finalCoverImageUrl = await blogService.uploadCoverImage(coverImage);
        } catch (error) {
          console.error('Error uploading image:', error);
          // Continue without image if upload fails
          finalCoverImageUrl = '';
        }
      }

      // Create the post
      const newPost = await blogService.createPost({
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
                id: newPost.id,
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
                id: newPost.id,
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

      navigateToAdmin('/admin/posts');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigateToAdmin('/admin/posts')}
            icon={ArrowLeft}
            className="mb-4"
          >
            Back to Posts
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
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
                      <div className="prose max-w-none blog-content">
                        {content ? (
                          <div dangerouslySetInnerHTML={{ __html: formatPreviewContent(content) }} />
                        ) : (
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
                      Publish Immediately
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
                      <p className="text-sm text-gray-500">Click to upload image</p>
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
                  Create Post
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPost;