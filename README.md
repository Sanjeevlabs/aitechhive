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