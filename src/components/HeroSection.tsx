import { useEffect, useRef } from "react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) el.classList.add("animate-fade-up");
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-primary/80" />
      <div className="relative z-10 container-narrow text-center px-4" ref={ref}>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight max-w-4xl mx-auto mb-6">
          Комплексные решения в области пожарной безопасности и охраны труда
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
          Аудиты, обучение, техническое обслуживание и документация для бизнеса по всему Казахстану
        </p>
        <a
          href="#contact"
          className="inline-flex items-center px-8 py-4 rounded-lg bg-card text-primary font-semibold text-lg shadow-elevated hover:shadow-soft transition-all duration-300 hover:-translate-y-0.5"
        >
          Получить консультацию
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
