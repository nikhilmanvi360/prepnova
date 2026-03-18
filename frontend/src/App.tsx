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

// High-end Shadcn-inspired animated button
const InteractiveButton = ({ href, children, icon: Icon, className = "", variant = "primary" }: any) => {
  const baseClasses = "relative overflow-hidden px-10 py-5 rounded-none font-medium tracking-wide transition-all group flex items-center justify-center gap-3 text-lg cursor-pointer";
  const variants = {
    primary: "bg-ink-base text-paper hover:bg-ink-light",
    accent: "bg-moss text-paper hover:bg-moss-light",
    ghost: "bg-transparent text-ink-base border border-ink-base/20 hover:border-ink-base"
  };

  return (
    <motion.a
      href={href}
      className={`${baseClasses} ${variants[variant as keyof typeof variants]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10">{children}</span>
      {Icon && (
        <motion.div
          className="relative z-10"
          initial={{ x: 0 }}
          whileHover={{ x: 4 }}
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
      {['The Crisis', 'Ripple Effect', 'Solution'].map((item) => (
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

    <InteractiveButton href="http://localhost:5000" icon={ExternalLink} variant="accent" className="!py-3 !px-7 !text-sm">
      Launch App
    </InteractiveButton>
  </motion.nav>
);

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
            <InteractiveButton href="http://localhost:5000" icon={ArrowRight} variant="primary">
              Launch Prediction Engine
            </InteractiveButton>
          </FadeIn>
        </div>

        {/* Cinematic Imagery Column */}
        <div className="lg:col-span-6 relative h-[600px] md:h-[750px] w-full mt-12 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: CUSTOM_EASE }}
            className="absolute top-0 right-0 w-[80%] h-[70%] z-10"
          >
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2600&auto=format&fit=crop"
              alt="Vast farmland"
              className="w-full h-full object-cover rounded-none journal-shadow sepia-[10%]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 1.2, ease: CUSTOM_EASE, delay: 0.4 }}
            className="absolute bottom-0 left-0 w-[60%] h-[50%] z-20 border-8 border-paper"
          >
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2600&auto=format&fit=crop"
              alt="Fresh harvest"
              className="w-full h-full object-cover sepia-[20%]"
            />
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
    // Redesigned to Sticky Scroll Layout
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
              <div className="bg-card p-12 h-full border-t-4 border-t-moss/20 hover:border-t-moss transition-all duration-500 group relative overflow-hidden">
                {/* Subtle background icon */}
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
            <InteractiveButton href="http://localhost:5000" icon={ArrowRight} variant="primary">
              Launch the Intelligence Tool
            </InteractiveButton>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

const MovementSection = () => (
  <section className="py-40 px-6 lg:px-12 bg-paper text-ink-base text-center border-t border-ink-base/5 relative overflow-hidden">
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
        <InteractiveButton href="http://localhost:5000" icon={ArrowRight} variant="accent" className="mx-auto !text-xl !py-6 !px-12">
          Start Optimizing Now
        </InteractiveButton>
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
      <StorySection />
      <MovementSection />
      <Footer />
    </main>
  );
}
