import React from 'react';
import { motion } from 'motion/react';
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
        <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm font-medium text-ink-light hover:text-earth-accent transition-colors tracking-wide uppercase">
          {item}
        </a>
      ))}
    </div>

    <a
      href="http://localhost:5000"
      className="bg-moss text-paper rounded-none px-7 py-3 flex items-center gap-2 text-sm font-medium hover:bg-moss-light transition-colors group"
    >
      Launch App
      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
    </a>
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

          <FadeIn delay={0.3} className="flex flex-col sm:flex-row items-start gap-8">
            <a
              href="http://localhost:5000"
              className="bg-ink-base text-paper px-10 py-5 rounded-none font-medium tracking-wide hover:bg-ink-light transition-all group flex items-center gap-3 text-lg"
            >
              Launch Prediction Engine
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </FadeIn>
        </div>

        {/* Cinematic Imagery Column - Instead of Parallax Background, a beautifully composed image grid/overlap */}
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
    // Replaced black section with warm earthy clay
    <section id="the-crisis" className="py-32 px-6 lg:px-12 bg-clay-bg text-ink-base border-y border-ink-base/5">
      <div className="max-w-[1600px] mx-auto">
        <div className="max-w-4xl mb-24">
          <FadeIn>
            <span className="text-earth-accent font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
              The Reality
            </span>
            <h2 className="font-heading italic text-5xl md:text-8xl mb-8">A crisis of abundance.</h2>
            <p className="text-2xl text-ink-light leading-relaxed font-light">
              We grow enough food to feed the entire world, but logistics, over-preparation, and poor forecasting cause massive inefficiencies.
              <span className="text-moss font-medium"> The restaurant and catering industry alone is responsible for a staggering portion of this loss.</span>
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-ink-base/10 pt-16 mt-8">
          {stats.map((stat, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2 mb-6">
                  {/* Replaced red with earthy amber/clay for numbers */}
                  <span className="font-heading text-7xl md:text-[130px] leading-none text-earth-accent tracking-tighter">{stat.number}</span>
                  <span className="text-xl font-medium text-ink-light uppercase tracking-widest">{stat.unit}</span>
                </div>
                <p className="text-ink-base text-lg leading-relaxed max-w-xs">{stat.desc}</p>
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
    { icon: Droplets, title: "45 Trillion Gallons of water", desc: "Used globally to produce food that is ultimately thrown away. That's enough to meet the domestic water needs of 9 billion people." },
    { icon: Tractor, title: "28% of Agriculture Land", desc: "An area larger than China is used every year to grow food that is never eaten. This drives massive, unnecessary deforestation and habitat loss." },
    { icon: Flame, title: "A Wasted Energy Matrix", desc: "From fertilization to harvesting, cooling, transport, and cooking—every calorie of wasted food represents a staggering loss of fossil fuels and human labor." }
  ];

  return (
    <section id="ripple-effect" className="py-32 px-6 lg:px-12 bg-paper">
      <div className="max-w-[1600px] mx-auto">
        <FadeIn className="mb-20 text-center">
          <Leaf className="w-8 h-8 text-moss mx-auto mb-6" />
          <h2 className="font-heading italic text-5xl md:text-7xl text-ink-base mb-6">The Ripple Effect</h2>
          <p className="text-xl text-ink-light max-w-3xl mx-auto leading-relaxed">
            When we throw away a meal, we aren't just wasting the final product. We are discarding the land, water, labor, and transport emissions required to create it.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
          {ripples.map((ripple, i) => (
            <FadeIn key={i} delay={i * 0.15} yOffset={20}>
              <div className="bg-card p-10 h-full border-t-4 border-t-moss/20 hover:border-t-moss transition-colors group">
                <div className="mb-8">
                  <ripple.icon className="w-10 h-10 text-earth-accent/70" />
                </div>
                <h3 className="font-heading italic text-3xl mb-4 text-ink-base">{ripple.title}</h3>
                <p className="text-ink-light leading-relaxed">{ripple.desc}</p>
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
      <div className="relative h-[650px] w-full overflow-hidden journal-shadow group p-4 bg-paper">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.8, ease: CUSTOM_EASE }}
          className="w-full h-full"
        >
          <img
            src="https://images.unsplash.com/photo-1595858022692-04e8d8906bd3?q=80&w=2000&auto=format&fit=crop"
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
          <h2 className="font-heading italic text-6xl md:text-7xl mb-10 text-balance">Data-driven preparation.</h2>

          <div className="space-y-8">
            <p className="text-xl text-ink-light leading-relaxed">
              PrepNova Intelligence uses machine learning algorithms—like Random Forests and Gradient Boosting—to analyze historical sales data, weather patterns, and local events.
            </p>
            <p className="text-xl text-ink-light leading-relaxed">
              We give your kitchen highly accurate, day-by-day preparation targets. By acting entirely as a predictive layer, kitchen managers can seamlessly integrate our insights into their daily routine.
            </p>
            <p className="text-xl text-ink-base font-medium leading-relaxed pt-4 border-l-2 border-earth-accent pl-6">
              Stop guessing. Start knowing. Save thousands of dollars and prevent hundreds of kilograms of CO2 emissions.
            </p>
          </div>

          <div className="mt-14">
            <a
              href="http://localhost:5000"
              className="inline-flex items-center gap-3 bg-moss text-paper px-10 py-5 rounded-none font-medium hover:bg-moss-light transition-colors group text-lg"
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
  <section className="py-32 px-6 lg:px-12 bg-paper text-ink-base text-center border-t border-ink-base/5">
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      <Globe2 className="w-16 h-16 text-earth-accent/30 mb-8" />
      <FadeIn>
        <span className="text-earth-accent font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
          Our Collective Goal
        </span>
        <h2 className="font-heading italic text-6xl md:text-8xl mb-8">Join the movement.</h2>
        <p className="text-2xl text-ink-light leading-relaxed font-light mb-12">
          Through awareness and technology, our goal is simple: <strong className="text-moss">1 Million Meals Saved by 2027.</strong> Every kitchen that integrates intelligent forecasting brings us one step closer to a sustainable food ecosystem.
        </p>
        <a
          href="http://localhost:5000"
          className="inline-flex items-center gap-3 bg-ink-base text-paper px-12 py-6 rounded-none font-bold uppercase tracking-widest hover:bg-earth-accent transition-colors text-sm"
        >
          Start Optimizing Now
        </a>
      </FadeIn>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-ink-base text-paper pt-32 pb-12 px-6 lg:px-12">
    <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12">

      <div>
        <h2 className="font-heading italic text-6xl md:text-7xl mb-8 max-w-md text-balance text-paper">
          Respect the harvest.<br /><span className="text-earth-accent">Save the planet.</span>
        </h2>
        <div className="flex items-center gap-2 mb-12">
          <Leaf className="w-6 h-6 text-earth-accent" />
          <span className="font-medium tracking-[0.2em] uppercase text-sm text-paper">PrepNova</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-5">
          <h4 className="text-xs uppercase tracking-[0.2em] text-paper/40 font-bold mb-4">Platform</h4>
          <a href="http://localhost:5000" className="text-paper/70 hover:text-white transition-colors text-sm flex items-center gap-2">
            Launch Application <ExternalLink className="w-3 h-3" />
          </a>
          <a href="http://localhost:5000/analytics" className="text-paper/70 hover:text-white transition-colors text-sm flex items-center gap-2">
            View Analytics <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="flex flex-col gap-5">
          <h4 className="text-xs uppercase tracking-[0.2em] text-paper/40 font-bold mb-4">Journal & About</h4>
          {['Our Mission', 'The Science', 'Get in Touch'].map(link => (
            <a key={link} href="#" className="text-paper/70 hover:text-white transition-colors text-sm">{link}</a>
          ))}
        </div>
      </div>

    </div>

    <div className="max-w-[1600px] mx-auto mt-32 pt-10 border-t border-paper/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-paper/40">
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
