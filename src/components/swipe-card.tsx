
'use client';

import React, { useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import type { Pet } from '@/lib/data';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { MapPin } from 'lucide-react';

interface SwipeCardProps {
  pet: Pet;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
}

const SwipeCard = ({ pet, onSwipe, isTop }: SwipeCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const scale = useTransform(y, [-100, 0], [0.9, 1]);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

  // Use framer-motion springs for a smoother feel
  const springConfig = { stiffness: 300, damping: 30 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const bind = useDrag(
    ({ down, movement: [mx, my], direction: [xDir], velocity: [vx] }) => {
      // Allow dragging only on the top card
      if (!isTop) return;
      
      const dir = xDir < 0 ? -1 : 1; // Direction should be -1 or 1
      const trigger = vx > 0.2; // If velocity is high, trigger a swipe

      if (!down && trigger) {
        onSwipe(dir === 1 ? 'right' : 'left');
      }

      x.set(down ? mx : 0);
      y.set(down ? my : 0);
    },
    {
      filterTaps: true,
      rubberband: true,
      from: () => [x.get(), y.get()],
    }
  );

  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  return (
    <div {...(isTop ? bind() : {})} className="absolute w-full h-full">
      <motion.div
        className="relative w-full h-full"
        style={{
          x: xSpring,
          y: ySpring,
          rotate,
          scale: isTop ? scale : 1, // only scale the top card
          touchAction: 'none',
        }}
        animate={{
          y: isTop ? 0 : -30,
          scale: isTop ? 1 : 0.9,
          transition: { type: 'spring', stiffness: 200, damping: 20 }
        }}
      >
      <div className={`relative w-full h-full rounded-2xl shadow-2xl bg-card overflow-hidden ${isTop ? 'cursor-grab active:cursor-grabbing' : ''}`}>
        <Image
          src={pet.photos[0]}
          alt={pet.name}
          data-ai-hint={`${pet.species} ${pet.breed}`}
          fill
          className="object-cover pointer-events-none"
          priority={isTop}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute top-4 left-4 z-10">
          <motion.div style={{ opacity: likeOpacity }} className="px-4 py-2 border-2 border-green-400 text-green-400 font-bold text-2xl rounded-lg -rotate-12">
            LIKE
          </motion.div>
        </div>

         <div className="absolute top-4 right-4 z-10">
          <motion.div style={{ opacity: nopeOpacity }} className="px-4 py-2 border-2 border-red-500 text-red-500 font-bold text-2xl rounded-lg rotate-12">
            NOPE
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-shadow">
          <h2 className="text-3xl font-bold font-serif">{pet.name}, {pet.age}</h2>
          <p className="text-lg">{pet.breed}</p>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <MapPin className="h-4 w-4" />
            <span>{pet.location}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {pet.traits.slice(0, 3).map((trait) => (
              <Badge key={trait} variant="secondary" className="bg-white/20 text-white border-none">
                {trait}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      </motion.div>
    </div>
  );
};

export default SwipeCard;
