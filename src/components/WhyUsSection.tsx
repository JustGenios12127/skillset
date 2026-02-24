import { useInView } from "@/hooks/useInView";
import { Layers, Award, BookOpen, Zap, Cpu } from "lucide-react";

const items = [
  { icon: Layers, title: "Полный цикл услуг", desc: "Все необходимые услуги в одном месте — от аудита до обслуживания" },
  { icon: Award, title: "Опытная команда", desc: "Сертифицированные эксперты с многолетним опытом работы" },
  { icon: BookOpen, title: "Работаем по стандартам", desc: "Полное соответствие нормативным требованиям РК" },
  { icon: Zap, title: "Быстрое выполнение", desc: "Оперативная работа и соблюдение сроков" },
  { icon: Cpu, title: "Современные решения", desc: "Применяем актуальные технологии и методики" },
];

const WhyUsSection = () => {
  const { ref, inView } = useInView();

  return (
    <section className="section-padding bg-muted/50">
      <div className="container-narrow" ref={ref}>
        <div className={`text-center mb-16 ${inView ? "animate-fade-up" : "opacity-0"}`}>
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Преимущества</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Почему выбирают нас</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {items.map((item, i) => {
            const colClass =
              i < 3
                ? "lg:col-span-2"
                : i === 3
                ? "lg:col-span-2 lg:col-start-2"
                : "lg:col-span-2";

            return (
              <div
                key={item.title}
                className={`bg-card rounded-xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 ${colClass} ${inView ? `animate-fade-up-delay-${Math.min(i, 3)}` : "opacity-0"}`}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
