import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Environment } from '@react-three/drei';
import * as THREE from 'three';
import {
  ArrowRight,
  Leaf,
  ExternalLink,
  Droplets,
  Tractor,
  Flame,
  Globe2,
  Database,
  Cpu,
  LineChart
} from 'lucide-react';

const CUSTOM_EASE = [0.25, 1, 0.5, 1];

const FadeIn = ({ children, className, delay = 0, yOffset = 30 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: yOffset }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 1.2, ease: CUSTOM_EASE, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

// High-end Premium Pill Button with sweeping hover animation
const PremiumButton = ({ href, children, icon: Icon, className = "", variant = "primary" }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    primary: {
      bgSweep: "bg-ink-base",
      textIdle: "text-ink-base",
      textHover: "text-paper",
      border: "border-ink-base/20 hover:border-ink-base"
    },
    accent: {
      bgSweep: "bg-moss",
      textIdle: "text-moss",
      textHover: "text-paper",
      border: "border-moss/30 hover:border-moss"
    },
    canvas: {
      bgSweep: "bg-paper",
      textIdle: "text-paper",
      textHover: "text-ink-base",
      border: "border-paper/30 hover:border-paper"
    }
  };

  const activeVariant = variants[variant as keyof typeof variants];

  return (
    <motion.a
      href={href}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden px-8 py-4 rounded-full font-medium tracking-wide transition-colors duration-300 flex items-center justify-center gap-3 text-lg border bg-transparent ${activeVariant.border} ${className}`}
    >
      {/* Sweeping background */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "0%" : "-100%" }}
        transition={{ duration: 0.4, ease: CUSTOM_EASE }}
        className={`absolute inset-0 w-full h-full ${activeVariant.bgSweep} origin-left`}
      />

      <span className={`relative z-10 transition-colors duration-300 ${isHovered ? activeVariant.textHover : activeVariant.textIdle}`}>
        {children}
      </span>
      {Icon && (
        <motion.div
          className={`relative z-10 transition-colors duration-300 ${isHovered ? activeVariant.textHover : activeVariant.textIdle}`}
          animate={{ x: isHovered ? 4 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      )}
    </motion.a>
  );
};

const Navbar = () => (
  <motion.nav
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 1, ease: CUSTOM_EASE, delay: 0.1 }}
    className="absolute top-0 left-0 right-0 px-6 lg:px-12 py-8 z-50 flex justify-between items-center"
  >
    <div className="flex items-center gap-2 cursor-pointer group">
      <Leaf className="w-5 h-5 text-moss group-hover:text-moss-light transition-colors" />
      <span className="font-heading italic text-2xl tracking-wide text-ink-base">PrepNova</span>
    </div>

    <div className="hidden md:flex items-center gap-10">
      {['The Crisis', 'Process', 'Solution'].map((item) => (
        <motion.a
          key={item}
          href={`#${item.toLowerCase().replace(' ', '-')}`}
          className="text-sm font-medium text-ink-light hover:text-earth-accent transition-colors tracking-wide uppercase relative group"
        >
          {item}
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-earth-accent transition-all duration-300 group-hover:w-full"></span>
        </motion.a>
      ))}
    </div>

    <PremiumButton href="http://localhost:5000" icon={ExternalLink} variant="accent" className="!py-2.5 !px-6 !text-sm">
      Launch App
    </PremiumButton>
  </motion.nav>
);

// --- 3D Nature Scene Components ---

const Terrain = () => {
  const geomRef = useRef<any>(null);

  useEffect(() => {
    if (geomRef.current) {
      const attrs = geomRef.current.attributes.position;
      // Procedural generation of gentle rolling hills
      for (let i = 0; i < attrs.count; i++) {
        const x = attrs.getX(i);
        const y = attrs.getY(i);
        const z = Math.sin(x * 0.4) * Math.cos(y * 0.4) * 1.5 + Math.sin(x * 0.1 + y * 0.2) * 2.5;
        attrs.setZ(i, z);
      }
      geomRef.current.computeVertexNormals();
    }
  }, []);

  const meshRef = useRef<any>(null);
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle, hypnotic rotation
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.03;
      // Subtle float
      meshRef.current.position.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.5 - 2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -3, -2]} rotation={[-Math.PI / 2.2, 0, 0]} receiveShadow castShadow>
      <planeGeometry ref={geomRef} args={[40, 40, 64, 64]} />
      <meshStandardMaterial
        color="#3F6212" // moss green
        roughness={0.9}
        metalness={0.05}
        flatShading={true} // gives it a slightly stylized, geometric look
      />
    </mesh>
  );
};

