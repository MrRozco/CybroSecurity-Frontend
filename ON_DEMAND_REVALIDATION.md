# On-Demand Revalidation Guide

## Problem
You have ISR set to revalidate every hour (`revalidate: 3600`), but you want changes to appear immediately when you update content in Strapi.

## Solution: On-Demand Revalidation

I've created an API endpoint that lets you trigger cache revalidation manually or automatically via webhooks.

## Setup

### 1. Add Environment Variable (Optional but Recommended)

In your Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name:** `REVALIDATE_SECRET`
   - **Value:** A random secret string (e.g., `your-super-secret-key-123`)

This prevents unauthorized people from clearing your cache.

### 2. Deploy the Revalidation Endpoint

The endpoint is already created at: `src/app/api/revalidate/route.js`

Just commit and push:
```bash
git add .
git commit -m "feat: add on-demand revalidation endpoint"
git push
```

After deployment, your endpoint will be available at:
```
https://your-domain.com/api/revalidate
```

## Usage

### Manual Revalidation (For Testing)

Use any HTTP client (Postman, curl, etc.):

#### Revalidate Homepage
```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-super-secret-key-123" \
  -d '{"type": "homepage"}'
```

#### Revalidate All Blogs
```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-super-secret-key-123" \
  -d '{"type": "blog"}'
```

#### Revalidate Specific Page
```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-super-secret-key-123" \
  -d '{"path": "/blogs/my-blog-slug"}'
```

#### Revalidate Crew Page
```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-super-secret-key-123" \
  -d '{"type": "crew"}'
```

### Automatic Revalidation (Strapi Webhooks)

Set up webhooks in Strapi to automatically revalidate when content changes:

#### In Strapi Admin Panel:

1. Go to **Settings** → **Webhooks**
2. Click **Add new webhook**
3. Configure:

**For Blog Posts:**
- **Name:** Revalidate Blogs
- **Url:** `https://your-domain.com/api/revalidate`
- **Headers:**
  ```json
  {
    "Content-Type": "application/json",
    "Authorization": "Bearer your-super-secret-key-123"
  }
  ```
- **Events:** Select:
  - `entry.create`
  - `entry.update`
  - `entry.delete`
  - `entry.publish`
  - `entry.unpublish`
- **Body:**
  ```json
  {
    "type": "blog"
  }
  ```

**For Homepage:**
- **Name:** Revalidate Homepage
- **Url:** `https://your-domain.com/api/revalidate`
- **Headers:** (same as above)
- **Events:** (same as above)
- **Body:**
  ```json
  {
    "type": "homepage"
  }
  ```

**For Categories:**
- **Name:** Revalidate Categories
- **Url:** `https://your-domain.com/api/revalidate`
- **Headers:** (same as above)
- **Events:** (same as above)
- **Body:**
  ```json
  {
    "type": "category"
  }
  ```

**For Crew:**
- **Name:** Revalidate Crew
- **Url:** `https://your-domain.com/api/revalidate`
- **Headers:** (same as above)
- **Events:** (same as above)
- **Body:**
  ```json
  {
    "type": "crew"
  }
  ```

## API Parameters

### Option 1: Revalidate by Type
```json
{
  "type": "blog" | "category" | "homepage" | "crew"
}
```

### Option 2: Revalidate by Path
```json
{
  "path": "/blogs/my-slug" | "/category/security" | "/crew" | "/"
}
```

### Option 3: Revalidate by Tag
```json
{
  "tag": "blogs" | "categories"
}
```

## Quick Methods to Push Changes Now

### Method 1: Vercel Dashboard (Easiest)
1. Go to Vercel Dashboard
2. **Settings** → **Data Cache** → **Purge Everything**

### Method 2: Redeploy
1. Vercel Dashboard → **Deployments**
2. Click **⋯** on latest deployment
3. Select **"Redeploy"**

### Method 3: Manual API Call
Use the curl commands above

### Method 4: Set Up Webhooks
Configure Strapi webhooks (see above) for automatic revalidation

## Testing

After setting up:

1. **Update a blog post in Strapi**
2. **Wait a few seconds** (webhook triggers)
3. **Refresh your site** - changes should appear immediately!

## Troubleshooting

### Webhook not working?
- Check Strapi webhook logs in Settings → Webhooks
- Verify the URL is correct
- Check authorization header matches your secret

### Getting 401 errors?
- Verify `REVALIDATE_SECRET` environment variable in Vercel
- Check authorization header in webhook

### Changes not appearing?
- Check Vercel function logs
- Ensure the path/type is correct
- Try purging cache manually in Vercel

## Best Practice

Keep `revalidate: 3600` in your pages (hourly backup revalidation) AND use webhooks for immediate updates. This gives you:

✅ **Fast performance** (cached pages)
✅ **Immediate updates** (when you publish in Strapi)
✅ **Fallback revalidation** (if webhook fails, still updates within 1 hour)

## Security Notes

- Always use the `Authorization` header with a secret
- Don't commit the secret to Git
- Use environment variables in Vercel
- Rotate the secret periodically

## Example Response

Success:
```json
{
  "revalidated": true,
  "type": "blog",
  "message": "Revalidated: blog",
  "now": 1700123456789
}
```

Error:
```json
{
  "message": "Invalid token"
}
```
