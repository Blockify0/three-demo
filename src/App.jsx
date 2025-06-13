import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { motion } from 'framer-motion'
import ASLCharacter from './components/ASLCharacter'
import './App.css'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [animationType, setAnimationType] = useState('hello')

  const handlePlayAnimation = (type) => {
    setAnimationType(type)
    setIsPlaying(true)
    // Reset after animation duration
    setTimeout(() => setIsPlaying(false), 6000)
  }

  return (
    <div className="app">
      {/* Header */}
      <motion.div 
        className="header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1>ASL Demo</h1>
        <p>Beautiful American Sign Language Animations</p>
      </motion.div>

      {/* Main Canvas */}
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          shadows
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-5, 2, 5]} intensity={0.5} color="#ff6b6b" />
          <pointLight position={[5, 2, -5]} intensity={0.5} color="#4ecdc4" />
          
          <ASLCharacter 
            isPlaying={isPlaying} 
            animationType={animationType}
            onAnimationComplete={() => setIsPlaying(false)}
          />
          
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.3} 
            scale={10} 
            blur={2} 
          />
          
          <Environment preset="city" background={false} />
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            enableRotate={true}
            minDistance={4}
            maxDistance={12}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
      </div>

      {/* Controls */}
      <motion.div 
        className="controls"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        <motion.button
          className={`play-button ${isPlaying && animationType === 'hello' ? 'playing' : ''}`}
          onClick={() => handlePlayAnimation('hello')}
          disabled={isPlaying}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="icon">👋</span>
          Play "Hello" in ASL
        </motion.button>
        
        <motion.button
          className={`play-button ${isPlaying && animationType === 'thank-you' ? 'playing' : ''}`}
          onClick={() => handlePlayAnimation('thank-you')}
          disabled={isPlaying}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="icon">🙏</span>
          Play "Thank You" in ASL
        </motion.button>
      </motion.div>

      {/* Info */}
      <motion.div 
        className="info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <p>Click and drag to rotate • Scroll to zoom</p>
        {isPlaying && (
          <motion.div 
            className="playing-indicator"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            ✨ Playing Animation...
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default App 