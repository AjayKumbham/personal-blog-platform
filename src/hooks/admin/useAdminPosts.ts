// React
import { useState, useCallback } from 'react';

// Services
import { blogService } from '../../services/blogService';

// Hooks
import { useToast } from '../useToast';

// Types
import { BlogPost } from '../../types';

interface UseAdminPostsReturn {
  posts: BlogPost[];
  loadingPosts: boolean;
  loadPosts: () => Promise<void>;
  handleDeletePost: (id: string) => Promise<void>;
  togglePublished: (id: string) => Promise<void>;
}

export const useAdminPosts = (): UseAdminPostsReturn => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const { showSuccess, showError } = useToast();

  const loadPosts = useCallback(async () => {
    try {
      const data = await blogService.getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await blogService.deletePost(id);
        setPosts(posts.filter(post => post.id !== id));
        showSuccess('Post deleted', 'The post has been successfully deleted.');
      } catch (error) {
        console.error('Error deleting post:', error);
        showError('Failed to delete post', 'Please try again later.');
      }
    }
  };

  const togglePublished = async (id: string) => {
    try {
      const post = posts.find(p => p.id === id);
      if (post) {
        await blogService.updatePost(id, { published: !post.published });
        setPosts(posts.map(p =>
          p.id === id ? { ...p, published: !p.published } : p
        ));
        showSuccess(
          `Post ${post.published ? 'unpublished' : 'published'}`,
          `"${post.title}" has been ${post.published ? 'unpublished' : 'published'}.`
        );
      }
    } catch (error) {
      console.error('Error updating post:', error);
      showError('Failed to update post', 'Please try again later.');
    }
  };

  return {
    posts,
    loadingPosts,
    loadPosts,
    handleDeletePost,
    togglePublished,
  };
};