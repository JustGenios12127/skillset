import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import type { CategoryGroup } from "./utils/catalogUtils";

export interface CategoryNavProps {
  groups: CategoryGroup[];
  allCollapsed: boolean;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export function CategoryNav({
  groups,
  allCollapsed,
  onExpandAll,
  onCollapseAll,
}: CategoryNavProps) {
  const scrollToSection = (groupId: string | null) => {
    const id = `cat-section-${groupId ?? "uncategorized"}`;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="sticky top-0 z-10 -mx-1 flex items-center gap-2 overflow-x-auto bg-gray-50 px-1 py-2">
      {/* Expand/Collapse all */}
      <button
        onClick={allCollapsed ? onExpandAll : onCollapseAll}
        title={allCollapsed ? "Развернуть все" : "Свернуть все"}
        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-800"
      >
        {allCollapsed ? (
          <>
            <ChevronsUpDown size={13} />
            Развернуть все
          </>
        ) : (
          <>
            <ChevronsDownUp size={13} />
            Свернуть все
          </>
        )}
      </button>

      <div className="h-4 w-px shrink-0 bg-gray-200" />

      {/* Category chips */}
      {groups.map((group) => (
        <button
          key={group.id ?? "uncategorized"}
          onClick={() => scrollToSection(group.id)}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
          <span className="max-w-[140px] truncate">{group.name}</span>
          <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-500">
            {group.products.length}
          </span>
        </button>
      ))}
    </div>
  );
}
