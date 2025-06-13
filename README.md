# 🤟 ASL Hello Demo

A beautiful, interactive American Sign Language demo built with React Three Fiber and Three.js. Features realistic hand animations for "Hello" and "Thank You" gestures.

## ✨ Features

- **Realistic Hand Movements**: Detailed finger animations and natural gestures
- **Beautiful UI**: Modern gradient design with smooth animations
- **Interactive Controls**: Click to play different ASL gestures
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Keyframe-based animation system with easing
- **3D Environment**: Proper lighting, shadows, and environment mapping

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Your Browser**
   Navigate to `http://localhost:5173`

## 🎯 Gestures Available

- **Hello**: Classic waving gesture with natural hand movement
- **Thank You**: Traditional ASL "thank you" gesture with head nod

## 🛠️ Built With

- **React 18** - UI Framework
- **React Three Fiber** - React renderer for Three.js
- **Three.js** - 3D graphics library
- **@react-three/drei** - Useful helpers for R3F
- **Framer Motion** - Smooth UI animations
- **Vite** - Fast build tool

## 📱 Deployment

### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the `dist` folder to Netlify or use their CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

### Deploy to GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json scripts:
   ```json
   {
     "homepage": "https://yourusername.github.io/asl-hello-demo",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## 🎨 Customization

### Adding New Gestures

1. Add animation keyframes in `src/components/ASLCharacter.jsx`:
   ```javascript
   const animations = {
     'your-gesture': {
       duration: 4,
       keyframes: [
         { time: 0, rightArm: [0, 0, 0], rightHand: [0, 0, 0], ... },
         // ... more keyframes
       ]
     }
   }
   ```

2. Add button in `src/App.jsx`:
   ```javascript
   <button onClick={() => handlePlayAnimation('your-gesture')}>
     Your Gesture
   </button>
   ```

### Styling Changes

- Main styles: `src/App.css`
- Colors and gradients can be easily modified
- Animation timings adjustable in CSS keyframes

## 🔧 Technical Details

- **Animation System**: Keyframe interpolation with cubic easing
- **Rendering**: WebGL with hardware acceleration
- **Performance**: Optimized for 60fps on modern devices
- **Shadows**: Real-time shadow mapping
- **Lighting**: Multi-point lighting setup for realistic appearance

## 📝 License

MIT License - feel free to use for educational or commercial projects!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Enjoy creating beautiful ASL animations! 🌟** 