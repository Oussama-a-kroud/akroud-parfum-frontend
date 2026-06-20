
import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

// ZEDNA 'category' HNA K-PROP 👇
export default function PerfumeBottle({ category }) {
  const group = useRef()
  const liquidMat = useRef() // Hadi d l-material d s-sa2il
  const targetColor = useRef(new THREE.Color('#fbbf24')) // Loun l-iftiradi (Amber/Dhebi)

  const [logoTexture, setLogoTexture] = useState(null)

  // Mnin t-tbeddel l-catégorie, kan-wjdou l-loun jdid
  useEffect(() => {
    if (category?.includes('Rjal')) {
      targetColor.current.set('#3b82f6') // Zre9 barid
    } else if (category?.includes('3yalat')) {
      targetColor.current.set('#ec4899') // Rose
    } else if (category?.includes('Khachabi')) {
      targetColor.current.set('#b45309') // Qahwi / Dhebi mghmou9
    } else {
      targetColor.current.set('#fbbf24') // Amber (Mixtes w Kolchi)
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
    // Animation dyal l-9ri3a (katla3 w thbet chwiya)
    group.current.position.y = -1.5 + Math.sin(t * 1.5) * 0.05
    group.current.rotation.y = Math.sin(t / 2.5) * 0.4

    // HNA L'ANIMATION DYAL LOUN (Kay-tbeddel Smooth ⏳)
    if (liquidMat.current) {
      liquidMat.current.color.lerp(targetColor.current, 0.05)
    }
  })

  return (
    <>
      {/* Adwa2 (Lights) mjhdin bach y3tiw l'm3aan l zaja */}
      <ambientLight intensity={2} />
      <directionalLight position={[5, 5, 5]} intensity={3} color="#ffffff" />
      <directionalLight position={[-5, 2, -5]} intensity={2} color="#eef4f7" />
      <spotLight position={[0, 5, 10]} intensity={4} penumbra={1} />

      <group ref={group} position={[0, -1.5, 0]}>
        
       {/* ======================================= */}
        {/* 1. S-SA2IL (LIQUID) L-DAKHEL 🧪 */}
        {/* ======================================= */}
        <mesh position={[0, 0.98, 0]}> {/* 👈 Hna: tl3na l-position Y mn 0.85 l 0.98 bach t-tla3 l-fo9 */}
          {/* Cylinder sghir chwiya mn Zaja bach ybban ldakhel */}
          <cylinderGeometry args={[0.56, 0.56, 1.75, 64]} /> {/* 👈 Hna: zadna f t-toul mn 1.45 l 1.75 */}
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

        {/* ======================================= */}
        {/* 2. L'9RI3A - ZAJA (OUTER GLASS) 💎 */}
        {/* ======================================= */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 1.8, 64]} />
          <meshPhysicalMaterial
            color="#ffffff" // Zaja rj3naha byda chwiy bach tbeyyen loun sa2il
            transmission={1} 
            transparent={true}
            opacity={1}
            roughness={0.05} // Rteb bzaf
            metalness={0.1}
            ior={1.5} // In3ikas d Zaja
            thickness={2} // L'ghold d Zaja bach i3wj l-loun d sa2il mzyaan
            clearcoat={1} 
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* 3. L'mghtaya (Cap) - K7la */}
        <mesh position={[0, 2.3, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.8, 64]} />
          <meshStandardMaterial color="#050505" metalness={0.9} roughness={0.2} />
        </mesh>
        
        {/* 4. Tiyou l'ldakhel (Tube) */}
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

        {/* 5. Tikiya d l'Logo */}
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