const NatureScene = () => {
  return (
    <Canvas camera={{ position: [0, 2, 10], fov: 45 }} shadows>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#FDE047" castShadow />
      <directionalLight position={[-10, 5, -5]} intensity={0.8} color="#92400E" />

      <Terrain />

      {/* Floating pollen / seeds */}
      <Sparkles count={300} scale={20} size={6} speed={0.4} opacity={0.6} color="#FDE047" position={[0, 4, 0]} />

      <Environment preset="sunset" />
    </Canvas>
  );
};

// --- End 3D Scene Components ---

const Hero = () => {
  return (
    <section className="relative min-h-[95vh] w-full flex flex-col justify-center px-6 lg:px-12 pt-32 pb-20 bg-paper">
      <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Typography / Story Column */}
        <div className="lg:col-span-6 z-20 xl:pr-12">
          <FadeIn>
            <span className="inline-block text-earth-accent font-medium tracking-[0.2em] uppercase text-xs mb-8 border-b border-earth-accent/30 pb-2">
              An Environmental Journal
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="font-heading italic text-7xl md:text-[110px] text-ink-base leading-[0.9] text-balance drop-shadow-sm">
              The earth provides.<br />We waste.
            </h1>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-12 mb-14">
            <p className="text-xl md:text-2xl text-ink-light leading-relaxed max-w-lg">
              High-volume kitchens discard perfectly good meals every single day. By harnessing precise demand forecasting, we can respect our harvests and reduce commercial waste at the source.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <PremiumButton href="http://localhost:5000" icon={ArrowRight} variant="primary">
              Launch Prediction Engine
            </PremiumButton>
          </FadeIn>
        </div>

        {/* Cinematic 3D Canvas Column */}
        <div className="lg:col-span-6 relative h-[600px] md:h-[800px] w-full mt-12 lg:mt-0 xl:-mr-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: CUSTOM_EASE }}
            className="absolute inset-0 z-10 scale-125 md:scale-150 pointer-events-auto cursor-grab active:cursor-grabbing"
          >
            <NatureScene />

            {/* Atmospheric foreground vignette array to blend canvas edges */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_-100px_100px_-50px_#FAFAF9]"></div>
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_100px_100px_-50px_#FAFAF9]"></div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

const AwarenessSection = () => {
  const stats = [
    { number: "1.3B", unit: "Tons", desc: "Of food produced globally is lost or wasted every single year." },
    { number: "8%", unit: "GHG", desc: "Of all global greenhouse gas emissions come from rotting food." },
    { number: "$1T", unit: "Loss", desc: "The staggering annual economic value of food wasted globally." }
  ];

  return (
    <section id="the-crisis" className="relative px-6 lg:px-12 bg-clay-bg text-ink-base border-y border-ink-base/5">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row relative">

        {/* Sticky Left Column */}
        <div className="lg:w-1/2 lg:sticky top-0 h-auto lg:h-screen flex flex-col justify-center py-20 lg:py-0 pr-8">
          <FadeIn>
            <span className="text-earth-accent font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
              The Reality
            </span>
            <h2 className="font-heading italic text-6xl md:text-8xl mb-8">A crisis of<br />abundance.</h2>
            <p className="text-2xl text-ink-light leading-relaxed font-light max-w-md">
              We grow enough food to feed the entire world, but logistics, over-preparation, and poor forecasting cause massive inefficiencies.
              <span className="text-moss font-medium"> The catering industry alone is responsible for a staggering portion of this loss.</span>
            </p>
          </FadeIn>
        </div>

        {/* Scrolling Right Column */}
        <div className="lg:w-1/2 flex flex-col pb-32">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-30%", once: false }}
              transition={{ duration: 0.8, ease: CUSTOM_EASE }}
              className="min-h-[50vh] flex flex-col justify-center border-b border-ink-base/10 last:border-b-0 py-20"
            >
              <div className="flex flex-col">
                <div className="flex items-baseline gap-4 mb-8">
                  <span className="font-heading text-8xl md:text-[160px] leading-none text-earth-accent tracking-tighter drop-shadow-sm">{stat.number}</span>
                  <span className="text-2xl md:text-3xl font-medium text-ink-light uppercase tracking-widest border-b-2 border-earth-accent/30 pb-2">{stat.unit}</span>
                </div>
                <p className="text-ink-base text-2xl md:text-3xl leading-relaxed max-w-lg font-light">{stat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

const RippleEffectSection = () => {
  const ripples = [
    { icon: Droplets, title: "45 Trillion Gallons of water", desc: "Used globally to produce food that is ultimately thrown away. That's enough to meet the domestic water needs of 9 billion people." },
    { icon: Tractor, title: "28% of Agriculture Land", desc: "An area larger than China is used every year to grow food that is never eaten. This drives massive, unnecessary deforestation and habitat loss." },
    { icon: Flame, title: "A Wasted Energy Matrix", desc: "From fertilization to harvesting, cooling, transport, and cooking—every calorie of wasted food represents a staggering loss of fossil fuels and human labor." }
  ];

  return (
    <section id="ripple-effect" className="py-32 px-6 lg:px-12 bg-paper">
      <div className="max-w-[1600px] mx-auto">
        <FadeIn className="mb-24 text-center">
          <Leaf className="w-8 h-8 text-moss mx-auto mb-6" />
          <h2 className="font-heading italic text-5xl md:text-7xl text-ink-base mb-6">The Ripple Effect</h2>
          <p className="text-xl text-ink-light max-w-3xl mx-auto leading-relaxed">
            When we throw away a meal, we aren't just wasting the final product. We are discarding the land, water, labor, and transport emissions required to create it.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
          {ripples.map((ripple, i) => (
            <FadeIn key={i} delay={i * 0.15} yOffset={20}>
              <div className="bg-card rounded-[2rem] p-12 h-full border border-ink-base/5 hover:border-moss/30 transition-all duration-500 group relative overflow-hidden">
                <ripple.icon className="absolute -bottom-10 -right-10 w-48 h-48 text-ink-base/[0.03] group-hover:scale-110 transition-transform duration-700" />

                <div className="mb-8 relative z-10">
                  <ripple.icon className="w-10 h-10 text-earth-accent border border-earth-accent/20 p-2 rounded-full box-content" />
                </div>
                <h3 className="font-heading italic text-4xl mb-6 text-ink-base relative z-10">{ripple.title}</h3>
                <p className="text-ink-light leading-relaxed text-lg relative z-10">{ripple.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// NEW SECTION 1: How it Works
const ProcessSection = () => {
  const steps = [
    { icon: Database, title: "Contextual Data Intake", desc: "We ingest massive amounts of historical sales logs alongside high-variance contextual markers—local weather shifts, major holidays, and expected foot traffic." },
    { icon: Cpu, title: "The Prediction Engine", desc: "Using an ensemble of Random Forests and Gradient Boosting models, PrepNova analyzes complex patterns invisible to human intuition." },
    { icon: LineChart, title: "Actionable Precision", desc: "We deliver exact, day-by-day preparation targets directly to your kitchen. Over-prep is eliminated; stockouts are prevented." }
  ];

  return (
    <section id="process" className="py-32 px-6 lg:px-12 bg-card text-ink-base border-t border-ink-base/5 relative overflow-hidden">
      {/* Decorative large bg text */}
      <div className="absolute top-0 right-0 max-w-5xl opacity-5 pointer-events-none select-none">
        <h1 className="font-heading italic text-[20vw] leading-[0.8] tracking-tighter text-right">Machine<br />Learning</h1>
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

          <div className="lg:col-span-5">
            <FadeIn>
              <span className="text-moss font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                The Intelligence Process
              </span>
              <h2 className="font-heading italic text-6xl md:text-7xl mb-8 text-balance text-ink-base">Data. Not<br />guesswork.</h2>
              <p className="text-xl text-ink-light leading-relaxed mb-12">
                Running a kitchen on intuition inherently creates waste. Our machine learning pipeline shifts operations from reactive guessing to proactive precision.
              </p>
              <PremiumButton href="http://localhost:5000" icon={ArrowRight} variant="primary">
                Launch the Intelligence Tool
              </PremiumButton>
            </FadeIn>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-12">
            {steps.map((step, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="flex gap-8 group">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border border-ink-base/20 flex items-center justify-center bg-ink-base/5 text-earth-accent group-hover:bg-earth-accent group-hover:text-paper group-hover:border-earth-accent transition-all duration-300">
                      <step.icon className="w-6 h-6" />
                    </div>
                    {i !== steps.length - 1 && (
                      <div className="w-[1px] h-full bg-ink-base/10 mt-4 group-hover:bg-earth-accent/30 transition-colors"></div>
                    )}
                  </div>
                  <div className="pb-12 pt-2">
                    <span className="text-ink-base/40 font-mono text-sm block mb-2">0{i + 1}</span>
                    <h3 className="font-heading italic text-4xl mb-4 text-ink-base">{step.title}</h3>
                    <p className="text-ink-light leading-relaxed text-lg">{step.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

// NEW SECTION 2: Impact Showcase
const StorySection = () => (
  <section id="solution" className="py-32 px-6 lg:px-12 bg-clay-bg text-ink-base border-t border-ink-base/5">
    <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
      <div className="relative h-[700px] w-full overflow-hidden journal-shadow group p-4 bg-paper hidden md:block">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.8, ease: CUSTOM_EASE }}
          className="w-full h-full"
        >
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2600&auto=format&fit=crop"
            alt="Chef in kitchen throwing away food"
            className="w-full h-full object-cover sepia-[15%]"
          />
        </motion.div>
      </div>
      <div className="max-w-xl">
        <FadeIn>
          <span className="text-moss font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
            The Solution
          </span>
          <h2 className="font-heading italic text-6xl md:text-7xl mb-10 text-balance leading-[0.9]">Data-driven preparation.</h2>

          <div className="space-y-8">
            <p className="text-xl text-ink-light leading-relaxed">
              PrepNova Intelligence uses machine learning algorithms—like Random Forests and Gradient Boosting—to analyze historical sales data, weather patterns, and local events.
            </p>
            <p className="text-xl text-ink-light leading-relaxed">
              We give your kitchen highly accurate, day-by-day preparation targets. By acting entirely as a predictive layer, kitchen managers can seamlessly integrate our insights.
            </p>
            <div className="bg-paper p-8 border-l-4 border-earth-accent journal-shadow mt-8">
              <p className="text-xl text-ink-base font-medium leading-relaxed italic">
                "Stop guessing. Start knowing. Save thousands of dollars and prevent hundreds of kilograms of CO2 emissions."
              </p>
            </div>
          </div>

          <div className="mt-14">
            <PremiumButton href="http://localhost:5000" icon={ArrowRight} variant="primary">
              Launch the Intelligence Tool
            </PremiumButton>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

const ImpactQuoteSection = () => (
  <section className="py-40 px-6 lg:px-12 bg-clay-bg text-ink-base border-t border-ink-base/5 border-b">
    <div className="max-w-[1200px] mx-auto text-center">
      <FadeIn>
        <span className="text-earth-accent font-bold tracking-[0.2em] uppercase text-xs mb-10 block">
          Impact Showcase
        </span>
        <h2 className="font-heading italic text-6xl md:text-8xl leading-[1.1] mb-12 text-balance">
          "By trusting the data over our gut feelings, we reduced our daily food waste by 40% in just three weeks."
        </h2>
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden grayscale border border-ink-base/20">
            <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=200&auto=format&fit=crop" alt="Chef avatar" className="w-full h-full object-cover" />
          </div>
          <div className="text-left">
            <p className="font-bold text-ink-base tracking-wide uppercase text-sm">Marcus V.</p>
            <p className="text-ink-light text-sm italic">Executive Chef, Metro Catering</p>
          </div>
        </div>
      </FadeIn>
    </div>
  </section>
);


const MovementSection = () => (
  <section className="py-40 px-6 lg:px-12 bg-paper text-ink-base text-center relative overflow-hidden">
    <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <Globe2 className="w-20 h-20 text-earth-accent/20 mb-10" />
      </motion.div>
      <FadeIn>
        <span className="text-earth-accent font-bold tracking-[0.2em] uppercase text-xs mb-6 block border-b border-earth-accent/20 pb-2 inline-block">
          Our Collective Goal
        </span>
        <h2 className="font-heading italic text-7xl md:text-9xl mb-10">Join the movement.</h2>
        <p className="text-2xl md:text-3xl text-ink-light leading-relaxed font-light mb-16">
          Through awareness and technology, our goal is simple: <strong className="text-moss font-medium">1 Million Meals Saved by 2027.</strong>
        </p>
        <PremiumButton href="http://localhost:5000" icon={ArrowRight} variant="primary" className="mx-auto !text-xl px-12 py-5">
          Start Optimizing Now
        </PremiumButton>
      </FadeIn>
    </div>
  </section>
);

// Grand Footer Enhancement
const Footer = () => (
  <footer className="bg-ink-base text-paper pt-32 pb-6 px-6 lg:px-12 overflow-hidden flex flex-col justify-between min-h-[70vh]">
    <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 pl-4 md:pl-0">

      <div className="lg:col-span-5">
        <h2 className="font-heading italic text-5xl md:text-6xl mb-12 max-w-sm text-balance text-paper leading-[1.1]">
          Respect the harvest. <br /><span className="text-earth-accent">Save the planet.</span>
        </h2>
        <div className="flex gap-8 text-sm text-paper/40 font-medium">
          <a href="#" className="hover:text-white transition-colors relative group">
            Privacy Policy
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#" className="hover:text-white transition-colors relative group">
            Terms of Service
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>
      </div>

      <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 border-t md:border-t-0 border-paper/10 pt-12 md:pt-0">
        <div className="flex flex-col gap-6">
          <h4 className="text-xs uppercase tracking-[0.2em] text-paper/30 font-bold mb-4">Platform</h4>
          <a href="http://localhost:5000" className="text-paper/80 hover:text-earth-accent transition-colors flex items-center gap-2 group text-lg">
            Launch Application <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </a>
          <a href="http://localhost:5000/analytics" className="text-paper/80 hover:text-earth-accent transition-colors flex items-center gap-2 group text-lg">
            View Analytics <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </a>
        </div>
        <div className="flex flex-col gap-6">
          <h4 className="text-xs uppercase tracking-[0.2em] text-paper/30 font-bold mb-4">Journal</h4>
          {['Our Mission', 'The Science', 'Get in Touch'].map(link => (
            <a key={link} href="#" className="text-paper/80 hover:text-earth-accent transition-colors text-lg">{link}</a>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          <h4 className="text-xs uppercase tracking-[0.2em] text-paper/30 font-bold mb-4">Contact</h4>
          <p className="text-paper/80 text-lg">hello@prepnova.com</p>
          <p className="text-paper/80 text-lg">Press & Media</p>
        </div>
      </div>
    </div>

    {/* Massive Typographic Anchor */}
    <div className="w-full mt-auto pt-32 relative overflow-hidden flex items-end justify-center">
      <motion.p
        initial={{ y: "100%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, margin: "100px" }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-[17vw] leading-[0.75] font-heading font-bold text-center text-paper/5 tracking-tighter w-full select-none"
      >
        PREPNOVA
      </motion.p>
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-paper/30 font-medium tracking-widest uppercase selection:bg-transparent">
        &copy; {new Date().getFullYear()} PREPNOVA INTELLIGENCE
      </div>
    </div>

  </footer>
);

export default function App() {
  return (
    <main className="min-h-screen bg-paper text-ink-base font-body selection:bg-moss-light selection:text-white">
      <Navbar />
      <Hero />
      <AwarenessSection />
      <RippleEffectSection />
      <ProcessSection />
      <StorySection />
      <ImpactQuoteSection />
      <MovementSection />
      <Footer />
    </main>
  );
}
