import axios from 'axios';
import qs from 'qs';

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://miraculous-agreement-441a168338.strapiapp.com';

// Generic fetcher for any endpoint
export async function fetchFromStrapi(endpoint, query = {}) {
  const queryString = qs.stringify(query, { encodeValuesOnly: true });
  const url = `${strapiUrl}/api/${endpoint}${queryString ? `?${queryString}` : ''}`;
  try {
    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching from Strapi: ${endpoint}`, error.response?.status, error.message);
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