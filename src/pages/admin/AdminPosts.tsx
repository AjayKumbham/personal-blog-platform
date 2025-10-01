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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Posts Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Create, edit, and manage your blog posts</p>
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
        <Card className="p-6 sm:p-8 lg:p-12">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm sm:text-base">
              Get started by creating your first blog post. Share your thoughts, tutorials, or insights with your audience.
            </p>
            <Button 
              icon={PlusCircle} 
              size="lg"
              onClick={() => navigateToAdmin('/admin/posts/new')}
              className="w-full sm:w-auto"
            >
              Create Your First Post
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">All Posts ({posts.length})</h3>
          </div>
          
          {/* Posts Grid - Clean Card Layout */}
          <div className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="group bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                >
                  <div className="flex flex-col xl:flex-row xl:items-center gap-4">
                    {/* Post Info - Left Side */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                              {post.title}
                            </h3>
                            {post.featured && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 flex-shrink-0 w-fit">
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
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500">
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
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="hidden sm:inline">{formatDate(post.publishedAt)}</span>
                          <span className="sm:hidden">{formatDate(post.publishedAt).split(',')[0]}</span>
                        </div>

                        <div className="flex items-center">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {post.readTime} min
                        </div>
                      </div>

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              <span className="truncate max-w-20 sm:max-w-none">{tag}</span>
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions - Right Side */}
                    <div className="flex flex-row sm:flex-col xl:flex-col gap-2 xl:w-32 flex-shrink-0">
                      <button
                        onClick={() => togglePublished(post.id)}
                        className={`inline-flex items-center justify-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex-1 sm:flex-none ${
                          post.published
                            ? 'text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200'
                            : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        {post.published ? (
                          <>
                            <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="hidden sm:inline">Unpublish</span>
                            <span className="sm:hidden">Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="hidden sm:inline">Publish</span>
                            <span className="sm:hidden">Show</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => navigateToAdmin(`/admin/posts/edit/${post.id}`)}
                        className="inline-flex items-center justify-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 transition-colors flex-1 sm:flex-none"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="inline-flex items-center justify-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg text-gray-600 bg-white hover:bg-gray-50 border border-gray-300 hover:text-red-600 hover:border-red-200 transition-colors flex-1 sm:flex-none"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="hidden sm:inline">Delete</span>
                        <span className="sm:hidden">Del</span>
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