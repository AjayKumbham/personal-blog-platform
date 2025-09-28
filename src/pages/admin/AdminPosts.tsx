// React
import React, { useEffect } from 'react';

// Third-party
import {
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Tag
} from 'lucide-react';

// Local components
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Hooks
import { useAdminPosts } from '../../hooks/admin/useAdminPosts';
import { useAdminNavigation } from '../../hooks/useAdminNavigation';

const AdminPosts: React.FC = () => {
  const {
    posts,
    loadingPosts,
    loadPosts,
    handleDeletePost,
    togglePublished
  } = useAdminPosts();
  const { navigateToAdmin } = useAdminNavigation();

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loadingPosts) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Posts Management</h1>
          <p className="text-gray-600 mt-1">Create, edit, and manage your blog posts</p>
        </div>
        <Button 
          icon={PlusCircle} 
          className="w-full sm:w-auto"
          onClick={() => navigateToAdmin('/admin/posts/new')}
        >
          New Post
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get started by creating your first blog post. Share your thoughts, tutorials, or insights with your audience.
            </p>
            <Button 
              icon={PlusCircle} 
              size="lg"
              onClick={() => navigateToAdmin('/admin/posts/new')}
            >
              Create Your First Post
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">All Posts ({posts.length})</h3>
          </div>
          
          {/* Posts Grid - Clean Card Layout */}
          <div className="p-6">
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Post Info - Left Side */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {post.title}
                            </h3>
                            {post.featured && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 flex-shrink-0">
                                ⭐ Featured
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                          post.published
                            ? 'bg-gray-100 text-gray-700 border border-gray-200'
                            : 'bg-gray-50 text-gray-600 border border-gray-200'
                        }`}>
                          {post.published ? (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Draft
                            </>
                          )}
                        </span>

                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(post.publishedAt)}
                        </div>

                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readTime} min read
                        </div>
                      </div>

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {post.tags.slice(0, 4).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 4 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                              +{post.tags.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions - Right Side */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-32 flex-shrink-0">
                      <button
                        onClick={() => togglePublished(post.id)}
                        className={`inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          post.published
                            ? 'text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200'
                            : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        {post.published ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-1" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            Publish
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => navigateToAdmin(`/admin/posts/edit/${post.id}`)}
                        className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg text-gray-600 bg-white hover:bg-gray-50 border border-gray-300 hover:text-red-600 hover:border-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminPosts;