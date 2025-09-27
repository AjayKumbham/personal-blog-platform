// React
import React, { useEffect } from 'react';

// Third-party
import { FileText, Eye, Edit, Users } from 'lucide-react';

// Local components
import StatsCard from '../../components/admin/shared/StatsCard';
import Card from '../../components/ui/Card';

// Hooks
import { useAdminPosts } from '../../hooks/admin/useAdminPosts';

const AdminDashboard: React.FC = () => {
  const { posts, loadingPosts, loadPosts } = useAdminPosts();

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const stats = [
    { icon: FileText, label: 'Total Posts', value: posts.length },
    { icon: Eye, label: 'Published', value: posts.filter(p => p.published).length },
    { icon: Edit, label: 'Drafts', value: posts.filter(p => !p.published).length },
    { icon: Users, label: 'Featured', value: posts.filter(p => p.featured).length }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your blog's performance and recent activity</p>
      </div>

      {loadingPosts ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatsCard
                key={index}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
              />
            ))}
          </div>

          {/* Recent Posts */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
            <div className="space-y-4">
              {posts.slice(0, 5).map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{post.title}</h4>
                    <p className="text-sm text-gray-600">
                      {post.published ? 'Published' : 'Draft'} • {post.readTime} min read
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;