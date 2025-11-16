import qs from 'qs';

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://miraculous-agreement-441a168338.strapiapp.com';

// Generic fetcher for any endpoint with Next.js caching
export async function fetchFromStrapi(endpoint, query = {}, options = {}) {
  const queryString = qs.stringify(query, { encodeValuesOnly: true });
  const url = `${strapiUrl}/api/${endpoint}${queryString ? `?${queryString}` : ''}`;
  
  try {
    const response = await fetch(url, {
      next: { 
        revalidate: options.revalidate ?? 3600, // Cache for 1 hour by default
        tags: options.tags ?? [endpoint] // Allow cache invalidation by endpoint
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching from Strapi: ${endpoint}`, error.message);
    throw new Error(`Failed to fetch from Strapi: ${endpoint}`);
  }
}

// Get all blogs
export async function getBlogs() {
  return fetchFromStrapi('blogs', { populate: '*' });
}

// Get a blog by slug
export async function getBlogBySlug(slug) {
  const blogs = await fetchFromStrapi('blogs', {
    filters: { Slug: { $eq: slug } },
    populate: '*',
  });
  if (!blogs || blogs.length === 0) {
    throw new Error('Blog not found');
  }
  return blogs[0];
}

// Get all categories
export async function getCategories() {
  return fetchFromStrapi('categories', { populate: '*' });
}

export async function getBlogsByCategory(categorySlug) {
  const blogs = await fetchFromStrapi('blogs', {
    filters: { category: { Slug: { $eq: categorySlug } } },
    populate: '*',
  });
  return blogs || [];
}

// Get a single type or page (example: homepage, about, etc.)
export async function getSingleType(type) {
  return fetchFromStrapi(type, {
    populate: {
      content: {
        on: {
          'structure.navbar': {
            populate: '*'
          }
          ,
          'structure.main-header': {
            populate: {
              blogs: {
                populate: '*'
              },
            },
          },
          'structure.category-feed': {
            populate: '*'
          },
          'structure.footer': {
            populate: {
              socialMedias: {
                populate: '*'
              },
              links: {
                populate: '*'
              },
              logo: {
                populate: '*' 
              },
            }
          },
          'structure.crew-header': {
            populate: '*'
          },
          'structure.crew-members': {
            populate: {
              employee: {
                populate: '*'
              }
            }
          }
          
          // Add more component populates as needed
        },
      },
    },
  });
}

// Get a page by slug (for collection type "pages")
export async function getPageBySlug(slug) {
  const pages = await fetchFromStrapi('pages', {
    filters: { Slug: { $eq: slug } },
    populate: '*',
  });
  if (!pages || pages.length === 0) {
    throw new Error('Page not found');
  }
  return pages[0];
}