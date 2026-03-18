import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  ArrowRight,
  Leaf,
  ExternalLink,
  Droplets,
  Tractor,
  Flame,
  Globe2
} from 'lucide-react';

const CUSTOM_EASE = [0.25, 1, 0.5, 1];

const FadeIn = ({ children, className, delay = 0, yOffset = 40 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: yOffset }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1.2, ease: CUSTOM_EASE, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const Navbar = () => (
  <motion.nav
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 1, ease: CUSTOM_EASE, delay: 0.2 }}
    className="absolute top-0 left-0 right-0 px-6 lg:px-12 py-8 z-50 flex justify-between items-center"
  >
    <div className="flex items-center gap-2 cursor-pointer group">
      <Leaf className="w-5 h-5 text-emerald-primary group-hover:text-emerald-light transition-colors" />
      <span className="font-heading italic text-2xl tracking-wide text-slate-base">PrepNova</span>
    </div>

    <div className="hidden md:flex items-center gap-10 glass-card px-8 py-3 rounded-full">
      {['The Crisis', 'Ripple Effect', 'Solution'].map((item) => (
        <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm font-medium text-slate-light hover:text-emerald-primary transition-colors tracking-wide uppercase">
          {item}
        </a>
      ))}
    </div>

    <a
      href="http://localhost:5000"
      className="bg-slate-base text-canvas rounded-full px-7 py-3 flex items-center gap-2 text-sm font-medium hover:bg-slate-light transition-colors subtle-shadow group"
    >
      Launch App
      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
    </a>
  </motion.nav>
);

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <section ref={containerRef} className="relative min-h-screen w-full flex flex-col justify-center px-6 lg:px-12 pt-32 pb-20 overflow-hidden bg-canvas">

      {/* Background Parallax Image */}
      <motion.div
        className="absolute inset-0 w-full h-full z-0"
        style={{ y, opacity }}
      >
        <div className="absolute inset-0 bg-canvas/30 mix-blend-overlay z-10" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-canvas to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2600&auto=format&fit=crop"
          alt="Fresh organic produce"
          className="w-full h-full object-cover opacity-60 grayscale-[20%]"
        />
      </motion.div>

      <div className="relative z-20 max-w-[1600px] mx-auto w-full flex flex-col items-center text-center mt-12">
        <FadeIn>
          <span className="inline-block text-emerald-primary font-medium tracking-[0.2em] uppercase text-xs mb-8 rounded-full border border-emerald-primary/30 px-5 py-2 glass-card">
            The True Cost of Inefficiency
          </span>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="font-heading italic text-7xl md:text-9xl text-slate-base leading-[0.9] text-balance max-w-5xl mx-auto drop-shadow-sm">
            Nourish People.<br />Not Landfills.
          </h1>
        </FadeIn>

        <FadeIn delay={0.2} className="mt-10 mb-14">
          <p className="text-xl md:text-2xl text-slate-light leading-relaxed max-w-2xl text-balance">
            High-volume kitchens discard perfectly good meals every day. By harnessing precise demand forecasting, we drastically reduce commercial food waste at the source.
          </p>
        </FadeIn>

        <FadeIn delay={0.3} className="flex flex-col sm:flex-row items-center gap-6">
          <a
            href="http://localhost:5000"
            className="bg-emerald-primary text-white px-10 py-5 rounded-full font-medium tracking-wide hover:bg-emerald-light transition-all subtle-shadow group flex items-center gap-3 text-lg"
          >
            Launch Prediction Engine
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#the-crisis" className="text-slate-base font-medium border-b border-slate-base/20 pb-1 hover:border-slate-base transition-colors text-lg">
            Understand the Impact
          </a>
        </FadeIn>
      </div>
    </section>
  );
};

