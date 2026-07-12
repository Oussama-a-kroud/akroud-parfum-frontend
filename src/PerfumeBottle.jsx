import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

export default function PerfumeBottle({ category }) {
  const group = useRef()
  const liquidMat = useRef() 
  const targetColor = useRef(new THREE.Color('#fbbf24')) 

  const [logoTexture, setLogoTexture] = useState(null)

  // هاهو الشرط الجديد ديال "باقات 🎁"
  useEffect(() => {
    if (category?.includes('رجال')) {
      targetColor.current.set('#3b82f6') // أزرق
    } else if (category?.includes('نساء')) {
      targetColor.current.set('#ec4899') // وردي
    } else if (category?.includes('خشبي')) {
      targetColor.current.set('#b45309') // بني
    } else if (category?.includes('باقات')) {
      targetColor.current.set('#8b5cf6') // موڤ / بنفسجي ملكي 💜
    } else {
      targetColor.current.set('#fbbf24') // ذهبي
    }
  }, [category])

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load('/logo.png', (texture) => {
      setLogoTexture(texture)
    }, undefined, (err) => {
      console.error("Mal9itch tsawira dyal logo.png", err)
    })
  }, [])

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime()
    group.current.position.y = -1.5 + Math.sin(t * 1.5) * 0.05
    group.current.rotation.y = Math.sin(t / 2.5) * 0.4

    if (liquidMat.current) {
      liquidMat.current.color.lerp(targetColor.current, 0.05)
    }
  })

  return (
    <>
      <ambientLight intensity={2} />
      <directionalLight position={[5, 5, 5]} intensity={3} color="#ffffff" />
      <directionalLight position={[-5, 2, -5]} intensity={2} color="#eef4f7" />
      <spotLight position={[0, 5, 10]} intensity={4} penumbra={1} />

      <group ref={group} position={[0, -1.5, 0]}>
        
        {/* 1. السائل الداخلي */}
        <mesh position={[0, 0.98, 0]}> 
          <cylinderGeometry args={[0.56, 0.56, 1.75, 64]} /> 
          <meshPhysicalMaterial
            ref={liquidMat}
            color="#fbbf24" 
            transmission={0.8} 
            transparent={true}
            opacity={0.9}
            roughness={0.1}
            ior={1.33} 
          />
        </mesh>

        {/* 2. زجاجة العطر */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 1.8, 64]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={1} 
            transparent={true}
            opacity={1}
            roughness={0.05}
            metalness={0.1}
            ior={1.5}
            thickness={2}
            clearcoat={1} 
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* 3. الغطاء */}
        <mesh position={[0, 2.3, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.8, 64]} />
          <meshStandardMaterial color="#050505" metalness={0.9} roughness={0.2} />
        </mesh>
        
        {/* 4. التيّو */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.8, 8]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            transmission={0.5} 
            transparent={true} 
            opacity={0.3} 
            roughness={0.2} 
          />
        </mesh>

        {/* 5. اللوغو */}
        {logoTexture && (
          <mesh position={[0, 0.9, 0]} rotation={[0, Math.PI, 0]}> 
            <cylinderGeometry args={[0.611, 0.611, 1, 64, 1, true, Math.PI / 1.5, Math.PI / 1.5 * 1]} /> 
            <meshBasicMaterial 
              map={logoTexture} 
              transparent={true} 
              side={THREE.FrontSide} 
            />
          </mesh>
        )}
      </group>

      <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={10} blur={2.5} />
      
      <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2.1} />
    </>
  )
}