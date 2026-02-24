import { useInView } from "@/hooks/useInView";
import { useState } from "react";
import {
  Search, FileText, Lightbulb, Flame, GraduationCap,
  Settings, Map, ShieldCheck, FlaskConical, Paintbrush,
  Image, BookOpen, Tag, LayoutGrid, ChevronDown, ChevronUp
} from "lucide-react";

interface ServiceItem {
  name: string;
  price: string;
}

interface ServiceCategory {
  icon: React.ElementType;
  title: string;
  description?: string;
  services: ServiceItem[];
}

const categories: ServiceCategory[] = [
  {
    icon: Search,
    title: "Аудит и экспертиза",
    description: "Профессиональная оценка соответствия требованиям безопасности",
    services: [
      { name: "Аудит по пожарной безопасности (на основании аттестата аккредитации)", price: "по договоренности" },
      { name: "Аудит по безопасности и охране труда", price: "по договоренности" },
      { name: "Экспертиза объекта по пожарной безопасности", price: "по договоренности" },
      { name: "Оценка соответствия требованиям законодательства РК (ПБ, ОТ, АТЗ)", price: "по договоренности" },
      { name: "Определение степени огнестойкости и класса конструкционной пожарной опасности", price: "от 300 000 ₸" },
      { name: "Оценка степени рисков по условиям труда", price: "12 000 ₸" },
    ],
  },
  {
    icon: Lightbulb,
    title: "Проектирование и консалтинг",
    description: "Разработка документации и технических решений",
    services: [
      { name: "Проектная деятельность 3 категории (на основании лицензии)", price: "по договоренности" },
      { name: "Разработка комплекса организационно-технических мероприятий", price: "от 250 000 ₸" },
      { name: "Разработка специальных технических условий (СТУ)", price: "от 800 000 ₸" },
      { name: "Разработка раздела мероприятий по обеспечению пожарной безопасности", price: "от 500 000 ₸" },
      { name: "Консультация эксперта по пожарной безопасности", price: "от 20 000 ₸" },
      { name: "Расчет времени для эвакуации людей при пожаре", price: "от 50 000 ₸" },
      { name: "Расчет категории производства по взрывопожарной и пожарной опасности", price: "от 200 000 ₸" },
    ],
  },
  {
    icon: FileText,
    title: "Аутсорсинг документации",
    description: "Полное ведение документации по безопасности",
    services: [
      { name: "Аутсорсинг по пожарной безопасности (разработка и ведение документации)", price: "по договоренности" },
      { name: "Аутсорсинг по безопасности и охране труда (разработка и ведение документации)", price: "по договоренности" },
    ],
  },
  {
    icon: Flame,
    title: "Перезарядка огнетушителей (порошковые ОП)",
    description: "Техническое обслуживание, перезарядка и освидетельствование",
    services: [
      { name: "Перезарядка ОП-3", price: "1 000 ₸" },
      { name: "Перезарядка ОП-4", price: "1 200 ₸" },
      { name: "Перезарядка ОП-5", price: "1 850 ₸" },
      { name: "Перезарядка ОП-8", price: "2 800 ₸" },
      { name: "Перезарядка ОП-10", price: "4 500 ₸" },
      { name: "Перезарядка ОП-25", price: "8 500 ₸" },
      { name: "Перезарядка ОП-35", price: "12 500 ₸" },
      { name: "Перезарядка ОП-50", price: "16 500 ₸" },
      { name: "Перезарядка ОП-80", price: "25 090 ₸" },
      { name: "Перезарядка ОП-100", price: "30 250 ₸" },
    ],
  },
  {
    icon: Flame,
    title: "Перезарядка огнетушителей (углекислотные ОУ)",
    services: [
      { name: "Перезарядка ОУ-2", price: "1 800 ₸" },
      { name: "Перезарядка ОУ-3", price: "2 200 ₸" },
      { name: "Перезарядка ОУ-4", price: "3 900 ₸" },
      { name: "Перезарядка ОУ-5", price: "5 900 ₸" },
      { name: "Перезарядка ОУ-8", price: "6 900 ₸" },
      { name: "Перезарядка ОУ-10", price: "8 700 ₸" },
      { name: "Перезарядка ОУ-25", price: "15 000 ₸" },
    ],
  },
  {
    icon: Settings,
    title: "Замена комплектующих огнетушителей",
    description: "Ремонт и замена составных частей",
    services: [
      { name: "Замена шланга с распылителем", price: "1 000 ₸" },
      { name: "Замена ЗПУ (ОП-1–10)", price: "1 800 ₸" },
      { name: "Замена ЗПУ (ОП-35–80)", price: "7 050 ₸" },
      { name: "Замена манометра", price: "800 ₸" },
      { name: "Раструб к ОУ-1–3 с выкидной трубой", price: "2 000 ₸" },
      { name: "Замена ЗПУ (ОУ-1–10)", price: "4 145 ₸" },
      { name: "Раструб к ОУ-5", price: "2 700 ₸" },
      { name: "Покраска огнетушителя ОП-10", price: "2 200 ₸" },
      { name: "Покраска огнетушителя ОП-35/50", price: "5 500 ₸" },
      { name: "Переосвидетельствование ОП-5", price: "1 000 ₸" },
      { name: "Утилизация огнетушителя (с составлением Акта)", price: "500 ₸" },
    ],
  },
  {
    icon: GraduationCap,
    title: "Обучение сотрудников",
    description: "Сертифицированное обучение с выдачей удостоверений",
    services: [
      { name: "Безопасность и охрана труда (с сертификатом)", price: "12 000 ₸ / чел" },
      { name: "Пожарный минимум (с удостоверением)", price: "7 000 ₸ / чел" },
      { name: "Электробезопасность до 1000В (с допуском)", price: "9 000 ₸ / чел" },
      { name: "Электробезопасность свыше 1000В (с допуском)", price: "9 000 ₸ / чел" },
      { name: "Оказание первой медицинской помощи", price: "80 000 ₸ / группа" },
      { name: "Добровольные пожарные формирования", price: "20 000 ₸ / чел" },
      { name: "Антикоррупция — Комплаенс", price: "50 000 ₸ / чел" },
      { name: "Члены Согласительной комиссии", price: "15 000 ₸ / чел" },
      { name: "Промышленная безопасность", price: "6 000 ₸ / чел" },
      { name: "Действия при землетрясении", price: "150 000 ₸ / группа" },
      { name: "Поведенческое обучение NEARMISS", price: "35 000 ₸ / чел" },
      { name: "Антитеррористическая защищенность", price: "90 000 ₸" },
    ],
  },
  {
    icon: ShieldCheck,
    title: "Антитеррористическая защищенность",
    services: [
      { name: "Разработка и изготовление «Паспорта антитеррористической защищенности объекта»", price: "по договоренности" },
    ],
  },
  {
    icon: Settings,
    title: "Техническое обслуживание систем",
    description: "Монтаж, ремонт и освидетельствование противопожарных систем",
    services: [
      { name: "Обслуживание автоматической пожарной сигнализации", price: "по договоренности" },
      { name: "Обслуживание систем пожаротушения", price: "по договоренности" },
      { name: "Обслуживание систем автоматического газового пожаротушения", price: "по договоренности" },
      { name: "Обслуживание систем автоматического водяного пожаротушения", price: "по договоренности" },
      { name: "Техническое освидетельствование модуля газового пожаротушения", price: "50 000 ₸" },
      { name: "Сервисное обслуживание слаботочных систем (видеонаблюдение, связь, охранная сигнализация, СКУД)", price: "по договоренности" },
      { name: "Интеграция пожарной автоматики с инженерными коммуникациями здания", price: "по договоренности" },
      { name: "Составление план-графика ППР и ТО систем пожарной автоматики", price: "35 000 ₸" },
      { name: "Разработка и восстановление проектной документации по пожарной автоматике", price: "по договоренности" },
      { name: "Разработка и восстановление технической документации (паспорта, формуляры)", price: "80 000 ₸" },
    ],
  },
  {
    icon: Map,
    title: "Планы эвакуации",
    description: "Разработка и изготовление планов эвакуации и схем проезда",
    services: [
      { name: "План эвакуаций при ЧС (лист А3, ламинация, каз/рус)", price: "7 000 ₸" },
      { name: "План эвакуаций при ЧС (табличка, основа ПВХ, ламинация)", price: "8 000 ₸" },
      { name: "План эвакуаций (в рамке под стеклом, каз/рус)", price: "9 000 ₸" },
      { name: "Схема проезда пожарных машин (алюкобонд, 1.2×1.2 м)", price: "95 000 ₸" },
    ],
  },
  {
    icon: Paintbrush,
    title: "Огнезащитная обработка",
    services: [
      { name: "Обработка деревянных конструкций (кровля, перегородки, стропила) — пропитка «ОГНЕЗА»", price: "от 600 ₸ / м²" },
      { name: "Обработка деревянных конструкций (пути эвакуации) — лак «Авангард-Гелиос»", price: "от 1 500 ₸ / м²" },
    ],
  },
  {
    icon: FlaskConical,
    title: "Испытательная пожарная лаборатория",
    description: "Испытания и проверки с выдачей протоколов",
    services: [
      { name: "Испытания параметров систем вентиляции и противодымной защиты", price: "350 000 ₸" },
      { name: "Испытания обработанных огнезащитой поверхностей (дерево, металл, ткань)", price: "от 40 000 ₸" },
      { name: "Испытание наружных пожарных металлических лестниц и ограждений кровли", price: "от 6 000 ₸ / п.м." },
      { name: "Проверка электропроводки, испытание изоляции проводов и заземляющих устройств", price: "от 40 000 ₸" },
      { name: "Измерение сопротивления петли фаза-нуль", price: "от 40 000 ₸" },
      { name: "Испытание стеллажей (1 ряд, 1 п.м.)", price: "3 500 ₸" },
      { name: "Испытание средств огнезащиты древесины", price: "80 000 ₸" },
      { name: "Испытание средств огнезащиты стальных и ж/б конструкций", price: "150 000 ₸" },
      { name: "Испытание пожарных кранов и клапанов", price: "80 000 ₸" },
      { name: "Испытание наружной пожарной металлической лестницы", price: "4 000 ₸" },
      { name: "Испытание металлического ограждения кровли крыши", price: "4 000 ₸" },
    ],
  },
  {
    icon: Image,
    title: "Плакаты по безопасности",
    description: "Цветные плакаты с ламинацией, на казахском и русском языках",
    services: [
      { name: "Плакат «Действия при пожаре»", price: "1 400 ₸" },
      { name: "Плакат «Использование огнетушителя»", price: "1 400 ₸" },
      { name: "Плакат «Использование внутреннего пожарного крана»", price: "1 400 ₸" },
      { name: "Плакат «Первая медицинская помощь»", price: "1 400 ₸" },
      { name: "Плакат «Эвакуация населения при ЧС»", price: "1 400 ₸" },
      { name: "Плакат «Электробезопасность»", price: "1 400 ₸" },
      { name: "Плакат «Техника безопасности на складе»", price: "1 400 ₸" },
      { name: "Плакат «Компьютерная безопасность»", price: "1 400 ₸" },
      { name: "Плакат «10 простых шагов при землетрясении»", price: "1 400 ₸" },
    ],
  },
  {
    icon: BookOpen,
    title: "Журналы",
    description: "Журналы регистрации и учёта",
    services: [
      { name: "Журнал регистрации вводного инструктажа", price: "1 400 ₸" },
      { name: "Журнал регистрации инструктажа по пожарной безопасности", price: "1 400 ₸" },
      { name: "Журнал регистрации инструктажа по безопасности и охране труда", price: "1 400 ₸" },
      { name: "Журнал учета и технического обслуживания огнетушителей", price: "1 400 ₸" },
      { name: "Журнал технического обслуживания пожарной автоматики", price: "1 400 ₸" },
      { name: "Журнал перекатки пожарных рукавов", price: "1 400 ₸" },
      { name: "Журнал учета несчастных случаев", price: "1 400 ₸" },
      { name: "Журнал трехступенчатого контроля за состоянием ОТ и ТБ", price: "1 400 ₸" },
      { name: "Журнал учебных мероприятий по антитеррористической подготовке", price: "1 400 ₸" },
    ],
  },
  {
    icon: Tag,
    title: "Знаки и таблички",
    description: "Знаки эвакуации и пожарной безопасности",
    services: [
      { name: "Знаки (наклейка, плотность 250гр)", price: "350 ₸" },
      { name: "Знаки (табличка, основа ПВХ 3мм, винил)", price: "500 ₸" },
      { name: "Знаки (алюкобонд 3.5мм, уличные, светоотражающие)", price: "2 700 ₸" },
      { name: "Знаки (светонакопительные ФЭС, основа ПВХ 3мм)", price: "2 000 ₸" },
    ],
  },
  {
    icon: LayoutGrid,
    title: "Информационные стенды",
    description: "Основа ПВХ (5мм), кайма под золото",
    services: [
      { name: "Стенд «Уголок гражданской защиты»", price: "3 000 ₸" },
      { name: "Стенд «Уголок пожарной безопасности»", price: "3 000 ₸" },
      { name: "Стенд «Техника безопасности»", price: "3 000 ₸" },
      { name: "Стенд «Компьютерная безопасность»", price: "3 000 ₸" },
      { name: "Стенд «Безопасность и Охрана труда»", price: "3 000 ₸" },
      { name: "Стенд «Электробезопасность»", price: "3 000 ₸" },
      { name: "Стенд «Безопасность на воде»", price: "3 000 ₸" },
      { name: "Стенд «Оказание первой медицинской помощи»", price: "3 000 ₸" },
    ],
  },
];

