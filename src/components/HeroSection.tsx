import React, { useRef, useEffect } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

interface HeroSectionProps {
  onStartLifePath: () => void;
  onExploreCourses: () => void;
  heroBannerUrl?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartLifePath,
  onExploreCourses,
  heroBannerUrl = 'https://s.imgz.io/2026/10/09/792ee306f311a1f20f74869bf0501cb8122544b471a93be1.png',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if current heroBannerUrl is a video format or Google Flow share link
  const isVideo = React.useMemo(() => {
    if (!heroBannerUrl) return true;
    const clean = heroBannerUrl.trim().toLowerCase();
    return (
      clean.endsWith('.mp4') ||
      clean.endsWith('.webm') ||
      clean.endsWith('.mov') ||
      clean.includes('hero-video') ||
      clean.includes('flow.google.com/shared/video') ||
      clean.includes('flow-content.google/video') ||
      clean.includes('video')
    );
  }, [heroBannerUrl]);

  // Resolve video source (prioritize high-speed local MP4, fallback to Google Flow CDN)
  const videoSrc = React.useMemo(() => {
    if (
      !heroBannerUrl ||
      heroBannerUrl.includes('flow.google.com/shared/video') ||
      heroBannerUrl === '/hero-video.mp4' ||
      heroBannerUrl.includes('hero-video')
    ) {
      return '/hero-video.mp4';
    }
    return heroBannerUrl;
  }, [heroBannerUrl]);

  // Ensure video auto-plays seamlessly
  useEffect(() => {
    if (videoRef.current && isVideo) {
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Video auto-play deferred until user interaction:', err);
        });
      }
    }
  }, [videoSrc, isVideo]);

  return (
    <section 
      className="relative w-full overflow-hidden min-h-[540px] sm:min-h-[600px] md:min-h-[660px] lg:min-h-[720px] max-h-[840px] flex items-center justify-center p-0 m-0 border-0 rounded-none bg-white transition-all duration-300"
    >
      {/* Background Media: Video or Static Image (Full Width, Centered, No Border, with Soft Bottom Edge Mask) */}
      {isVideo ? (
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/hero-video-poster.jpg"
            className="w-full h-full object-cover object-center"
          >
            <source src={videoSrc} type="video/mp4" />
            <source
              src="https://flow-content.google/video/788b525f-4877-429f-92ca-6d402f0f796f?Expires=1791296170&KeyName=labs-flow-prod-cdn-key&Signature=s8IiiijCxl3N5blqYrDJO9ZEj7g"
              type="video/mp4"
            />
          </video>
        </div>
      ) : (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
          style={{ 
            backgroundImage: `url('${heroBannerUrl}')`,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
          }}
        />
      )}

      {/* Main Content (Left aligned as requested) */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-left relative z-30 pt-16 pb-28 sm:pt-20 sm:pb-36 md:pt-24 md:pb-40">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Main Headline - English font: Patrick Hand for both 'Unusual Minds' and 'Create a Brighter Tomorrow.', pure black text with yellow underline under Tomorrow. */}
          <h1 className="animate-hero-fade-in-up font-['Patrick_Hand',cursive] font-patrick text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-black tracking-wide leading-[1.15] sm:leading-[1.1]">
            <span 
              className="block text-black font-['Patrick_Hand',cursive] font-patrick animate-pulse-soft origin-left"
              style={{ fontFamily: "'Patrick Hand', cursive" }}
            >
              Unusual Minds
            </span>
            <span 
              className="inline-block my-1 sm:my-1.5 text-black font-['Patrick_Hand',cursive] font-patrick animate-pulse-soft origin-left"
              style={{ fontFamily: "'Patrick Hand', cursive" }}
            >
              Create a Brighter{' '}
              <span 
                className="relative inline-block text-black font-['Patrick_Hand',cursive] font-patrick"
                style={{ fontFamily: "'Patrick Hand', cursive" }}
              >
                Tomorrow.
                {/* Hand-drawn curved yellow underline */}
                <svg
                  className="absolute -bottom-2 sm:-bottom-3 md:-bottom-4 left-0 w-full h-3 sm:h-4 md:h-5 pointer-events-none overflow-visible"
                  viewBox="0 0 200 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 11C48 3 135 2 197 9C152 14 85 15 32 15"
                    stroke="#FFC800"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>
          </h1>

          {/* Subtitle / Thai description with Mitr font as requested */}
          <p className="animate-hero-fade-in-up-delay-1 mt-5 sm:mt-6 text-base sm:text-lg md:text-xl text-slate-800 font-medium leading-relaxed font-['Mitr',sans-serif]">
            พื้นที่เรียนรู้ที่เปิดกว้าง ให้ทุกไอเดียแปลกๆ กลายเป็นทักษะจริงในโลกจริง
          </p>

          {/* Action Buttons - Styled in #FFC800 / #000000 palette with NO black border */}
          <div className="animate-hero-fade-in-up-delay-2 mt-8 sm:mt-10 flex flex-wrap items-center justify-start gap-3.5 sm:gap-4 relative z-40">
            <button
              onClick={onStartLifePath}
              className="px-8 py-3.5 rounded-full bg-[#FFC800] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white text-[#000000] font-bold text-sm sm:text-base font-['Mitr',sans-serif] shadow-[0_4px_20px_rgba(255,200,0,0.45)] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2.5 group cursor-pointer border-0"
            >
              <span>เริ่มต้นออกแบบชีวิต</span>
              <ArrowRight className="w-4 h-4 text-[#000000] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={onExploreCourses}
              className="px-7 py-3.5 rounded-full bg-[#000000] hover:bg-[#FFC800] hover:text-[#000000] active:bg-[#FFC800] active:text-[#000000] text-white font-bold text-sm sm:text-base font-['Mitr',sans-serif] shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 cursor-pointer border-0 group"
            >
              <BookOpen className="w-4 h-4 text-[#FFC800] group-hover:text-[#000000] transition-colors" />
              <span>เข้าสู่บทเรียนออนไลน์</span>
            </button>

          </div>
        </div>
      </div>

      {/* Soft Edge Fade-Out Overlay - Seamlessly blending to next section */}
      <div 
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-36 sm:h-52 md:h-64 pointer-events-none z-10 bg-gradient-to-b from-transparent via-white/40 via-white/80 to-white"
      />
      <div 
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 sm:h-36 md:h-48 pointer-events-none z-10 backdrop-blur-[3px]"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 40%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 40%, black 100%)',
        }}
      />
    </section>
  );
};
