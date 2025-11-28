import { BlogPost } from '../types';

export const publishToHashnode = async (post: BlogPost, apiKey: string, publicationId: string) => {
  try {
    if (!apiKey || !publicationId) {
      throw new Error('Hashnode API key and publication ID are required');
    }

    const response = await fetch('https://gql.hashnode.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey,
      },
      body: JSON.stringify({
        query: `
          mutation PublishPost($input: PublishPostInput!) {
            publishPost(input: $input) {
              post {
                id
                slug
                url
              }
            }
          }
        `,
        variables: {
          input: {
            title: post.title,
            contentMarkdown: post.content,
            tags: post.tags.map(tag => ({ 
              slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''), 
              name: tag 
            })),
            publicationId: publicationId,
            slug: post.slug,
            ...(post.coverImage && { coverImageOptions: { coverImageURL: post.coverImage } })
          }
        }
      })
    });
    
    const result = await response.json();
    
    if (!response.ok || result.errors) {
      console.error('Hashnode API error:', result.errors || result);
      throw new Error(result.errors?.[0]?.message || 'Failed to publish to Hashnode');
    }
    
    return result;
  } catch (error) {
    console.error('Hashnode publish error:', error);
    throw error;
  }
};

export const publishToDevTo = async (post: BlogPost, apiKey: string, siteUrl?: string) => {
  try {
    if (!apiKey) {
      throw new Error('Dev.to API key is required');
    }

    // In production, use serverless function to avoid CORS
    // In development, you'll need to run: vercel dev
    const isDev = import.meta.env.DEV;
    
    if (isDev) {
      console.warn('⚠️ Dev.to publishing in development requires running "vercel dev" instead of "npm run dev"');
      console.warn('⚠️ Skipping Dev.to publish in local development. Deploy to test.');
      return { skipped: true, message: 'Dev.to publish skipped in local development' };
    }

    const response = await fetch('/api/publish-devto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post,
        apiKey,
        siteUrl
      })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Dev.to API error:', result);
      throw new Error(result.error || 'Failed to publish to Dev.to');
    }
    
    return result;
  } catch (error) {
    console.error('Dev.to publish error:', error);
    throw error;
  }
};