const AwarenessSection = () => {
  const stats = [
    { number: "1.3B", unit: "Tons", desc: "Of food produced globally is lost or wasted every single year." },
    { number: "8%", unit: "GHG", desc: "Of all global greenhouse gas emissions come from rotting food." },
    { number: "$1T", unit: "Lost", desc: "The staggering annual economic value of food wasted globally." }
  ];

  return (
    <section id="the-crisis" className="py-32 px-6 lg:px-12 bg-slate-base text-canvas">
      <div className="max-w-[1600px] mx-auto">
        <div className="max-w-4xl mb-24">
          <FadeIn>
            <h2 className="font-heading italic text-5xl md:text-8xl mb-8">A crisis of abundance.</h2>
            <p className="text-2xl text-canvas/70 leading-relaxed font-light">
              We grow enough food to feed the world, but logistics, over-preparation, and poor forecasting cause massive inefficiencies.
              <span className="text-rose-urgency font-medium"> The restaurant and catering industry alone is responsible for a staggering portion of this loss.</span>
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-canvas/10 pt-16">
          {stats.map((stat, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="font-heading text-7xl md:text-[140px] leading-none text-rose-urgency tracking-tighter">{stat.number}</span>
                  <span className="text-xl font-medium text-canvas/40 uppercase tracking-widest">{stat.unit}</span>
                </div>
                <p className="text-canvas/80 text-lg leading-relaxed max-w-xs">{stat.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const RippleEffectSection = () => {
  const ripples = [
    { icon: Droplets, title: "45 Trillion Gallons", desc: "Of fresh water are used globally to produce food that is ultimately thrown away. That's enough to meet the domestic water needs of 9 billion people." },
    { icon: Tractor, title: "28% of Agriculture Land", desc: "An area larger than China is used every year to grow food that is never eaten. This drives massive, unnecessary deforestation and habitat loss." },
    { icon: Flame, title: "Wasted Energy Matrix", desc: "From fertilization to harvesting, cooling, transport, and cooking—every calorie of wasted food represents a staggering loss of fossil fuels and human labor." }
  ];

  return (
    <section id="ripple-effect" className="py-32 px-6 lg:px-12 bg-slate-surface">
      <div className="max-w-[1600px] mx-auto">
        <FadeIn className="mb-20">
          <span className="text-emerald-primary font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
            The Hidden Cost
          </span>
          <h2 className="font-heading italic text-5xl md:text-7xl text-slate-base mb-6 max-w-2xl">The Ripple Effect</h2>
          <p className="text-xl text-slate-light max-w-2xl leading-relaxed">
            When we throw away a meal, we aren't just wasting the final product. We are discarding the land, water, labor, and transport emissions required to create it.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ripples.map((ripple, i) => (
            <FadeIn key={i} delay={i * 0.15} yOffset={20}>
              <div className="bg-canvas p-10 rounded-[2rem] subtle-shadow h-full border border-slate-base/5 hover:border-emerald-primary/30 transition-colors group">
                <div className="w-14 h-14 rounded-full bg-emerald-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <ripple.icon className="w-6 h-6 text-emerald-primary" />
                </div>
                <h3 className="font-heading italic text-4xl mb-4 text-slate-base line-clamp-2">{ripple.title}</h3>
                <p className="text-slate-light leading-relaxed">{ripple.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const StorySection = () => (
  <section id="solution" className="py-32 px-6 lg:px-12 bg-canvas text-slate-base">
    <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
      <div className="relative h-[700px] w-full rounded-[2rem] overflow-hidden subtle-shadow group">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8, ease: CUSTOM_EASE }}
          className="w-full h-full"
        >
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2600&auto=format&fit=crop"
            alt="Chef in kitchen throwing away food"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-base/90 via-slate-base/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-12 left-10 right-10">
          <p className="text-canvas font-heading italic text-4xl leading-tight">"Predicting demand isn't just about saving money. It's about respecting the resources that went into growing our food."</p>
        </div>
      </div>
      <div className="max-w-xl">
        <FadeIn>
          <span className="text-emerald-primary font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
            The Solution
          </span>
          <h2 className="font-heading italic text-6xl md:text-7xl mb-10 text-balance">Data-driven preparation.</h2>

          <div className="space-y-8 border-l-2 border-slate-surface pl-8">
            <p className="text-xl text-slate-light leading-relaxed">
              PrepNova Intelligence uses machine learning algorithms—like Random Forests and Gradient Boosting—to analyze historical sales data, weather patterns, and local events.
            </p>
            <p className="text-xl text-slate-light leading-relaxed">
              We give your kitchen highly accurate, day-by-day preparation targets. By acting entirely as a predictive layer, kitchen managers can seamlessly integrate our insights into their daily routine.
            </p>
            <p className="text-xl text-slate-base font-medium leading-relaxed pt-4">
              Stop guessing. Start knowing. Save thousands of dollars and prevent hundreds of kilograms of CO2 emissions.
            </p>
          </div>

          <div className="mt-14">
            <a
              href="http://localhost:5000"
              className="inline-flex items-center gap-3 bg-slate-base text-canvas px-10 py-5 rounded-full font-medium hover:bg-slate-light transition-colors group subtle-shadow text-lg"
            >
              Launch the Intelligence Tool
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

const MovementSection = () => (
  <section className="py-32 px-6 lg:px-12 bg-emerald-primary text-canvas text-center relative overflow-hidden">
    <div className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2600')] opacity-5 bg-cover bg-center mix-blend-overlay pointer-events-none" />

    <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
      <Globe2 className="w-16 h-16 text-canvas/50 mb-8" />
      <FadeIn>
        <h2 className="font-heading italic text-6xl md:text-8xl mb-8">Join the movement.</h2>
        <p className="text-2xl text-canvas/80 leading-relaxed font-light mb-12">
          Our goal is simple: <strong>1 Million Meals Saved by 2027.</strong> Every kitchen that integrates intelligent forecasting brings us one step closer to a sustainable food ecosystem.
        </p>
        <a
          href="http://localhost:5000"
          className="inline-flex items-center gap-3 bg-canvas text-emerald-primary px-12 py-6 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform subtle-shadow text-sm"
        >
          Start Optimizing Now
        </a>
      </FadeIn>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-slate-base text-canvas pt-32 pb-12 px-6 lg:px-12">
    <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12">

      <div>
        <h2 className="font-heading italic text-6xl md:text-7xl mb-8 max-w-md text-balance">
          Optimize your kitchen.<br /><span className="text-emerald-primary">Save the planet.</span>
        </h2>
        <div className="flex items-center gap-2 mb-12">
          <Leaf className="w-6 h-6 text-emerald-primary" />
          <span className="font-medium tracking-[0.2em] uppercase text-sm text-canvas">PrepNova</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-5">
          <h4 className="text-xs uppercase tracking-[0.2em] text-canvas/40 font-bold mb-4">Platform</h4>
          <a href="http://localhost:5000" className="text-canvas/70 hover:text-white transition-colors text-sm flex items-center gap-2">
            Launch Application <ExternalLink className="w-3 h-3" />
          </a>
          <a href="http://localhost:5000/analytics" className="text-canvas/70 hover:text-white transition-colors text-sm flex items-center gap-2">
            View Analytics <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="flex flex-col gap-5">
          <h4 className="text-xs uppercase tracking-[0.2em] text-canvas/40 font-bold mb-4">Company</h4>
          {['Our Mission', 'The Science', 'Get in Touch'].map(link => (
            <a key={link} href="#" className="text-canvas/70 hover:text-white transition-colors text-sm">{link}</a>
          ))}
        </div>
      </div>

    </div>

    <div className="max-w-[1600px] mx-auto mt-32 pt-10 border-t border-canvas/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-canvas/40">
      <p>&copy; 2026 PrepNova Intelligence. All rights reserved.</p>
      <div className="flex gap-8">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <main className="min-h-screen bg-canvas text-slate-base font-body selection:bg-emerald-primary selection:text-white">
      <Navbar />
      <Hero />
      <AwarenessSection />
      <RippleEffectSection />
      <StorySection />
      <MovementSection />
      <Footer />
    </main>
  );
}
