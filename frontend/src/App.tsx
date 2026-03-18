import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  Play,
  ChevronDown,
  Utensils,
  BarChart3,
  Calendar,
  CloudSun,
  TrendingUp,
  AlertCircle,
  Activity,
  Users,
  Clock,
  CheckCircle2,
  Cpu
} from 'lucide-react';

// --- Global Styles Injection ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&display=swap');

  :root {
    --font-heading: 'Instrument Serif', serif;
    --font-body: 'Barlow', sans-serif;
  }

  body {
    background-color: #02040A;
    color: white;
    font-family: var(--font-body);
    overflow-x: hidden;
  }

  ::selection {
    background-color: rgba(255, 255, 255, 0.3);
    color: white;
  }

  .font-heading { font-family: var(--font-heading); }
  .font-body { font-family: var(--font-body); }

  @layer components {
    .liquid-glass {
      background: rgba(255, 255, 255, 0.015);
      background-blend-mode: luminosity;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: none;
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 4px 24px rgba(0, 0, 0, 0.2);
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .liquid-glass::before {
      content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
      background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.05) 80%, rgba(255,255,255,0.2) 100%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
    }
    .liquid-glass-strong {
      background: rgba(255, 255, 255, 0.02);
      background-blend-mode: luminosity;
      backdrop-filter: blur(50px);
      -webkit-backdrop-filter: blur(50px);
      border: none;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2);
      position: relative; overflow: hidden;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .liquid-glass-strong::before {
      content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1.2px;
      background: linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.4) 100%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
    }
  }
