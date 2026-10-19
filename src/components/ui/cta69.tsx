import { Badge7 } from "@/components/ui/cta69-utils/badge7";
import { Button12 } from "@/components/ui/cta69-utils/button12";
import { cn } from "@/lib/utils";

export interface Badge {
  label: string;
}

export interface ActionButton {
  label: string;
  href: string;
}

export interface Cta69Labels {
  /** Repeated phrase scrolling across the backdrop */
  marqueePhrase?: string;
  /** Short supporting line beneath the heading */
  note?: string;
  /** Fine print sitting under the button */
  footnote?: string;
}

export interface Cta69Props {
  badge?: Badge;
  heading?: string;
  button?: ActionButton;
  labels?: Cta69Labels;
  className?: string;
}

export const cta69Demo: Cta69Props = {
  badge: { label: "ก้าวขึ้นยานมาเดินทางไปกับเรา" },
  heading: "PALAD ACADEMY",
  button: {
    label: "Start",
    href: "https://palad-acdemy.vercel.app/",
  },
  labels: {
    marqueePhrase: "PALAD ACADEMY",
    note: "“เปลี่ยนความประหลาด... ให้กลายเป็นพลังงานขับเคลื่อนจักรวาล”",
    footnote: "ยานแม่ของคนนอกกรอบ",
  },
};

/**
 * How many times the phrase is written into one half of the marquee.
 *
 * The loop is two identical halves slid by exactly half their width, so it only
 * reads as endless while a single half is wider than the screen. A short phrase
 * written once is not: it reaches the right edge and then drags a hole across
 * the section until the animation restarts. Repeating it is what closes that
 * hole, and eight is enough for a one-word phrase at this size.
 */
const REPEATS = 8;

export function Cta69({
  badge = cta69Demo.badge,
  heading = cta69Demo.heading,
  button = cta69Demo.button,
  labels = cta69Demo.labels,
  className,
}: Cta69Props) {
  const marqueePhrase = labels?.marqueePhrase;
  // The separator lives inside the phrase rather than in padding between spans:
  // padding is only applied between elements, so it left one wide gap per copy
  // instead of the same small gap between every repeat.
  const marqueeLine = marqueePhrase ? `${marqueePhrase} · `.repeat(REPEATS) : "";

  return (
    <section className={cn("relative overflow-hidden bg-slate-900 text-white py-16 md:py-24 w-full rounded-3xl border border-slate-800 shadow-2xl", className)}>
      <style>{`
        @keyframes cta69-marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-cta69-marquee {
          animation: cta69-marquee 32s linear infinite;
        }
      `}</style>

      {/* Giant scrolling backdrop */}
      {marqueePhrase && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center overflow-hidden select-none opacity-20"
        >
          <div className="flex w-max shrink-0 animate-cta69-marquee whitespace-nowrap text-white/10 font-black tracking-tight select-none">
            {[0, 1].map((copy) => (
              <span
                key={copy}
                className="text-[22vw] font-black leading-none tracking-tighter md:text-[16vw] text-slate-100/10 drop-shadow-sm select-none"
              >
                {marqueeLine}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Ambient glowing radial orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Centered statement */}
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 text-center md:px-6 z-10">
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-bold text-sm tracking-wide shadow-sm backdrop-blur-md">
            <span>✨</span>
            <Badge7 label={badge.label} tone="primary" className="text-amber-300 font-bold" />
            <span>🚀</span>
          </div>
        )}

        {heading && (
          <h2 className="mt-8 text-balance text-4xl font-black leading-[1.08] tracking-tight text-white md:text-6xl lg:text-7xl drop-shadow-md">
            {heading}
          </h2>
        )}

        {labels?.note && (
          <p className="mt-6 max-w-xl text-balance text-lg font-medium text-slate-300 md:text-xl leading-relaxed">
            {labels.note}
          </p>
        )}

        {button && (
          <div className="mt-10">
            <Button12 href={button.href} label={button.label} tone="primary" />
          </div>
        )}

        {labels?.footnote && (
          <p className="mt-8 text-sm sm:text-base font-semibold text-slate-400 tracking-wider">
            {labels.footnote}
          </p>
        )}
      </div>
    </section>
  );
}

export default Cta69;
