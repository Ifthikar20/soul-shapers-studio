// src/components/Hero.tsx - Updated with black/purple text and white bottom fade
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Sparkles, Brain, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import startdustVideo from "@/assets/stardustvid.mp4";

const Hero = () => {
  const [isDissolving, setIsDissolving] = useState(false);
  const [particles, setParticles] = useState([]);
  const [hasTriggered, setHasTriggered] = useState(false);
  const textRef = useRef(null);

  const createParticles = () => {
    if (!textRef.current) return;

    const rect = textRef.current.getBoundingClientRect();
    const newParticles = [];

    // Create particles based on text dimensions
    const particleCount = 150;
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: Math.random() * -3 - 1,
        life: 1,
        decay: Math.random() * 0.02 + 0.01
      });
    }
    
    setParticles(newParticles);
  };

  const startDissolve = () => {
    setIsDissolving(true);
    createParticles();
  };

  const resetEffect = () => {
    setIsDissolving(false);
    setParticles([]);
  };

  // One-time effect on page load
  useEffect(() => {
    if (!hasTriggered) {
      const loadTimer = setTimeout(() => {
        startDissolve();
        setHasTriggered(true);
      }, 3000); // Trigger after 3 seconds on page load

      return () => clearTimeout(loadTimer);
    }
  }, [hasTriggered]);

  // Reset effect after particles fade out
  useEffect(() => {
    if (isDissolving && particles.length === 0) {
      const resetTimer = setTimeout(() => {
        resetEffect();
      }, 1500); // Wait a bit before resetting

      return () => clearTimeout(resetTimer);
    }
  }, [isDissolving, particles.length]);

  useEffect(() => {
    if (!isDissolving || particles.length === 0) return;

    const animationFrame = requestAnimationFrame(function animate() {
      setParticles(prevParticles => {
        const updatedParticles = prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.velocityX,
            y: particle.y + particle.velocityY,
            life: particle.life - particle.decay,
            opacity: particle.opacity * (particle.life - particle.decay)
          }))
          .filter(particle => particle.life > 0);

        if (updatedParticles.length > 0) {
          requestAnimationFrame(animate);
        }

        return updatedParticles;
      });
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [isDissolving, particles.length]);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden w-full">
      {/* Background Video - Full Width */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={startdustVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Original overlay */}
        <div className="absolute inset-0 bg-gradient-hero opacity-60"></div>
        {/* White fade at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/80 via-white/40 to-transparent"></div>
      </div>

      {/* Curved Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[400px] h-[300px] bg-primary/8 rounded-[60%_40%_50%_50%] blur-3xl animate-pulse rotate-12"></div>
        <div className="absolute top-40 right-20 w-[500px] h-[350px] bg-purple-400/8 rounded-[40%_60%_70%_30%] blur-3xl animate-pulse delay-1000 -rotate-12"></div>
        <div className="absolute bottom-32 left-1/4 w-[350px] h-[250px] bg-primary/6 rounded-[70%_30%_40%_60%] blur-3xl animate-pulse delay-500 rotate-45"></div>
        <div className="absolute bottom-10 right-10 w-[300px] h-[200px] bg-purple-500/6 rounded-[50%_50%_60%_40%] blur-2xl animate-pulse delay-700"></div>
      </div>

      {/* Content - Now properly centered without container constraints */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center">
        {/* Main title with dust effect */}
        <div className="relative mb-8">
          <h1 
            ref={textRef}
            className={`text-6xl md:text-8xl font-bold text-black mb-8 leading-tight transition-all duration-1000 ${
              isDissolving ? 'opacity-0 transform scale-110 blur-sm' : 'opacity-100'
            }`}
            style={{
              textShadow: '0 0 20px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Better Mind,
            <span className="bg-gradient-to-r from-purple-600 via-purple-800 to-purple-900 bg-clip-text text-transparent block">
              Blissful Life
            </span>
          </h1>

          {/* Particle system overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map(particle => (
              <div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: `${particle.x}px`,
                  top: `${particle.y}px`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  opacity: particle.opacity,
                  boxShadow: `0 0 ${particle.size * 3}px rgba(147,51,234,0.8)`,
                  background: particle.id % 3 === 0 
                    ? 'linear-gradient(45deg, #9333ea, #7c3aed)' 
                    : particle.id % 3 === 1 
                    ? 'linear-gradient(45deg, #7c3aed, #6366f1)'
                    : '#8b5cf6'
                }}
              />
            ))}
          </div>
        </div>
        
        <p className="text-xl md:text-2xl text-gray-800 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
          Discover expert-curated content on mental health, wellness, and personal transformation. 
          Break limiting patterns and unlock your infinite potential with our futuristic learning platform.
        </p>

        <div className="flex justify-center items-center mb-16">
          <Button variant="outline" size="lg" className="min-w-[240px] h-14 text-base rounded-full border-purple-600 text-purple-700 hover:bg-purple-50">
            <Users className="w-5 h-5 mr-3" />
            Join My Community
            <ArrowRight className="w-5 h-5 ml-3" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;