import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  BarChart3
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
      {['Mission', 'Prediction', 'Analytics'].map((item) => (
        <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-espresso/60 hover:text-terracotta transition-colors tracking-wide uppercase">
          {item}
        </a>
      ))}
    </div>

    <button className="bg-espresso text-alabaster rounded-full px-7 py-3 flex items-center gap-2 text-sm font-medium hover:bg-espresso/80 transition-colors">
      Start Optimizing
      <ArrowRight className="w-4 h-4" />
    </button>
  </motion.nav>
);

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] w-full flex flex-col justify-center px-6 lg:px-12 pt-32 pb-20">
      <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Text Content */}
        <div className="max-w-xl z-10">
          <FadeIn>
            <span className="inline-block text-terracotta font-medium tracking-[0.2em] uppercase text-xs mb-6">
              The True Cost of Inefficiency
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="font-heading italic text-6xl md:text-8xl text-espresso leading-[0.95] mb-8 text-balance">
              Nourish People.<br />Not Landfills.
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-espresso/70 leading-relaxed mb-12 max-w-lg">
              Every day, high-volume kitchens discard perfectly good meals. By harnessing precise demand forecasting, we can drastically reduce commercial food waste at the source.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} className="flex items-center gap-6">
            <a href="#prediction" className="bg-terracotta text-white px-8 py-4 rounded-full font-medium tracking-wide hover:bg-terracotta/90 transition-colors subtle-shadow">
              Forecast Demand
            </a>
            <a href="#mission" className="text-espresso font-medium border-b border-espresso/20 pb-1 hover:border-espresso transition-colors">
              Read the Facts
            </a>
          </FadeIn>
        </div>

        {/* Image / Visual */}
        <div className="relative h-[600px] w-full rounded-[2rem] overflow-hidden subtle-shadow">
          <motion.div
            initial={{ scale: 1.1, filter: 'blur(10px)' }}
            animate={{ scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.8, ease: CUSTOM_EASE }}
            className="w-full h-full"
          >
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2600&auto=format&fit=crop"
              alt="Fresh, organic farm ingredients"
              className="w-full h-full object-cover"
            />
            {/* Soft overlay to blend */}
            <div className="absolute inset-0 bg-espresso/10 mix-blend-multiply" />
          </motion.div>
        </div>

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

