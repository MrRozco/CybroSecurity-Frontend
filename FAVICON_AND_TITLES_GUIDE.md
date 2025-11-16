# Favicon & Page Titles Guide

## How to Change the Favicon (Tab Icon)

### Option 1: Simple favicon.ico (Recommended for beginners)
1. Create or download a `.ico` file (16x16 or 32x32 pixels)
2. Replace `src/app/favicon.ico` with your new icon
3. Done! Next.js will automatically use it

### Option 2: Modern icon formats (Better quality)
Add any of these files to `src/app/`:

- **`icon.png`** - Modern browsers (recommended: 32x32 or 512x512)
- **`icon.svg`** - Vector icon (scalable, best quality)
- **`apple-icon.png`** - iOS devices (recommended: 180x180)

Example structure:
```
src/app/
  ├── favicon.ico       ← Fallback for old browsers
  ├── icon.png          ← Modern browsers
  ├── apple-icon.png    ← iOS Safari
  └── layout.js
```

### Option 3: Multiple sizes (Advanced)
Create `src/app/icon.js` for programmatic icons:
```javascript
import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ fontSize: 24, background: 'black', width: '100%', height: '100%' }}>
        🔒
      </div>
    ),
    { ...size }
  )
}
```

## How Page Titles Work

### Title Template (Root Layout)
In `src/app/layout.js`:
```javascript
export const metadata = {
  title: {
    default: "CybroSecurity - Cybersecurity Solutions",
    template: "%s | CybroSecurity", // %s is replaced with page title
  },
  description: "Your site description",
};
```

**Result:**
- Homepage: "Home | CybroSecurity"
- Blog post: "How to Secure Your Network | CybroSecurity"
- Crew page: "Our Crew | CybroSecurity"

### Static Page Titles
For simple pages (like homepage or crew):
```javascript
// src/app/crew/page.js
export const metadata = {
  title: "Our Crew",
  description: "Meet our team",
};
```

### Dynamic Page Titles
For pages with dynamic content (like blog posts):
```javascript
// src/app/blogs/[slug]/page.js
export async function generateMetadata({ params }) {
  const blog = await getBlogBySlug(params.slug);
  
  return {
    title: blog.Title,
    description: blog.Content?.substring(0, 160),
  };
}
```

## What I've Already Set Up

✅ **Root Layout** - Template: "%s | CybroSecurity"
✅ **Homepage** - Title: "Home"
✅ **Crew Page** - Title: "Our Crew"
✅ **Blog Posts** - Dynamic titles from Strapi (uses blog title)
✅ **Category Pages** - Dynamic titles from Strapi (uses category name)

## Examples of How Titles Will Appear

| Page | Browser Tab Title |
|------|------------------|
| Homepage | "Home \| CybroSecurity" |
| Crew | "Our Crew \| CybroSecurity" |
| Blog: "Top 10 Security Tips" | "Top 10 Security Tips \| CybroSecurity" |
| Category: "Network Security" | "Network Security \| CybroSecurity" |

## Customization Tips

### Change the Brand Name
Edit `src/app/layout.js`:
```javascript
export const metadata = {
  title: {
    default: "Your Company Name",
    template: "%s | Your Company Name",
  },
};
```

### Remove Template (Show Only Page Title)
```javascript
export const metadata = {
  title: "Your Company Name", // No template
};
```

### Add More Metadata
```javascript
export const metadata = {
  title: "CybroSecurity",
  description: "Your description",
  keywords: ["cybersecurity", "security"],
  authors: [{ name: "CybroSecurity Team" }],
  openGraph: {
    title: "CybroSecurity",
    description: "Your description",
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: "summary_large_image",
    title: "CybroSecurity",
    description: "Your description",
  },
};
```

## Testing

After making changes:

1. **Local testing:**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000 and check the browser tab

2. **Production testing:**
   ```bash
   npm run build
   npm start
   ```

3. **Clear browser cache** if changes don't appear (Ctrl+Shift+R)

## Tools to Create Favicons

- [Favicon.io](https://favicon.io/) - Generate from text, image, or emoji
- [RealFaviconGenerator](https://realfavicongenerator.net/) - All sizes/formats
- Canva - Design custom icons
- Figma/Photoshop - Professional design

## Recommended Favicon Sizes

| File | Size | Purpose |
|------|------|---------|
| favicon.ico | 32x32 | Browser tabs (legacy) |
| icon.png | 512x512 | Modern browsers, PWA |
| apple-icon.png | 180x180 | iOS home screen |

## Next Steps

1. ✅ Titles are configured and dynamic
2. 🔲 Replace `src/app/favicon.ico` with your custom icon
3. 🔲 (Optional) Add `icon.png` and `apple-icon.png` for better quality
4. 🔲 Deploy and test

## Questions?

- Favicon not updating? Clear browser cache (Ctrl+Shift+R)
- Want different titles per language? Use Next.js i18n
- Need Open Graph images? Add `opengraph-image.png` to `src/app/`
