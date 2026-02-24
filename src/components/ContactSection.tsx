import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const ContactSection = () => {
  const { ref, inView } = useInView();
  const [form, setForm] = useState({ name: "", phone: "", company: "", comment: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Заявка отправлена! Мы свяжемся с вами в ближайшее время.");
    setForm({ name: "", phone: "", company: "", comment: "" });
  };

  return (
    <section id="contact" className="section-padding bg-primary">
      <div className="container-narrow" ref={ref}>
        <div className={`text-center mb-16 ${inView ? "animate-fade-up" : "opacity-0"}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Получите консультацию специалиста
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto">
            Оставьте заявку и мы свяжемся с вами в ближайшее время
          </p>
        </div>
        <div className={`grid md:grid-cols-2 gap-12 ${inView ? "animate-fade-up-delay-1" : "opacity-0"}`}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { key: "name" as const, label: "Имя", type: "text", placeholder: "Ваше имя" },
              { key: "phone" as const, label: "Телефон", type: "tel", placeholder: "+7 (___) ___-__-__" },
              { key: "company" as const, label: "Компания", type: "text", placeholder: "Название компании" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-primary-foreground/80 mb-2">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  required={f.key !== "company"}
                  className="w-full px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30 transition"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-primary-foreground/80 mb-2">Комментарий</label>
              <textarea
                placeholder="Опишите вашу задачу"
                rows={4}
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30 transition resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-lg bg-card text-primary font-semibold text-lg hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5"
            >
              Отправить заявку
            </button>
          </form>

          <div className="space-y-8 flex flex-col justify-center">
            {[
              { icon: Phone, label: "Телефон", value: "8 705 270 70 70", href: "tel:+77052707070" },
              { icon: Mail, label: "Email", value: "skillsset@bk.ru", href: "mailto:skillsset@bk.ru" },
              { icon: MapPin, label: "Адрес", value: "г. Алматы, ул. Джандарбекова, 109/76", href: "#" },
              { icon: MessageCircle, label: "WhatsApp", value: "Написать в WhatsApp", href: "https://wa.me/77052707070" },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="flex items-start gap-4 group"
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center shrink-0 group-hover:bg-primary-foreground/20 transition">
                  <c.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground/60">{c.label}</p>
                  <p className="text-primary-foreground font-medium">{c.value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