const PredictionInterface = () => {
  const [isPredicting, setIsPredicting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    setShowResults(false);
    setTimeout(() => {
      setIsPredicting(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <section id="prediction" className="py-32 px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">

        {/* Form Column */}
        <div className="xl:col-span-5">
          <FadeIn>
            <span className="text-forest font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
              Operational Context
            </span>
            <h2 className="font-heading italic text-5xl md:text-6xl text-espresso mb-6">Precision Forecasting</h2>
            <p className="text-espresso/60 text-lg mb-12 pb-12 border-b border-espresso/10">
              Input today's variables to generate an optimized meal preparation plan. By aligning prep with actual demand, we stop waste before it happens.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <form onSubmit={handlePredict} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-semibold uppercase tracking-[0.15em] text-espresso/50">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso/40" />
                    <input type="date" className="w-full bg-sand border border-espresso/5 rounded-xl py-4 pl-12 pr-4 text-espresso focus:outline-none focus:border-forest/30 transition-colors" required />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-semibold uppercase tracking-[0.15em] text-espresso/50">Weather</label>
                  <div className="relative">
                    <CloudSun className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso/40" />
                    <select className="w-full bg-sand border border-espresso/5 rounded-xl py-4 pl-12 pr-4 text-espresso focus:outline-none focus:border-forest/30 transition-colors appearance-none" required>
                      <option value="">Select condition</option>
                      <option value="sunny">Sunny / Clear</option>
                      <option value="rainy">Rainy</option>
                      <option value="cloudy">Cloudy</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-espresso/50">Local Events</label>
                <select className="w-full bg-sand border border-espresso/5 rounded-xl py-4 px-4 text-espresso focus:outline-none focus:border-forest/30 transition-colors appearance-none" required>
                  <option value="none">Standard Day (None)</option>
                  <option value="holiday">Public Holiday</option>
                  <option value="festival">City Festival</option>
                </select>
              </div>

              <div className="flex flex-col gap-3 pb-8 border-b border-espresso/10">
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-espresso/50">Initial Estimate (Customers)</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso/40" />
                  <input type="number" placeholder="Your baseline expectation (e.g. 350)" className="w-full bg-sand border border-espresso/5 rounded-xl py-4 pl-12 pr-4 text-espresso focus:outline-none focus:border-forest/30 transition-colors placeholder:text-espresso/30" required />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPredicting}
                className="w-full bg-forest text-alabaster rounded-xl py-5 font-medium tracking-wide hover:bg-forest-light transition-colors mt-8 flex justify-center items-center gap-3 disabled:opacity-50 subtle-shadow"
              >
                {isPredicting ? 'Analyzing dataset...' : 'Generate Optimized Plan'}
                {!isPredicting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </FadeIn>
        </div>

        {/* Results Column */}
        <div className="xl:col-span-7 h-full flex flex-col justify-center">
          <div className="bg-sand rounded-[2rem] p-8 md:p-16 h-full min-h-[600px] flex flex-col justify-center border border-espresso/5 subtle-shadow">
            <AnimatePresence mode="wait">

              {!showResults && !isPredicting && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center max-w-sm mx-auto"
                >
                  <div className="w-16 h-16 rounded-full bg-espresso/5 flex items-center justify-center mx-auto mb-6">
                    <Leaf className="w-8 h-8 text-espresso/20" />
                  </div>
                  <h3 className="font-heading italic text-3xl mb-4 text-espresso/40">Awaiting Context</h3>
                  <p className="text-espresso/40">Provide todays parameters to generate a scientifically backed preparation volume.</p>
                </motion.div>
              )}

              {isPredicting && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col justify-center max-w-xs mx-auto"
                >
                  <div className="flex flex-col gap-6">
                    <motion.div
                      className="h-px bg-terracotta w-full origin-left"
                      animate={{ scaleX: [0, 1, 0], x: ["0%", "0%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <h3 className="font-heading italic text-3xl text-espresso text-center">Evaluating...</h3>
                    <p className="text-espresso/50 text-center text-sm uppercase tracking-widest animate-pulse">Running Random Forest Matrix</p>
                  </div>
                </motion.div>
              )}

              {showResults && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: CUSTOM_EASE }}
                  className="flex flex-col h-full"
                >
                  <div className="flex items-center gap-2 mb-12 pb-6 border-b border-espresso/10">
                    <CheckCircle2 className="w-5 h-5 text-forest" />
                    <span className="text-xs uppercase tracking-[0.2em] text-forest font-bold">Analysis Complete</span>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-espresso/50 text-sm uppercase tracking-[0.2em] mb-4 font-semibold">Optimal Prep Volume</p>
                    <div className="flex items-baseline gap-4 mb-4">
                      <h3 className="font-heading italic text-7xl md:text-9xl text-espresso">420</h3>
                      <span className="text-2xl text-espresso/40 font-medium">meals</span>
                    </div>
                    <p className="text-terracotta font-medium mb-12">-10% from baseline estimate (Saving 40 meals from waste)</p>

                    <div className="grid grid-cols-2 gap-8 border-t border-espresso/10 pt-8">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-espresso/40" />
                          <span className="text-xs uppercase tracking-[0.1em] text-espresso/40 font-semibold">Model Confidence</span>
                        </div>
                        <p className="text-2xl font-medium text-espresso">94% <span className="text-sm text-espresso/40 inline-block ml-1">High</span></p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-espresso/40" />
                          <span className="text-xs uppercase tracking-[0.1em] text-espresso/40 font-semibold">Primary Driver</span>
                        </div>
                        <p className="text-lg font-medium text-espresso py-1">Weather (Rainy) dampens foot traffic.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
};

const AnalyticsPlaceholder = () => (
  <section id="analytics" className="py-24 px-6 lg:px-12 max-w-[1600px] mx-auto border-t border-espresso/10">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
      <FadeIn>
        <h2 className="font-heading italic text-4xl md:text-6xl text-espresso">Historical Impact</h2>
        <p className="text-espresso/60 mt-4 text-lg max-w-xl">
          Visualizing the long-term effect of optimized preparation. By analyzing past cycles, we continuously refine future predictions.
        </p>
      </FadeIn>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <FadeIn key={i} delay={i * 0.15} className="bg-alabaster border border-espresso/10 p-8 rounded-2xl h-64 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-espresso/40" />
            </div>
            <span className="text-xs uppercase text-espresso/30 font-bold tracking-widest">Chart {i}</span>
          </div>
          <div className="mt-auto">
            <div className="h-2 w-full bg-sand rounded-full mb-3 overflow-hidden">
              <div className="h-full bg-forest opacity-20" style={{ width: `${60 + (i * 10)}%` }} />
            </div>
            <div className="h-2 w-3/4 bg-sand rounded-full" />
          </div>
        </FadeIn>
      ))}
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
          {['Prediction Engine', 'Analytics Dashboard', 'API Access'].map(link => (
            <a key={link} href="#" className="text-alabaster/70 hover:text-white transition-colors text-sm">{link}</a>
          ))}
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
      <PredictionInterface />
      <AnalyticsPlaceholder />
      <Footer />
    </main>
  );
}
