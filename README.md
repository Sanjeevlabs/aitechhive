# AI Tech Hive - Landing Page

A high-converting landing page for aitechhive.com built with Next.js and Framer Motion.

## Features

- **Hero Section** - Single focused tagline: "Decode AI, One Topic at a Time"
- **Problem/Solution Flow** - Addresses AI learning pain points and presents the solution
- **3-Step Process** - Clear path from newsletter signup to knowledge building
- **Benefits Showcase** - Tangible learning outcomes with icons and descriptions
- **Daily Newsletter** - Daily AI insights delivered to subscribers
- **Responsive Design** - Built with Tailwind CSS for all screen sizes
- **Smooth Animations** - Framer Motion for subtle, professional animations
- **Newsletter Integration** - Direct links to Beehiiv newsletter signup

## Tech Stack

- **Next.js 13** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **ESLint** for code quality
- **Vercel Analytics** for tracking and insights

## Design Philosophy

The landing page design is inspired by Google One's clean, modern aesthetic:

### Font Choice
- **Primary Font**: Inter
  - Clean, highly readable sans-serif font
  - Excellent for digital interfaces with superior legibility
  - Supports wide range of weights (400-900) for flexible typography hierarchy
  - Matches Google One's professional, modern look

### Color Palette
The color scheme follows Google One's distinctive blue-based gradients:

- **Primary Blue**: `#1a73e8` - Google's signature blue
- **Light Blue**: `#4285f4` - Complementary accent
- **Purple Accent**: `#9334e6` - For visual interest
- **Red Accent**: `#ea4335` - Google's brand red

### Visual Styling
- **Clean Gradients**: Subtle, professional gradients using `#E8F0FE` to white
- **Modern Typography**: Large, bold headlines with excellent contrast
- **Minimalist Overlays**: Light gradient overlays (opacity 10-30%) for depth
- **Smooth Animations**: Subtle motion with Framer Motion for engaging UX
- **Google-style Shadows**: Soft, blue-tinted shadows for depth perception

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

## Deployment

This project is optimized for deployment on Vercel and can be deployed as the root landing page ("/") route.

## Newsletter Integration

The landing page includes calls-to-action that link to `newsletter.aitechhive.com` for Beehiiv newsletter signup.

## Social Media Configuration

The footer includes social media buttons for the following platforms:
- **LinkedIn**: Connect with us professionally
- **X (Twitter)**: Follow for updates and insights
- **Instagram**: Visual content and behind-the-scenes
- **Discord**: Join our community discussions
- **WhatsApp**: Direct communication channel

### Updating Social Media Links

To update social media links, modify the `socialLinks` array in `src/components/sections/Footer.tsx`:

```typescript
const socialLinks = [
  { name: 'LinkedIn', url: 'YOUR_LINKEDIN_URL', icon: {...} },
  { name: 'X', url: 'YOUR_X_URL', icon: {...} },
  { name: 'Instagram', url: 'YOUR_INSTAGRAM_URL', icon: {...} },
  { name: 'Discord', url: 'YOUR_DISCORD_URL', icon: {...} },
  { name: 'WhatsApp', url: 'YOUR_WHATSAPP_URL', icon: {...} }
]
```

The social media buttons feature:
- Smooth hover animations
- Responsive design
- Accessible with proper ARIA labels
- Modern SVG icons that adapt to the page style