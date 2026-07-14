import { motion } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import {
  Gift,
  Sparkles,
  Heart,
  Star,
  Music,
  ChevronDown,
} from "lucide-react";

/* ─── Background Music (Web Audio API — no external files!) ─── */
function BackgroundMusic() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // "Happy Birthday" notes: [frequency, duration(seconds)]
  const melody = [
    [262, 0.3], [262, 0.3], [294, 0.6], [262, 0.6], [349, 0.6], [330, 0.9],
    [262, 0.3], [262, 0.3], [294, 0.6], [262, 0.6], [392, 0.6], [349, 0.9],
    [262, 0.3], [262, 0.3], [523, 0.6], [440, 0.6], [349, 0.6], [330, 0.6], [294, 0.9],
    [466, 0.3], [466, 0.3], [440, 0.6], [349, 0.6], [392, 0.6], [349, 0.9],
  ];

  const playMelody = useCallback((ctx: AudioContext) => {
    let time = ctx.currentTime + 0.1;
    melody.forEach(([freq, dur]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + dur - 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + dur);
      time += dur + 0.02;
    });
    // Schedule next loop after melody ends
    const totalDuration = time - ctx.currentTime;
    setTimeout(() => {
      if (ctxRef.current) playMelody(ctxRef.current);
    }, (totalDuration + 0.5) * 1000);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      ctxRef.current?.close();
      ctxRef.current = null;
      setIsPlaying(false);
    } else {
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      playMelody(ctx);
      setIsPlaying(true);
      setHasInteracted(true);
    }
  }, [isPlaying, playMelody]);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
    >
      <motion.button
        onClick={togglePlay}
        className={`relative flex items-center gap-2 px-4 py-3 rounded-full shadow-lg border transition-all duration-300 ${
          isPlaying
            ? "bg-amber-100 border-amber-300/60 text-amber-700"
            : "bg-white/90 border-stone-200/80 text-stone-500 hover:bg-amber-50 hover:border-amber-200/60"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying && (
          <span className="absolute inset-0 rounded-full animate-ping bg-amber-300/20" />
        )}
        <motion.span
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={
            isPlaying
              ? { duration: 3, repeat: Infinity, ease: "linear" }
              : {}
          }
        >
          <Music size={16} />
        </motion.span>
        <span className="font-hand-alt text-xs tracking-wide">
          {isPlaying ? "Now Playing" : "Play Music"}
        </span>
        {isPlaying && (
          <span className="flex gap-0.5 items-center ml-1">
            {[1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="w-0.5 bg-amber-500 rounded-full"
                style={{ height: "8px" }}
                animate={{
                  height: ["8px", "14px", "6px", "8px"],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </span>
        )}
      </motion.button>

      <motion.p
        className="absolute -top-7 right-0 text-[9px] text-stone-400 font-hand-alt whitespace-nowrap bg-white/80 px-2 py-0.5 rounded"
        initial={{ opacity: 0 }}
        animate={{ opacity: hasInteracted ? 1 : 0 }}
        transition={{ delay: 0.3 }}
      >
        {isPlaying ? "Happy Birthday tune 🎵" : "tap to play 🎵"}
      </motion.p>
    </motion.div>
  );
}

/* ─── Decorative stars ─── */
function FloatingStars() {
  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 4,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{ left: `${star.x}%`, top: `${star.y}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 3 + 1,
          }}
        >
          <Star
            size={star.size}
            className="text-amber-400/40 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]"
            fill="oklch(0.8 0.1 85 / 0.3)"
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Sticky Note Message ─── */
function StickyNote({
  text,
  emoji,
  rotate,
  top,
  right,
  left,
}: {
  text: string;
  emoji: string;
  rotate: string;
  top?: string;
  right?: string;
  left?: string;
}) {
  return (
    <motion.div
      className="sticky-note absolute hidden md:block px-4 py-3 rounded-sm max-w-[180px]"
      style={{ top, right, left, rotate }}
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.6, duration: 0.4 }}
    >
      <span className="text-lg">{emoji}</span>
      <p className="font-hand text-sm text-stone-700 mt-1 leading-tight">
        {text}
      </p>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function Landing() {
  return (
    <div className="paper-grain min-h-screen flex items-center justify-center p-4 sm:p-8 relative">
      <FloatingStars />
      <BackgroundMusic />

      {/* Notebook Paper Card */}
      <motion.div
        className="notebook-page w-full max-w-2xl mx-auto px-8 sm:px-12 py-10 sm:py-14 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Decorative corner fold */}
        <div className="absolute -top-[1px] -right-[1px] w-12 h-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[48px] border-r-[48px] border-t-amber-200/60 border-r-transparent" />
        </div>

        {/* Header date line */}
        <div className="flex justify-between items-center text-xs text-stone-400 border-b border-amber-200/40 pb-2 mb-6 font-hand-alt">
          <span className="tracking-wide">—— Birthday Edition ——</span>
          <span>July 16, 2026</span>
        </div>

        {/* Sticky Notes */}
        <StickyNote
          text="Don't forget to make a wish! 🕯️"
          emoji="⭐"
          rotate="-2deg"
          top="15%"
          right="-80px"
        />
        <StickyNote
          text="You're not getting older, you're leveling up! 🎮"
          emoji="🚀"
          rotate="3deg"
          top="45%"
          left="-80px"
        />
        <StickyNote
          text="Another year of being amazing! ✨"
          emoji="💫"
          rotate="-1.5deg"
          top="70%"
          right="-70px"
        />

        {/* ─── Hero Section ─── */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            className="flex justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <span className="text-amber-600/70 font-hand-alt text-xs tracking-wide uppercase bg-amber-100/70 px-4 py-1.5 rounded-full">
              🎉 Special Delivery 🎉
            </span>
          </motion.div>

          <motion.div
            className="text-6xl sm:text-7xl mb-3"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🎂
          </motion.div>

          <h1 className="font-hand text-4xl sm:text-5xl md:text-6xl text-stone-800 leading-tight">
            Happy Birthday!
          </h1>

          <motion.div
            className="mt-2 font-hand text-2xl sm:text-3xl text-amber-700/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <span className="annotation-underline">Happy Birthday Reo! ❤️</span>
          </motion.div>

          <motion.p
            className="mt-4 text-stone-500 text-sm max-w-md mx-auto leading-relaxed font-hand-alt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Wishing you a day filled with joy, peace, and blessing. May this new year of life
            bring you closer to everything that matters most.
          </motion.p>
        </motion.div>

        {/* ─── Decorative Divider ─── */}
        <motion.div
          className="flex items-center justify-center gap-3 my-6 text-amber-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="h-px w-12 bg-amber-200/60" />
          <Sparkles size={16} className="shrink-0" />
          <span className="h-px w-12 bg-amber-200/60" />
        </motion.div>

        {/* ─── Bible Verse ─── */}
        <motion.div
          className="text-center bg-amber-50/60 rounded-lg py-6 px-6 border border-amber-200/40"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="font-hand text-lg text-stone-600 leading-relaxed">
            "The Lord bless you <br />
            and keep you; <br />
            the Lord make his face shine on you <br />
            and be gracious to you; <br />
            the Lord turn his face toward you <br />
            and give you peace."
          </p>
          <p className="text-xs text-stone-400 mt-3 font-hand-alt">— Numbers 6:24-26</p>
        </motion.div>

        {/* ─── Qualities / Wishes Grid ─── */}
        <motion.div
          className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {[
            { icon: <Heart size={22} />, label: "Blessed", color: "text-pink-400" },
            { icon: <Gift size={22} />, label: "Loved", color: "text-emerald-400" },
            { icon: <Star size={22} />, label: "Appreciated", color: "text-amber-400" },
            { icon: <Sparkles size={22} />, label: "Adored", color: "text-pink-500" },
          ].map((trait, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-2 py-3 rounded-lg bg-white/40 hover:bg-white/70 transition-all duration-200 cursor-default"
              whileHover={{ y: -4, scale: 1.05 }}
            >
              <span className={trait.color}>{trait.icon}</span>
              <span className="font-hand text-sm text-stone-600">{trait.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── Footer ─── */}
        <motion.div
          className="mt-10 pt-4 border-t border-amber-200/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="font-hand-alt">
            Made with{" "}
            <Heart
              size={10}
              className="inline text-pink-400 -mt-0.5"
              fill="oklch(0.7 0.15 0 / 0.5)"
            />{" "}
            just for you, Reo ❤️
          </span>
          <span className="font-hand-alt flex items-center gap-1">
            <Heart size={10} className="text-pink-400" fill="oklch(0.7 0.15 0 / 0.5)" />
            with love, Shamma
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
