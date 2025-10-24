'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface TextChunk {
  text: string;
  duration: number; // in milliseconds
}

const textChunks: TextChunk[] = [
  { text: "hey baby", duration: 3000 },
  { text: "hope you slept well ha ha", duration: 3000 },
  { text: "anyway", duration: 3000 },
  { text: "i know we've been going steady for quite a while now", duration: 3000 },
  { text: "and you know u mean everything to me", duration: 3000 },
  { text: "and i can't hold it in anymore", duration: 3000 },
  { text: "baby i have a question...", duration: 3000 },
  { text: "would u make me the happiest bug in the world", duration: 10000 }
]

export default function Home() {
  const [currentChunk, setCurrentChunk] = useState(-1)
  const [showImage, setShowImage] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [imageVisible, setImageVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const startExperience = async () => {
    setHasStarted(true)
    
    // Try to play audio starting at 0 seconds with fade in
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0 // Start at 0 seconds
        audioRef.current.volume = 0 // Start with no volume
        await audioRef.current.play()
        
        // Fade in the volume over 3 seconds
        const fadeInInterval = setInterval(() => {
          if (audioRef.current && audioRef.current.volume < 1) {
            audioRef.current.volume = Math.min(audioRef.current.volume + 0.05, 1)
          } else {
            clearInterval(fadeInInterval)
          }
        }, 150) // Adjust volume every 150ms for smooth fade
      } catch (error) {
        console.log('Audio autoplay blocked:', error)
        // Audio will play on user interaction
      }
    }

    // Start text sequence after a brief delay
    const textTimer = setTimeout(() => {
      // Show first chunk with fade in
      console.log('Starting first chunk:', textChunks[0].text)
      setCurrentChunk(0)
      setTimeout(() => {
        setIsVisible(true)
      }, 100) // Small delay to ensure the element is rendered before fading in
      
      let currentIndex = 0
      
      const showNextChunk = () => {
        currentIndex++
        console.log('showNextChunk called, currentIndex:', currentIndex)
        
        if (currentIndex < textChunks.length) {
          // Fade out current text
          setIsVisible(false)
          
          // After fade out, change text and fade in
          setTimeout(() => {
            console.log('Setting chunk to:', currentIndex, 'text:', textChunks[currentIndex]?.text)
            setCurrentChunk(currentIndex)
            setIsVisible(true)
            
            // Schedule next chunk after current chunk's duration
            const nextTimeout = textChunks[currentIndex].duration
            console.log('Next chunk will show in:', nextTimeout, 'ms')
            setTimeout(showNextChunk, nextTimeout)
          }, 1000) // Wait for fade out to complete
        }
      }
      
      // Start the sequence after the first chunk's duration
      setTimeout(showNextChunk, textChunks[0].duration)

      return () => {
        // Cleanup is handled by the component unmounting
      }
    }, 1000) // Start text sequence 1 second after page load

    // Show images exactly 32.3 seconds after button click
    const imageTimer = setTimeout(() => {
      setIsVisible(false) // Hide any remaining text
      setTimeout(() => {
        setShowImage(true)
        setTimeout(() => {
          setImageVisible(true)
        }, 100) // Small delay to ensure image is rendered before fading in
      }, 1000) // Wait for text fade out
    }, 32300) // 32.3 seconds after button click

    return () => {
      clearTimeout(textTimer)
      clearTimeout(imageTimer)
    }
  }

  return (
    <main style={{ 
      backgroundColor: '#000000', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        src="/Lil Wayne - How To Love (Lyrics).mp3" 
        loop={false}
        preload="auto"
      />
      
      {!hasStarted ? (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={startExperience}
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '2px solid #ffffff',
              padding: isMobile ? '15px 30px' : '20px 40px',
              fontSize: isMobile ? '1.2rem' : '1.5rem',
              fontFamily: 'Arial, Helvetica, sans-serif',
              cursor: 'pointer',
              borderRadius: '5px',
              transition: 'all 0.3s ease',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
            onMouseOver={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = 'scale(1.1)'
              }
            }}
            onMouseOut={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = 'scale(1)'
              }
            }}
            onTouchStart={(e) => {
              if (isMobile) {
                e.currentTarget.style.transform = 'scale(1.1)'
              }
            }}
            onTouchEnd={(e) => {
              if (isMobile) {
                setTimeout(() => {
                  e.currentTarget.style.transform = 'scale(1)'
                }, 150)
              }
            }}
          >
            Press on me its important
          </button>
        </div>
      ) : !showImage ? (
        <div style={{ 
          position: 'relative',
          height: '100vh', 
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '15px' : '20px'
        }}>
          {currentChunk >= 0 && (
            <p 
              style={{
                color: '#ffffff',
                fontSize: isMobile ? '1.3rem' : '2rem',
                lineHeight: isMobile ? '1.5' : '1.6',
                textAlign: 'center',
                fontFamily: 'Papyrus, fantasy',
                maxWidth: isMobile ? '100%' : '1000px',
                width: '100%',
                margin: '0',
                padding: isMobile ? '0 10px' : '0',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal'
              }}
            >
              {textChunks[currentChunk]?.text}
            </p>
          )}
        </div>
      ) : (
        <div
          key={showImage ? 'image-visible' : 'image-hidden'}
          style={{
            opacity: imageVisible ? 1 : 0,
            transition: 'opacity 3s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '15px' : '20px',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
          }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gridTemplateRows: isMobile ? 'repeat(4, auto)' : '1fr 1fr',
              gap: isMobile ? '18px' : '26px',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? '370px' : '1100px',
            }}
          >
            <Image
              src="/chris.png"
              alt="Seaweeds"
              width={isMobile ? 160 : 350}
              height={isMobile ? 120 : 180}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: isMobile ? '8px' : '0',
                justifySelf: 'center'
              }}
            />
            <Image
              src="/lunch.png"
              alt="Seaweeds"
              width={isMobile ? 160 : 350}
              height={isMobile ? 120 : 180}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: isMobile ? '8px' : '0',
                justifySelf: 'center'
              }}
            />
            <Image
              src="/date.png"
              alt="Seaweeds"
              width={isMobile ? 160 : 350}
              height={isMobile ? 120 : 180}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: isMobile ? '8px' : '0',
                justifySelf: 'center'
              }}
            />
            <Image
              src="/clock.png"
              alt="7:30"
              width={isMobile ? 160 : 350}
              height={isMobile ? 120 : 180}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: isMobile ? '8px' : '0',
                justifySelf: 'center'
              }}
            />
          </div>
        </div>
      )}
    </main>
  )
}
