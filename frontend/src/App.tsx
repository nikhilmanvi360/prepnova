import React, { useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  ArrowRight,
  Leaf,
  Calendar,
  CloudSun,
  Activity,
  Users,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BarChart3,
  ExternalLink
} from 'lucide-react';

const CUSTOM_EASE = [0.25, 1, 0.5, 1];

const FadeIn = ({ children, className, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
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
      <Leaf className="w-5 h-5 text-forest group-hover:text-forest-light transition-colors" />
      <span className="font-heading italic text-2xl tracking-wide text-espresso">PrepNova</span>
    </div>

    <div className="hidden md:flex items-center gap-10">
      {['Mission', 'The Problem', 'Impact'].map((item) => (
        <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm font-medium text-espresso/60 hover:text-terracotta transition-colors tracking-wide uppercase">
          {item}
        </a>
      ))}
    </div>

    <a
      href="http://localhost:5000"
      className="bg-espresso text-alabaster rounded-full px-7 py-3 flex items-center gap-2 text-sm font-medium hover:bg-espresso/80 transition-colors subtle-shadow group"
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

  // Parallax effect: moves the image down slightly as user scrolls down
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  // Optional scale effect for subtle cinematic feel
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={containerRef} className="relative min-h-[95vh] w-full flex flex-col justify-center px-6 lg:px-12 pt-32 pb-20 overflow-hidden">

      {/* Background Parallax Image */}
      <motion.div
        className="absolute inset-0 w-full h-full z-0"
        style={{ y, scale }}
      >
        <div className="absolute inset-0 bg-alabaster/60 mix-blend-overlay z-10" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-alabaster to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2600&auto=format&fit=crop"
          alt="Fresh organic produce"
          className="w-full h-full object-cover opacity-80"
        />
      </motion.div>

      <div className="relative z-20 max-w-[1600px] mx-auto w-full flex flex-col items-center text-center mt-12">
        <FadeIn>
          <span className="inline-block text-terracotta font-medium tracking-[0.2em] uppercase text-xs mb-8 bg-alabaster/50 px-4 py-2 rounded-full border border-terracotta/20 backdrop-blur-sm">
            The True Cost of Inefficiency
          </span>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="font-heading italic text-7xl md:text-9xl text-espresso leading-[0.9] text-balance max-w-5xl mx-auto drop-shadow-sm">
            Nourish People.<br />Not Landfills.
          </h1>
        </FadeIn>

        <FadeIn delay={0.2} className="mt-10 mb-14">
          <p className="text-xl md:text-2xl text-espresso/80 leading-relaxed max-w-2xl text-balance">
            High-volume kitchens discard perfectly good meals every day. By harnessing precise demand forecasting, we can drastically reduce commercial food waste at the source.
          </p>
        </FadeIn>

        <FadeIn delay={0.3} className="flex flex-col sm:flex-row items-center gap-6">
          <a
            href="http://localhost:5000"
            className="bg-forest text-white px-10 py-5 rounded-full font-medium tracking-wide hover:bg-forest-light transition-all subtle-shadow group flex items-center gap-3 text-lg"
          >
            Launch Prediction Engine
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#mission" className="text-espresso font-medium border-b border-espresso/20 pb-1 hover:border-espresso transition-colors text-lg">
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
    { number: "8%", unit: "GHG", desc: "Of all global greenhouse gas emissions come from food waste." },
    { number: "$1T", unit: "Lost", desc: "The annual economic value of food wasted globally." }
  ];

  return (
    <section id="mission" className="py-32 px-6 lg:px-12 bg-espresso text-alabaster">
      <div className="max-w-[1600px] mx-auto">
        <div className="max-w-3xl mb-24">
          <FadeIn>
            <h2 className="font-heading italic text-5xl md:text-7xl mb-6">A crisis of abundance.</h2>
            <p className="text-xl text-alabaster/70 leading-relaxed font-light">
              We grow enough food to feed the world, but logistics, over-preparation, and poor forecasting cause massive inefficiencies. The restaurant and catering industry alone is responsible for a staggering portion of this loss.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-alabaster/10 pt-16">
          {stats.map((stat, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div className="flex flex-col border-l border-terracotta/30 pl-8">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-heading text-6xl md:text-8xl text-terracotta">{stat.number}</span>
                  <span className="text-xl font-medium text-alabaster/50 uppercase tracking-widest">{stat.unit}</span>
                </div>
                <p className="text-alabaster/80 text-lg leading-relaxed max-w-xs">{stat.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const StorySection = () => (
  <section id="impact" className="py-32 px-6 lg:px-12 bg-sand text-espresso">
    <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div className="relative h-[700px] w-full rounded-[2rem] overflow-hidden subtle-shadow">
        <img
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2600&auto=format&fit=crop"
          alt="Chef in kitchen throwing away food"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent" />
        <div className="absolute bottom-10 left-10 right-10">
          <p className="text-alabaster font-heading italic text-3xl">"Predicting demand isn't just about saving money. It's about respecting the resources that went into growing our food."</p>
        </div>
      </div>
      <div className="max-w-xl">
        <FadeIn>
          <span className="text-forest font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
            The Solution
          </span>
          <h2 className="font-heading italic text-5xl md:text-7xl mb-8">Data-driven preparation.</h2>
          <p className="text-xl text-espresso/80 leading-relaxed mb-8">
            PrepNova Intelligence uses machine learning algorithms—like Random Forests and Gradient Boosting—to analyze historical sales data, weather patterns, and local events to give your kitchen highly accurate preparation targets.
          </p>
          <p className="text-xl text-espresso/80 leading-relaxed mb-12">
            By acting entirely as a predictive layer, kitchen managers can seamlessly integrate our insights into their daily routine, saving thousands of dollars and preventing hundreds of kilograms of CO2 emissions.
          </p>
          <a
            href="http://localhost:5000"
            className="inline-flex items-center gap-3 bg-terracotta text-white px-8 py-4 rounded-full font-medium hover:bg-terracotta/90 transition-colors group subtle-shadow"
          >
            Launch the Tool Now
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </FadeIn>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-espresso text-alabaster pt-24 pb-12 px-6 lg:px-12">
    <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12">

      <div>
        <h2 className="font-heading italic text-5xl md:text-6xl mb-8 max-w-md text-balance">
          Optimize your kitchen. Save the planet.
        </h2>
        <div className="flex items-center gap-2 mb-12">
          <Leaf className="w-5 h-5 text-terracotta" />
          <span className="font-medium tracking-[0.2em] uppercase text-sm text-terracotta">PrepNova</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-4">Platform</h4>
          <a href="http://localhost:5000" className="text-alabaster/70 hover:text-white transition-colors text-sm flex items-center gap-2">
            Launch Application <ExternalLink className="w-3 h-3" />
          </a>
          <a href="http://localhost:5000/analytics" className="text-alabaster/70 hover:text-white transition-colors text-sm flex items-center gap-2">
            View Analytics <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-[0.2em] text-alabaster/40 font-bold mb-4">Company</h4>
          {['Our Mission', 'Case Studies', 'Contact'].map(link => (
            <a key={link} href="#" className="text-alabaster/70 hover:text-white transition-colors text-sm">{link}</a>
          ))}
        </div>
      </div>

    </div>

    <div className="max-w-[1600px] mx-auto mt-32 pt-8 border-t border-alabaster/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-alabaster/40">
      <p>&copy; 2026 PrepNova Analytics.</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <main className="min-h-screen bg-alabaster text-espresso font-body">
      <Navbar />
      <Hero />
      <AwarenessSection />
      <StorySection />
      <Footer />
    </main>
  );
}
