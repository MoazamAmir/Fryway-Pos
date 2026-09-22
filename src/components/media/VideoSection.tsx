import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Sparkles, ChefHat } from 'lucide-react';
import { FRYWAY_IMAGES, RESTAURANT_INFO } from '../../data/menuData';

export const VideoSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="py-16 md:py-20 bg-neutral-900 text-white relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-900/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
            <ChefHat className="w-3.5 h-3.5 text-amber-400" />
            <span>The Artisan Fryway Standard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Syne',sans-serif] uppercase tracking-tight text-white mb-4">
            CRAFTED WITH PRECISION. SERVED SIZZLING.
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
            Watch our master fry process: from premium farm-fresh potatoes cut by hand to order, to the golden high-heat fry and signature sauce drizzle.
          </p>
        </div>

        {/* Cinematic Video Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden border-2 border-neutral-800 bg-neutral-950 shadow-2xl shadow-black/80 group"
        >
          {/* Video element with fallback poster */}
          <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
            <video
              ref={videoRef}
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              poster={FRYWAY_IMAGES.storeCraft}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Subtle cinematic gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/30 pointer-events-none" />

            {/* Video Badges & Controls Overlay */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Live Kitchen Craft
              </span>
            </div>

            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
              {/* Sound Toggle */}
              <button
                id="video-mute-toggle"
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 text-white flex items-center justify-center border border-white/10 transition-all focus:outline-none"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Play / Pause Toggle */}
              <button
                id="video-play-toggle"
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-all focus:outline-none"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
            </div>

            {/* Bottom Info Bar inside video */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 bg-black/50 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block mb-0.5">
                  Bahria Town Lahore Kitchen
                </span>
                <h3 className="text-lg sm:text-xl font-black font-['Syne',sans-serif] uppercase text-white">
                  Never Pre-Frozen. Double-Fried Perfection.
                </h3>
              </div>
              <div className="text-xs text-neutral-300 font-medium">
                Order hot for takeaway or delivery at {RESTAURANT_INFO.phoneDisplay}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
