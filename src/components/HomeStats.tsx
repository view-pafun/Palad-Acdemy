import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  target: number;
  active: boolean;
  duration?: number;
}

// Smooth count-up animation function using requestAnimationFrame and easeOutExpo
const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ target, active, duration = 1800 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo easing for rapid initial count-up and gentle deceleration
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(target * ease);
      setCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [active, target, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export const HomeStats: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);

  // Platform Metrics Targets
  const [metrics, setMetrics] = useState({
    activeUsers: 14280,
    assessmentsCompleted: 8940,
    totalCourses: 48,
    knowledgeIdeas: 5880,
    sanctuaryConsultations: 1250,
  });

  // Intersection Observer to trigger count-up animation when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasEnteredViewport) {
          setHasEnteredViewport(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasEnteredViewport]);

  // Occasional live ticker update
  useEffect(() => {
    if (!hasEnteredViewport) return;
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        activeUsers: prev.activeUsers + (Math.random() > 0.4 ? 1 : 0),
        assessmentsCompleted: prev.assessmentsCompleted + (Math.random() > 0.6 ? 1 : 0),
        knowledgeIdeas: prev.knowledgeIdeas + (Math.random() > 0.7 ? 1 : 0),
        sanctuaryConsultations: prev.sanctuaryConsultations + (Math.random() > 0.8 ? 1 : 0),
      }));
    }, 7000);
    return () => clearInterval(interval);
  }, [hasEnteredViewport]);

  // 5 Metrics Definition (No icons as requested)
  const metricList = [
    {
      id: 'metric-1',
      label: 'จำนวนผู้ใช้งานเว็บไซต์',
      value: metrics.activeUsers,
    },
    {
      id: 'metric-2',
      label: 'ที่ทำแบบประเมินอาชีพ',
      value: metrics.assessmentsCompleted,
    },
    {
      id: 'metric-3',
      label: 'หลักสูตรทั้งหมด',
      value: metrics.totalCourses,
    },
    {
      id: 'metric-4',
      label: 'ไอเดียจากห้องสมุดความรู้',
      value: metrics.knowledgeIdeas,
    },
    {
      id: 'metric-5',
      label: 'การปรึกษาและพักใจ',
      value: metrics.sanctuaryConsultations,
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-10 sm:py-14 lg:py-16 bg-white relative overflow-hidden border-b border-slate-100/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimalist 5-Column Horizontal Layout without header text */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 items-center text-center">
          {metricList.map((item, idx) => (
            <div
              key={item.id}
              className={`flex flex-col items-center justify-center group cursor-default transition-transform duration-300 hover:-translate-y-1 ${
                idx === 4 ? 'col-span-2 md:col-span-1' : ''
              }`}
            >
              {/* Bold, Elegant Animated Number Counter with + sign */}
              <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight font-mono tabular-nums leading-none">
                <AnimatedCounter target={item.value} active={hasEnteredViewport} />+
              </p>

              {/* Clean Metric Label */}
              <p className="text-xs sm:text-sm font-medium text-slate-600 mt-3 leading-snug">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
