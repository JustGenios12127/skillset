import { useInView } from "@/hooks/useInView";

const steps = [
  { num: "01", title: "Заявка", desc: "Оставьте заявку на сайте или позвоните нам" },
  { num: "02", title: "Анализ задачи", desc: "Изучаем ваш объект и определяем объём работ" },
  { num: "03", title: "Подготовка решения", desc: "Разрабатываем оптимальный план действий" },
  { num: "04", title: "Выполнение работ", desc: "Реализуем проект в согласованные сроки" },
  { num: "05", title: "Передача результата", desc: "Передаём полный пакет документов" },
];

const ProcessSection = () => {
  const { ref, inView } = useInView();

  return (
    <section className="section-padding bg-background">
      <div className="container-narrow" ref={ref}>
        <div className={`text-center mb-16 ${inView ? "animate-fade-up" : "opacity-0"}`}>
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Как мы работаем</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Процесс работы</h2>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-border" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`relative text-center ${inView ? `animate-fade-up-delay-${Math.min(i, 3)}` : "opacity-0"}`}
              >
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-lg font-bold relative z-10">
                  {step.num}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
