'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface TextChunk {
  text: string;
  duration: number; // in milliseconds
}

const textChunks: TextChunk[] = [
  { text: "hi stinky", duration: 5000 },
  { text: "hope you slept well", duration: 5000 },
  { text: "heard it was somebody's birthday today", duration: 5000 },
  { text: "jesusssssss #pray", duration: 5000 },
  { text: "but anyway, i wanted to tell you something...", duration: 4000 },
]

export default function Home() {
  const [currentChunk, setCurrentChunk] = useState(-1)
  const [hasStarted, setHasStarted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showChristmasMessage, setShowChristmasMessage] = useState(false)
  const [christmasMessageVisible, setChristmasMessageVisible] = useState(false)
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
        console.log('Starting audio playback...')
        console.log('Audio src:', audioRef.current.src)
        console.log('Audio readyState:', audioRef.current.readyState)
        
        // Set volume to audible level immediately
        audioRef.current.volume = 0.3
        audioRef.current.currentTime = 0 // Start at 0 seconds
        
        // Try to play
        const playPromise = audioRef.current.play()
        
        if (playPromise !== undefined) {
          await playPromise
          console.log('Audio started playing successfully')
          console.log('Audio volume:', audioRef.current.volume)
          console.log('Audio paused:', audioRef.current.paused)
        }
        
        // Fade in the volume over 3 seconds
        const fadeInInterval = setInterval(() => {
          if (audioRef.current && audioRef.current.volume < 1) {
            audioRef.current.volume = Math.min(audioRef.current.volume + 0.02, 1)
          } else {
            clearInterval(fadeInInterval)
            console.log('Audio fade-in complete, final volume:', audioRef.current?.volume)
          }
        }, 100) // Adjust volume every 100ms for smooth fade
      } catch (error) {
        console.error('Audio playback error:', error)
        // Try to play again with user interaction
        if (audioRef.current) {
          try {
            audioRef.current.volume = 1
            await audioRef.current.play()
            console.log('Audio started on retry')
          } catch (retryError) {
            console.error('Audio retry failed:', retryError)
          }
        }
      }
    } else {
      console.error('Audio ref is null')
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
            
            // If this is the last chunk, fade it out after its duration and show Christmas message
            if (currentIndex === textChunks.length - 1) {
              setTimeout(() => {
                console.log('Last chunk duration complete, fading out')
                setIsVisible(false)
                // Show Christmas message after fade out completes
                setTimeout(() => {
                  setShowChristmasMessage(true)
                  setTimeout(() => {
                    setChristmasMessageVisible(true)
                  }, 100) // Small delay to ensure element is rendered before fading in
                }, 1000) // Wait for fade out to complete
              }, nextTimeout)
            } else {
              setTimeout(showNextChunk, nextTimeout)
            }
          }, 1000) // Wait for fade out to complete
        } else {
          // This is the last chunk - fade it out after its duration
          console.log('Last chunk reached, fading out')
          setIsVisible(false)
          // Show Christmas message after fade out completes
          setTimeout(() => {
            setShowChristmasMessage(true)
            setTimeout(() => {
              setChristmasMessageVisible(true)
            }, 100) // Small delay to ensure element is rendered before fading in
          }, 1000) // Wait for fade out to complete
        }
      }
      
      // Start the sequence after the first chunk's duration
      setTimeout(showNextChunk, textChunks[0].duration)
    }, 2000) // Start text sequence 3 seconds after button click

    return () => {
      clearTimeout(textTimer)
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
        src="/song.mp3" 
        loop={false}
        preload="auto"
        onError={(e) => {
          console.error('Audio loading error:', e)
        }}
        onLoadedData={() => {
          console.log('Audio loaded successfully')
        }}
        onCanPlay={() => {
          console.log('Audio can play')
        }}
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
            Click on me 
          </button>
        </div>
      ) : showChristmasMessage ? (
        <div style={{ 
          position: 'relative',
          height: '100vh', 
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '15px' : '20px',
          overflow: 'hidden'
        }}>
          {/* Confetti particles */}
          {[...Array(50)].map((_, i) => (
            <div
              key={`confetti-${i}`}
              style={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                backgroundColor: ['#ff0000', '#00ff00', '#ffff00', '#ff00ff', '#00ffff'][i % 5],
                left: `${(i * 20) % 100}%`,
                top: '-10px',
                opacity: christmasMessageVisible ? 1 : 0,
                animation: `confettiFall ${3 + (i % 3)}s linear infinite`,
                animationDelay: `${i * 0.1}s`,
                zIndex: 1
              }}
            />
          ))}
          
          {/* Floating images */}
          <Image
            src="/tree.png"
            alt="Tree"
            width={isMobile ? 80 : 120}
            height={isMobile ? 80 : 120}
            style={{
              position: 'absolute',
              opacity: christmasMessageVisible ? 0.6 : 0,
              transition: 'opacity 1s ease-in-out',
              animation: 'float1 8s ease-in-out infinite',
              zIndex: 1,
              top: '10%',
              left: '5%'
            }}
          />
          <Image
            src="/minion.png"
            alt="Minion"
            width={isMobile ? 80 : 120}
            height={isMobile ? 80 : 120}
            style={{
              position: 'absolute',
              opacity: christmasMessageVisible ? 0.6 : 0,
              transition: 'opacity 1s ease-in-out',
              animation: 'float2 10s ease-in-out infinite',
              zIndex: 1,
              top: '20%',
              right: '10%'
            }}
          />
          <Image
            src="/hcr.png"
            alt="HCR"
            width={isMobile ? 80 : 120}
            height={isMobile ? 80 : 120}
            style={{
              position: 'absolute',
              opacity: christmasMessageVisible ? 0.6 : 0,
              transition: 'opacity 1s ease-in-out',
              animation: 'float3 12s ease-in-out infinite',
              zIndex: 1,
              bottom: '15%',
              left: '8%'
            }}
          />
          <Image
            src="/hph.png"
            alt="HPH"
            width={isMobile ? 80 : 120}
            height={isMobile ? 80 : 120}
            style={{
              position: 'absolute',
              opacity: christmasMessageVisible ? 0.6 : 0,
              transition: 'opacity 1s ease-in-out',
              animation: 'float4 9s ease-in-out infinite',
              zIndex: 1,
              bottom: '25%',
              right: '5%'
            }}
          />
          
          {/* Christmas message text */}
          <h1
            style={{
              background: 'linear-gradient(90deg, #ff0000 0%, #00ff00 50%, #ff0000 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: isMobile ? '2.5rem' : '4rem',
              fontWeight: 'bold',
              textAlign: 'center',
              fontFamily: 'Arial, Helvetica, sans-serif',
              margin: '0',
              padding: '0',
              opacity: christmasMessageVisible ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              textShadow: '0 0 20px rgba(255, 0, 0, 0.5), 0 0 20px rgba(0, 255, 0, 0.5)',
              position: 'relative',
              zIndex: 10
            }}
          >
            HAPPY CHRISTMAS MY LOVE!!!
          </h1>
        </div>
      ) : (
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
      )}
    </main>
  )
}
