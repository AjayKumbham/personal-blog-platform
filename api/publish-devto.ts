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

    // Dev.to tag requirements: max 4 tags, lowercase, no special chars except hyphen
    const formattedTags = post.tags
      .slice(0, 4) // Max 4 tags
      .map(tag => tag.toLowerCase().replace(/[^a-z0-9]+/g, '').substring(0, 30)); // Max 30 chars per tag

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
          tags: formattedTags,
          published: true,
          main_image: post.coverImage || undefined,
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
