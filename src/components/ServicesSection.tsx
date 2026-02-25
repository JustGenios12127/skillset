import { useInView } from "@/hooks/useInView";
import { useState, useEffect } from "react";
import {
  Search, FileText, Lightbulb, Flame, GraduationCap,
  Settings, Map, ShieldCheck, FlaskConical, Paintbrush,
  Image, BookOpen, Tag, LayoutGrid, ChevronDown, ChevronUp,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ServiceRow {
  id: string;
  title: string;
  price_type: "negotiable" | "fixed";
  price: number | null;
  currency: string;
  sort_order: number;
}

interface CategoryGroup {
  id: string;
  name: string;
  sort_order: number;
  services: ServiceRow[];
}

// ─── Static metadata: icons & descriptions ───────────────────────────────────
// Maintained in the frontend; new admin-created categories get a fallback icon.

interface CategoryMeta {
  icon: React.ElementType;
  description?: string;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  "Аудит и экспертиза": {
    icon: Search,
    description: "Профессиональная оценка соответствия требованиям безопасности",
  },
  "Проектирование и консалтинг": {
    icon: Lightbulb,
    description: "Разработка документации и технических решений",
  },
  "Аутсорсинг документации": {
    icon: FileText,
    description: "Полное ведение документации по безопасности",
  },
  "Перезарядка огнетушителей (порошковые ОП)": {
    icon: Flame,
    description: "Техническое обслуживание, перезарядка и освидетельствование",
  },
  "Перезарядка огнетушителей (углекислотные ОУ)": {
    icon: Flame,
  },
  "Замена комплектующих огнетушителей": {
    icon: Settings,
    description: "Ремонт и замена составных частей",
  },
  "Обучение сотрудников": {
    icon: GraduationCap,
    description: "Сертифицированное обучение с выдачей удостоверений",
  },
  "Антитеррористическая защищенность": {
    icon: ShieldCheck,
  },
  "Техническое обслуживание систем": {
    icon: Settings,
    description: "Монтаж, ремонт и освидетельствование противопожарных систем",
  },
  "Планы эвакуации": {
    icon: Map,
    description: "Разработка и изготовление планов эвакуации и схем проезда",
  },
  "Огнезащитная обработка": {
    icon: Paintbrush,
  },
  "Испытательная пожарная лаборатория": {
    icon: FlaskConical,
    description: "Испытания и проверки с выдачей протоколов",
  },
  "Плакаты по безопасности": {
    icon: Image,
    description: "Цветные плакаты с ламинацией, на казахском и русском языках",
  },
  "Журналы": {
    icon: BookOpen,
    description: "Журналы регистрации и учёта",
  },
  "Знаки и таблички": {
    icon: Tag,
    description: "Знаки эвакуации и пожарной безопасности",
  },
  "Информационные стенды": {
    icon: LayoutGrid,
    description: "Основа ПВХ (5мм), кайма под золото",
  },
};

const DEFAULT_META: CategoryMeta = { icon: LayoutGrid };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(service: ServiceRow): string {
  if (service.price_type === "negotiable" || service.price === null) {
    return "по договоренности";
  }
  const symbol = service.currency === "KZT" ? "₸" : service.currency;
  return `${service.price.toLocaleString("ru-RU")} ${symbol}`;
}

// ─── CollapsibleServiceBlock ─────────────────────────────────────────────────

const VISIBLE_LIMIT = 4;

interface CollapsibleServiceBlockProps {
  category: CategoryGroup;
  index: number;
}

const CollapsibleServiceBlock = ({ category, index }: CollapsibleServiceBlockProps) => {
  const { ref, inView } = useInView(0.05);
  const meta = CATEGORY_META[category.name] ?? DEFAULT_META;
  const isAlt = index % 2 === 1;
  const hasMany = category.services.length > VISIBLE_LIMIT;
  const [expanded, setExpanded] = useState(!hasMany);

  const visibleServices = expanded
    ? category.services
    : category.services.slice(0, VISIBLE_LIMIT);
  const hiddenCount = category.services.length - VISIBLE_LIMIT;

  return (
    <div
      ref={ref}
      className={`py-12 md:py-16 px-4 ${isAlt ? "bg-muted/50" : "bg-background"}`}
    >
      <div className={`container-narrow ${inView ? "animate-fade-up" : "opacity-0"}`}>
        <div className="flex items-start gap-4 mb-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <meta.icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">{category.name}</h3>
            {meta.description && (
              <p className="text-muted-foreground text-sm mt-1">{meta.description}</p>
            )}
          </div>
        </div>
        <div className="grid gap-2.5 mt-6">
          {visibleServices.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between bg-card rounded-lg px-5 py-3.5 shadow-card hover:shadow-soft transition-shadow duration-300 gap-4"
            >
              <span className="text-foreground text-sm md:text-base">{service.title}</span>
              <span className="text-accent font-semibold text-sm whitespace-nowrap">
                {formatPrice(service)}
              </span>
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

// ─── Skeleton ────────────────────────────────────────────────────────────────

const SkeletonBlock = ({ alt }: { alt: boolean }) => (
  <div className={`py-12 md:py-16 px-4 ${alt ? "bg-muted/50" : "bg-background"}`}>
    <div className="container-narrow">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-muted animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-48 rounded bg-muted animate-pulse" />
          <div className="h-4 w-72 rounded bg-muted animate-pulse" />
        </div>
      </div>
      <div className="grid gap-2.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

// ─── ServicesSection ─────────────────────────────────────────────────────────

const ServicesSection = () => {
  const { ref, inView } = useInView();
  const [groups, setGroups] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          supabase
            .from("categories")
            .select("id, name, sort_order")
            .order("sort_order")
            .order("created_at"),
          supabase
            .from("products")
            .select("id, title, price_type, price, currency, sort_order, category_id")
            .eq("is_active", true)
            .order("sort_order")
            .order("created_at"),
        ]);

        if (catsRes.error) throw catsRes.error;
        if (prodsRes.error) throw prodsRes.error;

        const cats = catsRes.data ?? [];
        const prods = prodsRes.data ?? [];

        const grouped: CategoryGroup[] = cats
          .map((cat) => ({
            id: cat.id,
            name: cat.name,
            sort_order: cat.sort_order,
            services: prods.filter((p) => p.category_id === cat.id),
          }))
          .filter((g) => g.services.length > 0);

        setGroups(grouped);
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить каталог услуг");
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, []);

  return (
    <section id="services">
      <div className="section-padding bg-background pb-4" ref={ref}>
        <div
          className={`container-narrow text-center ${
            inView ? "animate-fade-up" : "opacity-0"
          }`}
        >
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">
            Услуги
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Полный каталог услуг
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Более 100 услуг в области пожарной безопасности, охраны труда и технического
            обслуживания
          </p>
        </div>
      </div>

      {loading && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <SkeletonBlock key={i} alt={i % 2 === 1} />
          ))}
        </>
      )}

      {error && (
        <div className="py-16 text-center text-muted-foreground">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && groups.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          <p>Каталог пока пуст</p>
        </div>
      )}

      {!loading &&
        !error &&
        groups.map((cat, i) => (
          <CollapsibleServiceBlock key={cat.id} category={cat} index={i} />
        ))}
    </section>
  );
};

export default ServicesSection;
