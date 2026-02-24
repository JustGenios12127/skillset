import { useInView } from "@/hooks/useInView";
import { Shield, Users, MapPin, ClipboardCheck } from "lucide-react";

const advantages = [
  { icon: Shield, title: "Комплексный подход", desc: "Полный спектр услуг в одном месте" },
  { icon: Users, title: "Экспертная команда", desc: "Сертифицированные специалисты" },
  { icon: MapPin, title: "По всему Казахстану", desc: "Работаем в любом регионе" },
  { icon: ClipboardCheck, title: "Помогаем пройти проверки", desc: "Подготовка к инспекциям" },
];

const AboutSection = () => {
  const { ref, inView } = useInView();

  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-narrow" ref={ref}>
        <div className={`text-center max-w-3xl mx-auto mb-16 ${inView ? "animate-fade-up" : "opacity-0"}`}>
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">О компании</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Скилс Сет</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            ТОО «Скилс Сет» — надёжный партнёр в сфере пожарной безопасности и охраны труда. 
            Мы предоставляем полный цикл услуг: от аудита и обучения до технического обслуживания 
            и разработки документации. Наша цель — обеспечить безопасность вашего бизнеса.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((item, i) => (
            <div
              key={item.title}
              className={`bg-card rounded-xl p-6 shadow-card text-center hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 ${inView ? `animate-fade-up-delay-${Math.min(i, 3)}` : "opacity-0"}`}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