const CollapsibleServiceBlock = ({ category, index }: { category: ServiceCategory; index: number }) => {
  const { ref, inView } = useInView(0.05);
  const isAlt = index % 2 === 1;
  const VISIBLE_LIMIT = 4;
  const hasMany = category.services.length > VISIBLE_LIMIT;
  const [expanded, setExpanded] = useState(!hasMany);

  const visibleServices = expanded ? category.services : category.services.slice(0, VISIBLE_LIMIT);
  const hiddenCount = category.services.length - VISIBLE_LIMIT;

  return (
    <div
      ref={ref}
      className={`py-12 md:py-16 px-4 ${isAlt ? "bg-muted/50" : "bg-background"}`}
    >
      <div className={`container-narrow ${inView ? "animate-fade-up" : "opacity-0"}`}>
        <div className="flex items-start gap-4 mb-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <category.icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">{category.title}</h3>
            {category.description && (
              <p className="text-muted-foreground text-sm mt-1">{category.description}</p>
            )}
          </div>
        </div>
        <div className="grid gap-2.5 mt-6">
          {visibleServices.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between bg-card rounded-lg px-5 py-3.5 shadow-card hover:shadow-soft transition-shadow duration-300 gap-4"
            >
              <span className="text-foreground text-sm md:text-base">{service.name}</span>
              <span className="text-accent font-semibold text-sm whitespace-nowrap">{service.price}</span>
            </div>
          ))}
        </div>
        {hasMany && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 flex items-center gap-2 text-sm font-medium text-accent hover:text-primary transition-colors mx-auto"
          >
            {expanded ? (
              <>Свернуть <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>Показать все ({hiddenCount}) <ChevronDown className="w-4 h-4" /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const ServicesSection = () => {
  const { ref, inView } = useInView();

  return (
    <section id="services">
      <div className="section-padding bg-background pb-4" ref={ref}>
        <div className={`container-narrow text-center ${inView ? "animate-fade-up" : "opacity-0"}`}>
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Услуги</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Полный каталог услуг</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Более 100 услуг в области пожарной безопасности, охраны труда и технического обслуживания
          </p>
        </div>
      </div>
      {categories.map((cat, i) => (
        <CollapsibleServiceBlock key={cat.title + i} category={cat} index={i} />
      ))}
    </section>
  );
};

export default ServicesSection;
