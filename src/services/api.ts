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

    const response = await fetch('https://dev.to/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        article: {
          title: post.title,
          body_markdown: post.content,
          tags: post.tags,
          published: true,
          main_image: post.coverImage,
          canonical_url: siteUrl ? `${siteUrl}/blog/${post.slug}` : undefined
        }
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to publish to Dev.to');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Dev.to publish error:', error);
    throw error;
  }
};