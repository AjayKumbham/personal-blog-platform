import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { BlogPost } from '../../types';
import Card from '../ui/Card';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  const imageHeightClass = featured ? 'h-64 md:h-72' : 'h-56 md:h-60';
  return (
    <Card className={`h-full flex flex-col ${featured ? 'col-span-full md:col-span-2' : ''}`}>
      <Link to={`/blog/${post.slug}`} className="block">
        <div className={`relative overflow-hidden rounded-t-xl ${imageHeightClass}`}>
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-100" />
          )}
          {post.featured && (
            <div className="absolute top-4 left-4">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
            </div>
          )}
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
          
          <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 ${featured ? 'text-2xl' : 'text-xl'}`}>
            {post.title}
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(post.publishedAt, 'MMM d, yyyy')}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime} min read
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default BlogCard;