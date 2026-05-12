import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { data } from "./data";

const ALL = "All";

const categories = [
  ALL,
  ...Array.from(new Set(data.map((d) => d.description))).sort(),
];

const categoryColors: Record<string, string> = {
  "Adult Health":
    "text-emerald-300 border-emerald-300/40 bg-emerald-300/10",
  "Child Health":
    "text-cyan-300 border-cyan-300/40 bg-cyan-300/10",
  Fundamentals:
    "text-teal-300 border-teal-300/40 bg-teal-300/10",
  "Management of Care":
    "text-lime-300 border-lime-300/40 bg-lime-300/10",
  "Maternal & Newborn Health":
    "text-pink-300 border-pink-300/40 bg-pink-300/10",
  "Mental Health":
    "text-violet-300 border-violet-300/40 bg-violet-300/10",
  Pharmacology:
    "text-amber-300 border-amber-300/40 bg-amber-300/10",
};

export default function CheatSheets() {
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((item) => {
      const matchCat =
        activeCategory === ALL || item.description === activeCategory;
      const matchSearch = item.name
        .replace(/\n/g, " ")
        .toLowerCase()
        .includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-14 font-mono">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-primary text-xs mb-2 tracking-widest uppercase opacity-70">
            nursing reference
          </p>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">
            Cheat Sheets
          </h1>
          <p className="text-muted-foreground text-xs">
            {data.length} sheets &middot; {categories.length - 1} categories
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="search sheets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border border-white/10 rounded-md px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground mb-5 focus:outline-none focus:border-primary/60 transition-colors"
        />

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-[11px] rounded-full border transition-all duration-150 ${
                activeCategory === cat
                  ? "bg-primary/20 border-primary text-primary"
                  : "border-white/10 text-muted-foreground hover:border-white/30 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((item) => {
              const name = item.name.replace(/\n/g, " ").trim();
              const colorClass =
                categoryColors[item.description] ??
                "text-foreground border-white/20 bg-white/5";

              return (
                <a
                  key={item.name}
                  href={item.route.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between gap-3 p-4 border border-white/10 rounded-lg hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug flex-1">
                      {name}
                    </h2>
                    <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${colorClass}`}
                    >
                      {item.description}
                    </span>
                    {item.freeAccess && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-primary/50 bg-primary/10 text-primary font-medium">
                        free
                      </span>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted-foreground text-sm py-24">
            no results
          </div>
        )}
      </div>
    </div>
  );
}
