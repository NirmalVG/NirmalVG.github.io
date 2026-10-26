const sharp = require('sharp');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0118"/>
      <stop offset="30%" style="stop-color:#1a0533"/>
      <stop offset="60%" style="stop-color:#12002a"/>
      <stop offset="100%" style="stop-color:#0a0118"/>
    </linearGradient>
    <radialGradient id="glow1" cx="75%" cy="50%" r="50%" fx="75%" fy="50%">
      <stop offset="0%" style="stop-color:rgba(120,50,200,0.4)"/>
      <stop offset="100%" style="stop-color:rgba(120,50,200,0)"/>
    </radialGradient>
    <radialGradient id="glow2" cx="90%" cy="20%" r="35%" fx="90%" fy="20%">
      <stop offset="0%" style="stop-color:rgba(6,182,212,0.2)"/>
      <stop offset="100%" style="stop-color:rgba(6,182,212,0)"/>
    </radialGradient>
    <radialGradient id="glow3" cx="70%" cy="85%" r="40%" fx="70%" fy="85%">
      <stop offset="0%" style="stop-color:rgba(236,72,153,0.15)"/>
      <stop offset="100%" style="stop-color:rgba(236,72,153,0)"/>
    </radialGradient>
    <linearGradient id="nameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff"/>
      <stop offset="50%" style="stop-color:#e8ddf5"/>
      <stop offset="100%" style="stop-color:#d4c4e8"/>
    </linearGradient>
    <filter id="blur1"><feGaussianBlur stdDeviation="40"/></filter>
    <filter id="blur2"><feGaussianBlur stdDeviation="30"/></filter>
    <linearGradient id="topBorder" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:transparent"/>
      <stop offset="20%" style="stop-color:#a855f7"/>
      <stop offset="50%" style="stop-color:#06b6d4"/>
      <stop offset="80%" style="stop-color:#ec4899"/>
      <stop offset="100%" style="stop-color:transparent"/>
    </linearGradient>
    <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="12" cy="12" r="1" fill="rgba(168,85,247,0.12)"/>
    </pattern>
    <mask id="dotMask">
      <radialGradient id="dotMaskGrad" cx="80%" cy="65%" r="45%">
        <stop offset="0%" style="stop-color:white"/>
        <stop offset="100%" style="stop-color:black"/>
      </radialGradient>
      <rect width="100%" height="100%" fill="url(#dotMaskGrad)"/>
    </mask>
  </defs>
  
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow1)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow2)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow3)"/>
  
  <ellipse cx="900" cy="200" rx="280" ry="220" fill="rgba(168,85,247,0.18)" filter="url(#blur1)"/>
  <ellipse cx="1000" cy="480" rx="220" ry="180" fill="rgba(139,92,246,0.14)" filter="url(#blur1)"/>
  <ellipse cx="750" cy="350" rx="120" ry="120" fill="rgba(6,214,212,0.12)" filter="url(#blur2)"/>
  <ellipse cx="1100" cy="100" rx="150" ry="100" fill="rgba(236,72,153,0.1)" filter="url(#blur2)"/>
  
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#dots)" mask="url(#dotMask)"/>
  <rect x="0" y="0" width="${WIDTH}" height="3" fill="url(#topBorder)"/>
  
  <rect x="80" y="175" width="130" height="32" rx="16" ry="16" fill="rgba(168,85,247,0.12)" stroke="rgba(168,85,247,0.25)" stroke-width="1"/>
  <circle cx="100" cy="191" r="4" fill="#10b981"/>
  <text x="113" y="196" fill="rgba(255,255,255,0.6)" font-family="Segoe UI, Arial, sans-serif" font-size="12" font-weight="500" letter-spacing="2">PORTFOLIO</text>
  
  <text x="80" y="300" fill="url(#nameGrad)" font-family="Segoe UI, Arial, sans-serif" font-size="82" font-weight="800" letter-spacing="-1">Nirmal V G</text>
  
  <text x="82" y="358" fill="rgba(255,255,255,0.92)" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="600">React.js / Next.js Developer</text>
  
  <text x="82" y="405" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="400">
    <tspan fill="#22d3ee">TypeScript</tspan>
    <tspan fill="rgba(255,255,255,0.25)" dx="6">&#183;</tspan>
    <tspan fill="#c084fc" dx="6">Tailwind CSS</tspan>
    <tspan fill="rgba(255,255,255,0.25)" dx="6">&#183;</tspan>
    <tspan fill="#f472b6" dx="6">TanStack Query</tspan>
  </text>
  
  <text x="1010" y="598" fill="rgba(255,255,255,0.3)" font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="500">nirmalvg.github.io</text>
</svg>`;

async function generate() {
  try {
    const outputPath = path.join(__dirname, 'public', 'og-image.jpg');
    
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 92 })
      .toFile(outputPath);
    
    console.log('OG image generated successfully at:', outputPath);
    
    const meta = await sharp(outputPath).metadata();
    console.log(`Dimensions: ${meta.width}x${meta.height}, format: ${meta.format}`);
  } catch (err) {
    console.error('Error generating image:', err);
    process.exit(1);
  }
}

generate();
