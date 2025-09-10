import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, User, SortAsc } from 'lucide-react';
import { blogService } from '../services/blogService';
import { BlogPost } from '../types';
import BlogCard from '../components/blog/BlogCard';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [readTimeFilter, setReadTimeFilter] = useState('all');
  
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await blogService.getPublishedPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));
  
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === '' || post.tags.includes(selectedTag);
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'featured' && post.featured) ||
                         (filterBy === 'published' && post.published) ||
                         (filterBy === 'drafts' && !post.published);
    const matchesReadTime = readTimeFilter === 'all' ||
                           (readTimeFilter === 'short' && post.readTime <= 5) ||
                           (readTimeFilter === 'medium' && post.readTime > 5 && post.readTime <= 10) ||
                           (readTimeFilter === 'long' && post.readTime > 10);
    
    return matchesSearch && matchesTag && matchesFilter && matchesReadTime;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case 'oldest':
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'readTime':
        return a.readTime - b.readTime;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Blog Posts
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Exploring modern web development, sharing insights, and documenting my journey as a developer.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Category Filter */}
              <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm"
              >
                <option value="">All Tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
              
              {/* Sort Filter */}
              <div className="relative">
                <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                  <option value="readTime">Read Time</option>
                </select>
              </div>
              
              {/* Status Filter */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm"
                >
                  <option value="all">All Posts</option>
                  <option value="featured">Featured</option>
                  <option value="published">Published</option>
                </select>
              </div>
              
              {/* Read Time Filter */}
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={readTimeFilter}
                  onChange={(e) => setReadTimeFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm"
                >
                  <option value="all">Any Length</option>
                  <option value="short">Quick Read (≤5 min)</option>
                  <option value="medium">Medium (5-10 min)</option>
                   <option value="long">Long Read (&gt;10 min)</option>
                </select>
              </div>
              
              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag('');
                  setSortBy('newest');
                  setFilterBy('all');
                  setReadTimeFilter('all');
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredPosts.length} of {posts.length} posts
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Posts Grid */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  {posts.length === 0 ? 'No posts available yet.' : 'No posts found matching your criteria.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;