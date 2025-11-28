import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { post, apiKey, siteUrl } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
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
      const errorText = await response.text();
      console.error('Dev.to API error:', errorText);
      return res.status(response.status).json({ 
        error: 'Failed to publish to Dev.to', 
        details: errorText 
      });
    }

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Dev.to publish error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
