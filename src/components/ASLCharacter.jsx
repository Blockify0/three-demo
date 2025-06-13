import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Text } from '@react-three/drei'
import * as THREE from 'three'

// Create a simple humanoid character with detailed hands
function ASLCharacter({ isPlaying, animationType, onAnimationComplete }) {
  const characterRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()
  const leftHandRef = useRef()
  const rightHandRef = useRef()
  const headRef = useRef()
  
  // Finger refs for detailed hand animation
  const leftFingersRef = useRef([])
  const rightFingersRef = useRef([])
  
  const [animationTime, setAnimationTime] = useState(0)
  const [currentAnimation, setCurrentAnimation] = useState(null)

  // Animation definitions
  const animations = {
    hello: {
      duration: 5,
      keyframes: [
        { time: 0, rightArm: [0, 0, 0], rightHand: [0, 0, 0], leftArm: [0, 0, 0], head: [0, 0, 0] },
        { time: 0.5, rightArm: [0, 0.3, -0.8], rightHand: [0, 0, 0], leftArm: [0, 0, 0], head: [0, 0.1, 0] },
        { time: 1, rightArm: [0, 0.5, -1.2], rightHand: [0, 0, 0.3], leftArm: [0, 0, 0], head: [0, 0.2, 0] },
        { time: 2.5, rightArm: [0, 0.5, -1.2], rightHand: [0, 0, -0.3], leftArm: [0, 0, 0], head: [0, 0.2, 0] },
        { time: 3.5, rightArm: [0, 0.5, -1.2], rightHand: [0, 0, 0.3], leftArm: [0, 0, 0], head: [0, 0.2, 0] },
        { time: 4.5, rightArm: [0, 0.3, -0.8], rightHand: [0, 0, 0], leftArm: [0, 0, 0], head: [0, 0.1, 0] },
        { time: 5, rightArm: [0, 0, 0], rightHand: [0, 0, 0], leftArm: [0, 0, 0], head: [0, 0, 0] }
      ]
    },
    'thank-you': {
      duration: 6,
      keyframes: [
        { time: 0, rightArm: [0, 0, 0], rightHand: [0, 0, 0], leftArm: [0, 0, 0], head: [0, 0, 0] },
        { time: 1, rightArm: [0, 0.8, -0.5], rightHand: [0.5, 0, 0], leftArm: [0, 0, 0], head: [0, 0.3, 0] },
        { time: 2, rightArm: [0, 1.2, -0.3], rightHand: [1, 0, 0], leftArm: [0, 0, 0], head: [0, 0.5, 0] },
        { time: 3.5, rightArm: [0, 0.8, -0.8], rightHand: [0.2, 0, 0], leftArm: [0, 0, 0], head: [0, 0.3, 0] },
        { time: 5, rightArm: [0, 0.3, -0.5], rightHand: [0, 0, 0], leftArm: [0, 0, 0], head: [0, 0.1, 0] },
        { time: 6, rightArm: [0, 0, 0], rightHand: [0, 0, 0], leftArm: [0, 0, 0], head: [0, 0, 0] }
      ]
    }
  }

  // Start animation
  useEffect(() => {
    if (isPlaying) {
      setAnimationTime(0)
      setCurrentAnimation(animations[animationType])
    }
  }, [isPlaying, animationType])

  // Animation loop
  useFrame((state, delta) => {
    if (isPlaying && currentAnimation) {
      setAnimationTime(prev => {
        const newTime = prev + delta
        if (newTime >= currentAnimation.duration) {
          onAnimationComplete?.()
          return 0
        }
        return newTime
      })
    }

    // Apply smooth head bob
    if (headRef.current) {
      headRef.current.rotation.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.001
      headRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.02
    }

    // Apply breathing animation to torso
    if (characterRef.current) {
      characterRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.01
    }
  })

  // Interpolate between keyframes
  const interpolateKeyframes = (keyframes, currentTime) => {
    if (currentTime <= 0) return keyframes[0]
    if (currentTime >= keyframes[keyframes.length - 1].time) return keyframes[keyframes.length - 1]

    for (let i = 0; i < keyframes.length - 1; i++) {
      const current = keyframes[i]
      const next = keyframes[i + 1]
      
      if (currentTime >= current.time && currentTime <= next.time) {
        const t = (currentTime - current.time) / (next.time - current.time)
        const eased = 1 - Math.pow(1 - t, 3) // Ease out cubic
        
        return {
          rightArm: current.rightArm.map((val, idx) => 
            val + (next.rightArm[idx] - val) * eased
          ),
          rightHand: current.rightHand.map((val, idx) => 
            val + (next.rightHand[idx] - val) * eased
          ),
          leftArm: current.leftArm.map((val, idx) => 
            val + (next.leftArm[idx] - val) * eased
          ),
          head: current.head.map((val, idx) => 
            val + (next.head[idx] - val) * eased
          )
        }
      }
    }
    return keyframes[0]
  }

  // Apply animation
  useEffect(() => {
    if (currentAnimation && animationTime > 0) {
      const pose = interpolateKeyframes(currentAnimation.keyframes, animationTime)
      
      if (rightArmRef.current) {
        rightArmRef.current.rotation.set(...pose.rightArm)
      }
      if (rightHandRef.current) {
        rightHandRef.current.rotation.set(...pose.rightHand)
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.set(...pose.leftArm)
      }
      if (headRef.current) {
        headRef.current.rotation.x = pose.head[0]
      }
    }
  }, [animationTime, currentAnimation])

  return (
    <group ref={characterRef} position={[0, -1, 0]}>
      {/* Head */}
      <group ref={headRef} position={[0, 1.7, 0]}>
        {/* Main Head Shape */}
        <mesh castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial 
            color="#f5deb3" 
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        
        {/* Hair */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[-0.12, 0.08, 0.32]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.12, 0.08, 0.32]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        
        {/* Pupils */}
        <mesh position={[-0.12, 0.08, 0.36]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
        <mesh position={[0.12, 0.08, 0.36]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
        
        {/* Eyebrows */}
        <mesh position={[-0.12, 0.18, 0.32]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.08, 0.02, 0.01]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[0.12, 0.18, 0.32]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.08, 0.02, 0.01]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        
        {/* Nose */}
        <mesh position={[0, 0.02, 0.35]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#f0c8a0" />
        </mesh>
        
        {/* Mouth */}
        <mesh position={[0, -0.08, 0.32]}>
          <sphereGeometry args={[0.04, 16, 8]} />
          <meshStandardMaterial color="#d2691e" />
        </mesh>
      </group>

      {/* Neck */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.2, 16]} />
        <meshStandardMaterial color="#f5deb3" roughness={0.8} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.4, 1.2, 16]} />
        <meshStandardMaterial 
          color="#4a90e2" 
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Left Shoulder */}
      <mesh position={[-0.4, 1.3, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#4a90e2" roughness={0.7} />
      </mesh>

      {/* Right Shoulder */}
      <mesh position={[0.4, 1.3, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#4a90e2" roughness={0.7} />
      </mesh>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.5, 1.2, 0]}>
        {/* Upper Arm */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.4, 16]} />
          <meshStandardMaterial color="#f5deb3" roughness={0.8} />
        </mesh>
        
        {/* Forearm */}
        <mesh position={[0, -0.6, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.08, 0.4, 16]} />
          <meshStandardMaterial color="#f5deb3" roughness={0.8} />
        </mesh>
        
        {/* Left Hand */}
        <group ref={leftHandRef} position={[0, -0.9, 0]}>
          {/* Palm */}
          <mesh castShadow>
            <boxGeometry args={[0.12, 0.18, 0.06]} />
            <meshStandardMaterial color="#f0c8a0" roughness={0.9} />
          </mesh>
          
          {/* Thumb */}
          <mesh position={[0.08, 0.05, 0]} rotation={[0, 0, 0.5]} castShadow>
            <cylinderGeometry args={[0.012, 0.015, 0.08, 8]} />
            <meshStandardMaterial color="#f0c8a0" roughness={0.9} />
          </mesh>
          
          {/* Fingers */}
          {[0, 1, 2, 3].map(i => (
            <group key={i} position={[(i - 1.5) * 0.025, -0.12, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.008, 0.012, 0.07, 8]} />
                <meshStandardMaterial color="#f0c8a0" roughness={0.9} />
              </mesh>
              <mesh position={[0, -0.05, 0]} castShadow>
                <cylinderGeometry args={[0.006, 0.008, 0.04, 8]} />
                <meshStandardMaterial color="#f0c8a0" roughness={0.9} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.5, 1.2, 0]}>
        {/* Upper Arm */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.4, 16]} />
          <meshStandardMaterial color="#f5deb3" roughness={0.8} />
        </mesh>
        
        {/* Forearm */}
        <mesh position={[0, -0.6, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.08, 0.4, 16]} />
          <meshStandardMaterial color="#f5deb3" roughness={0.8} />
        </mesh>
        
        {/* Right Hand */}
        <group ref={rightHandRef} position={[0, -0.9, 0]}>
          {/* Palm */}
          <mesh castShadow>
            <boxGeometry args={[0.12, 0.18, 0.06]} />
            <meshStandardMaterial color="#f0c8a0" roughness={0.9} />
          </mesh>
          
          {/* Thumb */}
          <mesh position={[-0.08, 0.05, 0]} rotation={[0, 0, -0.5]} castShadow>
            <cylinderGeometry args={[0.012, 0.015, 0.08, 8]} />
            <meshStandardMaterial color="#f0c8a0" roughness={0.9} />
          </mesh>
          
          {/* Fingers */}
          {[0, 1, 2, 3].map(i => (
            <group key={i} position={[(i - 1.5) * 0.025, -0.12, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.008, 0.012, 0.07, 8]} />
                <meshStandardMaterial color="#f0c8a0" roughness={0.9} />
              </mesh>
              <mesh position={[0, -0.05, 0]} castShadow>
                <cylinderGeometry args={[0.006, 0.008, 0.04, 8]} />
                <meshStandardMaterial color="#f0c8a0" roughness={0.9} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* Waist */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.35, 0.15, 16]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.8} />
      </mesh>

      {/* Left Leg */}
      <group position={[-0.15, -0.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.15, 1.0, 16]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.8} />
        </mesh>
        
        {/* Left Foot */}
        <mesh position={[0, -0.6, 0.1]} castShadow>
          <boxGeometry args={[0.15, 0.08, 0.3]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.15, -0.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.15, 1.0, 16]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.8} />
        </mesh>
        
        {/* Right Foot */}
        <mesh position={[0, -0.6, 0.1]} castShadow>
          <boxGeometry args={[0.15, 0.08, 0.3]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* Animation Label */}
      {isPlaying && (
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {animationType === 'hello' ? 'Hello!' : 'Thank You!'}
        </Text>
      )}
    </group>
  )
}

export default ASLCharacter 