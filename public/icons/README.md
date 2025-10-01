# AI Tech Hive Icons and Favicons

This directory contains all the icon and favicon files for the AI Tech Hive website.

## Files

### SVG Files
- **logo.color.svg** - Full-color optimized logo with gradient (120x120)
- **logo.mono.svg** - Monochrome simplified logo suitable for small sizes (120x120)
- **mask-icon.svg** - Safari mask icon for pinned tabs

### PNG Icons
- **favicon-16.png** - 16x16 favicon
- **favicon-32.png** - 32x32 favicon
- **favicon-48.png** - 48x48 favicon
- **apple-touch-icon.png** - 180x180 Apple touch icon for iOS devices
- **icon-192.png** - 192x192 icon for web manifest
- **icon-512.png** - 512x512 icon for web manifest

### ICO File
- **favicon.ico** - Multi-size favicon containing 16x16, 32x32, and 48x48 sizes

## Usage

All icon files are referenced in the site's HTML head and manifest:

```html
<link rel="alternate icon" href="/favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png">
<link rel="icon" sizes="32x32" href="/icons/favicon-32.png">
<link rel="icon" sizes="16x16" href="/icons/favicon-16.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#7adbe6">
<link rel="mask-icon" href="/icons/mask-icon.svg" color="#7adbe6">
```

## Clearing Browser Cache

If you don't see the new favicons after deployment:

1. **Hard Refresh**
   - Chrome/Firefox (Windows/Linux): `Ctrl + Shift + R` or `Ctrl + F5`
   - Chrome/Firefox (Mac): `Cmd + Shift + R`
   - Safari: `Cmd + Option + R`

2. **Clear Browser Cache**
   - Chrome: Settings → Privacy and security → Clear browsing data → Cached images and files
   - Firefox: Options → Privacy & Security → Cookies and Site Data → Clear Data
   - Safari: Safari menu → Clear History → All History

3. **Force Favicon Reload**
   - Visit: `https://aitechhive.com/favicon.ico` directly in your browser
   - Refresh the page with `Ctrl/Cmd + Shift + R`

## Regenerating Icons

If you need to regenerate the icons from the SVG sources:

```bash
# Install ImageMagick and SVGO
sudo apt-get install imagemagick
npm install -g svgo

# Optimize SVGs
cd public/icons
svgo logo.color.svg
svgo logo.mono.svg
svgo mask-icon.svg

# Generate PNGs
convert -background none logo.color.svg -resize 16x16 favicon-16.png
convert -background none logo.color.svg -resize 32x32 favicon-32.png
convert -background none logo.color.svg -resize 48x48 favicon-48.png
convert -background none logo.color.svg -resize 180x180 apple-touch-icon.png
convert -background none logo.color.svg -resize 192x192 icon-192.png
convert -background none logo.color.svg -resize 512x512 icon-512.png

# Create favicon.ico
convert favicon-16.png favicon-32.png favicon-48.png -colors 256 favicon.ico

# Copy to public root
cp favicon.ico ../favicon.ico
```

## Color Scheme

The primary theme color used across the icons is **#7adbe6** (bright cyan/turquoise), which matches the AI Tech Hive brand gradient.

## Notes

- All PNG files are optimized for web use
- SVG files have been minified using SVGO
- The favicon.ico contains multiple sizes for better compatibility across browsers
- Apple touch icon is 180x180 as recommended by Apple's guidelines
- Web manifest icons follow PWA best practices with 192x192 and 512x512 sizes