`;

const CUSTOM_EASE = [0.16, 1, 0.3, 1];

const BlurText = ({ text, className, as: Component = "div" }: any) => {
  const words = text.split(" ");
  return (
    <Component className={className}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.04 } }
        }}
        className="inline-block"
      >
        {words.map((word: string, i: number) => (
          <motion.span
            key={i}
            className="inline-block mr-[0.25em]"
            variants={{
              hidden: { filter: 'blur(12px)', opacity: 0, y: 40 },
              visible: {
                filter: 'blur(0px)',
                opacity: 1,
                y: 0,
                transition: { ease: CUSTOM_EASE, duration: 0.8 }
              }
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
};

const FadeIn = ({ children, className, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 1, ease: CUSTOM_EASE, delay }}
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
    className="fixed top-6 left-0 right-0 px-6 lg:px-12 z-50 flex justify-between items-center pointer-events-none"
  >
    <div className="liquid-glass rounded-full p-3 pointer-events-auto cursor-pointer hover:bg-white/5 transition-colors flex items-center gap-2 px-6">
      <Utensils className="w-5 h-5 text-white" />
      <span className="font-heading italic text-xl tracking-wide">PrepNova</span>
    </div>

    <div className="hidden md:flex liquid-glass rounded-full px-8 py-3 items-center gap-8 pointer-events-auto">
      {['Home', 'Prediction Tool', 'Analytics', 'About'].map((item) => (
        <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm font-medium text-white/70 hover:text-white transition-colors tracking-wide">
          {item}
        </a>
      ))}
    </div>

    <button className="bg-white text-black rounded-full px-6 py-3 flex items-center gap-2 font-medium hover:bg-white/90 transition-colors pointer-events-auto group">
      Start Prediction
      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  </motion.nav>
);

const Hero = () => {
  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: CUSTOM_EASE }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          className="w-full h-full object-cover opacity-40"
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
          alt="Data Analytics Background"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#02040A]/60 to-[#02040A]" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto mt-20">
        <FadeIn delay={0.1}>
          <div className="liquid-glass rounded-full px-4 py-1.5 mb-8 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.25em] text-white/80 font-medium">AI-Powered Forecasting</span>
          </div>
        </FadeIn>

        <BlurText
          as="h1"
          text="Smart Food Demand Prediction"
          className="font-heading italic text-6xl md:text-8xl lg:text-9xl text-balance tracking-tight leading-[0.9] mb-8"
        />

        <FadeIn delay={0.4}>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl text-balance leading-relaxed mb-12">
            Predict daily meal demand and reduce food waste using advanced AI. Make better meal preparation decisions with precision.
          </p>
        </FadeIn>

        <FadeIn delay={0.6} className="flex flex-col sm:flex-row items-center gap-6">
          <a href="#prediction-tool" className="liquid-glass-strong px-8 py-4 rounded-full font-medium tracking-wide hover:bg-white/10 transition-colors w-full sm:w-auto text-center">
            Start Prediction
          </a>
          <button className="flex items-center gap-3 px-8 py-4 rounded-full font-medium text-white/80 hover:text-white transition-colors group w-full sm:w-auto justify-center">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 transition-colors">
              <Play className="w-4 h-4 ml-0.5" />
            </div>
            See How It Works
          </button>
        </FadeIn>
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
    <section id="prediction-tool" className="py-32 px-6 lg:px-12 relative max-w-[1600px] mx-auto">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start relative z-10">

        {/* Input Form */}
        <div>
          <FadeIn>
            <h2 className="font-heading italic text-5xl md:text-6xl tracking-tight mb-4">Daily Context</h2>
            <p className="text-white/60 mb-12 text-lg">Input today's operational data to generate an accurate demand forecast.</p>
          </FadeIn>

          <FadeIn delay={0.2} className="liquid-glass p-8 md:p-10 rounded-3xl">
            <form onSubmit={handlePredict} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-white/60">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input type="date" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white/30 transition-colors" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-white/60">Day of Week</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none" required>
                    <option value="" className="bg-[#02040A]">Select Day</option>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <option key={day} value={day} className="bg-[#02040A]">{day}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-white/60">Weather</label>
                  <div className="relative">
                    <CloudSun className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none" required>
                      <option value="" className="bg-[#02040A]">Select Weather</option>
                      <option value="sunny" className="bg-[#02040A]">Sunny / Clear</option>
                      <option value="rainy" className="bg-[#02040A]">Rainy</option>
                      <option value="cloudy" className="bg-[#02040A]">Cloudy</option>
                      <option value="snow" className="bg-[#02040A]">Snow</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-white/60">Special Event</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none" required>
                    <option value="none" className="bg-[#02040A]">None</option>
                    <option value="holiday" className="bg-[#02040A]">Public Holiday</option>
                    <option value="local" className="bg-[#02040A]">Local Event / Festival</option>
                    <option value="promotion" className="bg-[#02040A]">Store Promotion</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-white/60">Expected Customers (Est.)</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input type="number" placeholder="e.g. 500" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-white/60">Prev. Day Demand</label>
                  <input type="number" placeholder="Meals sold yesterday" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-white/60">Prev. Week Demand</label>
                  <input type="number" placeholder="Meals sold last week" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors" required />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPredicting}
                className="w-full bg-white text-black rounded-xl py-4 font-medium hover:bg-white/90 transition-colors mt-4 flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {isPredicting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Generating Prediction...
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5" />
                    Predict Meals
                  </>
                )}
              </button>
            </form>
          </FadeIn>
        </div>

        {/* Results Section */}
        <div className="h-full flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!showResults && !isPredicting && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="liquid-glass rounded-[2.5rem] h-[500px] flex flex-col items-center justify-center text-center p-10 border border-white/5"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <BarChart3 className="w-10 h-10 text-white/20" />
                </div>
                <h3 className="font-heading italic text-3xl mb-2 text-white/40">Awaiting Data</h3>
                <p className="text-white/30 max-w-xs">Fill out the operational context form to generate your daily demand prediction.</p>
              </motion.div>
            )}

            {isPredicting && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="liquid-glass-strong rounded-[2.5rem] h-[500px] flex flex-col items-center justify-center text-center p-10 border border-blue-500/20"
              >
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-t-2 border-blue-400 rounded-full animate-spin" style={{ animationDuration: '1s' }} />
                  <div className="absolute inset-2 border-r-2 border-indigo-400 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                  <div className="absolute inset-4 border-b-2 border-white/50 rounded-full animate-spin" style={{ animationDuration: '2s' }} />
                  <Cpu className="absolute inset-0 m-auto w-6 h-6 text-blue-400 animate-pulse" />
                </div>
                <h3 className="font-heading italic text-3xl mb-2 text-white">Analyzing Patterns</h3>
                <p className="text-white/60 max-w-xs">Running neural networks against historical data and current context...</p>
              </motion.div>
            )}

            {showResults && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="liquid-glass-strong rounded-[2.5rem] p-10 border border-emerald-500/20 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="flex items-center gap-2 mb-8">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs uppercase tracking-[0.2em] text-emerald-400/80 font-medium">Prediction Complete</span>
                </div>

                <div className="mb-10">
                  <p className="text-white/60 text-sm uppercase tracking-[0.1em] mb-2">Recommended Meals to Prepare</p>
                  <div className="flex items-baseline gap-4">
                    <h3 className="font-heading italic text-7xl md:text-8xl tracking-tight text-white">420</h3>
                    <span className="text-xl text-white/40 font-medium">meals</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-xs uppercase tracking-[0.1em] text-white/60">Confidence</span>
                    </div>
                    <p className="text-2xl font-medium text-white">High (94%)</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs uppercase tracking-[0.1em] text-white/60">Comparison</span>
                    </div>
                    <p className="text-2xl font-medium text-emerald-400">+10% <span className="text-sm text-white/40">vs avg</span></p>
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 relative z-10">
                  <p className="text-sm text-emerald-100/80 leading-relaxed">
                    <strong>Insight:</strong> The sunny weather combined with the local event is driving a 10% expected increase over standard weekday demand. Prepare extra prep-heavy ingredients early.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

const AnalyticsDashboard = () => {
  const charts = [
    { title: "Meals by Weekday", desc: "Average demand distribution", span: "md:col-span-2", icon: Calendar },
    { title: "Demand Trend", desc: "30-day historical volume", span: "md:col-span-1", icon: TrendingUp },
    { title: "Weather Impact", desc: "Sales correlation by condition", span: "md:col-span-1", icon: CloudSun },
    { title: "Event Lift", desc: "Volume increase during events", span: "md:col-span-2", icon: Activity }
  ];

  return (
    <section id="analytics" className="py-32 px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <FadeIn>
          <h2 className="font-heading italic text-5xl md:text-7xl tracking-tight">Demand Analytics</h2>
          <p className="text-white/60 mt-4 text-lg max-w-xl">Visualize historical patterns to better understand the factors driving your daily food demand.</p>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {charts.map((chart, i) => (
          <FadeIn key={i} delay={i * 0.1} className={`liquid-glass p-8 rounded-3xl flex flex-col ${chart.span} min-h-[300px]`}>
            <div className="flex items-center gap-3 mb-2">
              <chart.icon className="w-5 h-5 text-white/50" />
              <h3 className="text-xl font-medium tracking-wide">{chart.title}</h3>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-8">{chart.desc}</p>

            {/* Placeholder for actual charts */}
            <div className="flex-grow flex items-center justify-center border border-white/5 border-dashed rounded-xl bg-white/[0.02]">
              <span className="text-white/20 text-sm font-medium tracking-widest uppercase">Chart Visualization</span>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="border-t border-white/10 pt-24 pb-12 px-6 lg:px-12 max-w-[1600px] mx-auto mt-20">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 lg:gap-12">

      <div className="lg:col-span-2">
        <div className="flex items-center gap-3 mb-8">
          <div className="liquid-glass rounded-full p-2">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <span className="font-medium tracking-[0.2em] uppercase text-sm">PrepNova</span>
        </div>

        <h2 className="font-heading italic text-5xl md:text-6xl tracking-tight mb-10 max-w-md text-balance">
          Optimize your kitchen.
        </h2>

        <div className="liquid-glass rounded-full p-2 flex max-w-md">
          <input
            type="email"
            placeholder="Enter email for updates"
            className="bg-transparent border-none outline-none px-6 w-full text-white placeholder:text-white/40 font-body"
          />
          <button className="bg-white text-black rounded-full px-6 py-3 font-medium hover:bg-white/90 transition-colors whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium mb-2">Platform</h4>
        {['Prediction Tool', 'Analytics Dashboard', 'Data Export', 'API Access'].map(link => (
          <a key={link} href="#" className="text-white/70 hover:text-white transition-colors w-fit">{link}</a>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium mb-2">Company</h4>
        {['About Us', 'Case Studies', 'Pricing', 'Contact'].map(link => (
          <a key={link} href="#" className="text-white/70 hover:text-white transition-colors w-fit">{link}</a>
        ))}
      </div>

    </div>

    <div className="mt-32 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/50">
      <p>&copy; 2026 PrepNova Analytics. All rights reserved.</p>

      <div className="flex gap-6">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <main className="min-h-screen selection:bg-white/30 selection:text-white">
        <Navbar />
        <Hero />
        <PredictionInterface />
        <AnalyticsDashboard />
        <Footer />
      </main>
    </>
  );
}

