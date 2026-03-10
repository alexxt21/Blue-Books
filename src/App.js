import { useState, useMemo, useEffect } from "react";
import papers from "./papers.json";

const CATEGORIES = ["All", ...Array.from(new Set(papers.map((p) => p.category))).sort()];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 641);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 641);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return mobile;
}

function PaperModal({ paper, onClose }) {
  useEffect(() => {
    if (paper) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [paper]);

  if (!paper) return null;
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <button style={s.closeBtn} onClick={onClose}>✕</button>
        <div style={s.modalCategory}>{paper.category}</div>
        <h2 style={s.modalTitle}>{paper.title}</h2>
        <div style={s.modalMeta}>
          <span style={s.modalAuthors}>{paper.authors.join(", ")}</span>
          <span style={s.dot}>·</span>
          <span style={s.modalDate}>{formatDate(paper.date)}</span>
          <span style={s.dot}>·</span>
          <span style={s.modalDate}>{paper.pages} pages</span>
        </div>
        <div style={s.divider} />
        <p style={s.abstractLabel}>Abstract</p>
        <p style={s.modalAbstract}>{paper.abstract}</p>
        <div style={s.modalTags}>
          {paper.tags.map((tag) => <span key={tag} style={s.tag}>#{tag}</span>)}
        </div>
        <a href={paper.pdfUrl} style={s.downloadBtn} target="_blank" rel="noopener noreferrer">
          <span style={{ fontSize: 18 }}>↓</span> Download PDF
        </a>
      </div>
    </div>
  );
}

function PaperCard({ paper, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ ...s.card, ...(hovered ? s.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(paper)}
    >
      <div style={s.cardHeader}>
        <span style={s.cardCategory}>{paper.category}</span>
        <span style={s.cardDate}>{formatDate(paper.date)}</span>
      </div>
      <h2 style={s.cardTitle}>{paper.title}</h2>
      <p style={s.cardAuthors}>{paper.authors.join(", ")}</p>
      <p style={s.cardAbstract}>
        {paper.abstract.length > 180 ? paper.abstract.slice(0, 180) + "…" : paper.abstract}
      </p>
      <div style={s.cardFooter}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {paper.tags.slice(0, 3).map((tag) => <span key={tag} style={s.tag}>#{tag}</span>)}
        </div>
        <span style={s.readMore}>Read abstract →</span>
      </div>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const filtered = useMemo(() => {
    return papers.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        p.title.toLowerCase().includes(q) ||
        p.abstract.toLowerCase().includes(q) ||
        p.authors.some((a) => a.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <div style={s.root}>
      {/* HEADER */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={s.logoMark}>TB</div>
            <div>
              <div style={s.logoText}>The Blue Books</div>
              <div style={s.logoSub}>Research Publishing</div>
            </div>
          </div>
          {!isMobile && (
            <nav style={{ display: "flex", gap: 32 }}>
              {["Papers", "About", "Submit"].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} style={s.navLink}>{l}</a>
              ))}
            </nav>
          )}
          {isMobile && (
            <button style={s.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
              {[0, 1, 2].map((i) => <span key={i} style={s.hamLine} />)}
            </button>
          )}
        </div>
        {isMobile && menuOpen && (
          <div style={s.mobileMenu}>
            {["Papers", "About", "Submit"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} style={s.mobileNavLink} onClick={() => setMenuOpen(false)}>{l}</a>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroGlow} />
        <div style={s.heroContent}>
          <div style={s.eyebrow}>Multi-disciplinary Research</div>
          <h1 style={s.heroTitle}>
            Ideas worth<br />
            <em style={{ fontStyle: "italic", color: "#3a7bd5" }}>preserving.</em>
          </h1>
          <p style={s.heroSub}>A curated archive of rigorous scholarship across science, society, and technology.</p>
          <div style={s.heroStats}>
            {[
              { num: papers.length, label: "Papers" },
              { num: CATEGORIES.length - 1, label: "Fields" },
              { num: "Open", label: "Access" },
            ].map((stat, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 24 }}>
                {i > 0 && <div style={s.statDivider} />}
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={s.statNum}>{stat.num}</span>
                  <span style={s.statLabel}>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH + FILTER */}
      <section id="papers" style={s.controls}>
        <div style={{ position: "relative", marginBottom: 20 }}>
          <span style={s.searchIcon}>⌕</span>
          <input
            style={s.searchInput}
            type="text"
            placeholder="Search by title, author, keyword…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button style={s.clearBtn} onClick={() => setSearch("")}>✕</button>
          )}
        </div>
        <div style={s.filterRow}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              style={{ ...s.filterBtn, ...(activeCategory === cat ? s.filterBtnActive : {}) }}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* RESULTS COUNT */}
      <div style={s.resultsBar}>
        <span style={s.resultsCount}>
          {filtered.length} paper{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
          {search ? ` matching "${search}"` : ""}
        </span>
      </div>

      {/* GRID */}
      <main style={s.grid}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 48, color: "#2a4a6a", marginBottom: 16 }}>◎</div>
            <p style={{ color: "#4a6a8a", fontSize: 15 }}>No papers found. Try a different search or category.</p>
          </div>
        ) : (
          filtered.map((paper) => (
            <PaperCard key={paper.id} paper={paper} onClick={setSelectedPaper} />
          ))
        )}
      </main>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <div style={s.footerLogo}>The Blue Books</div>
          <p style={{ fontSize: 14, color: "#4a6a8a", margin: "0 0 8px" }}>Open-access, multi-disciplinary research publishing.</p>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#2a4a6a", margin: 0 }}>
            © {new Date().getFullYear()} The Blue Books. All rights reserved.
          </p>
        </div>
      </footer>

      <PaperModal paper={selectedPaper} onClose={() => setSelectedPaper(null)} />
    </div>
  );
}

const s = {
  root: { fontFamily: "'IBM Plex Sans', sans-serif", background: "#0c1520", color: "#e8e0d0", minHeight: "100vh" },

  header: { position: "sticky", top: 0, zIndex: 100, background: "rgba(12,21,32,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(99,148,200,0.15)" },
  headerInner: { maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" },
  logoMark: { width: 38, height: 38, background: "linear-gradient(135deg,#3a7bd5,#1a4a8a)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'IBM Plex Mono',monospace", fontWeight: 500, fontSize: 13, color: "#fff", letterSpacing: 1 },
  logoText: { fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: "#e8e0d0", lineHeight: 1.2 },
  logoSub: { fontSize: 10, color: "#6394c8", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'IBM Plex Mono',monospace" },
  navLink: { color: "#9ab4cc", textDecoration: "none", fontSize: 14, letterSpacing: 0.5 },
  hamburger: { display: "flex", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 8 },
  hamLine: { display: "block", width: 22, height: 2, background: "#9ab4cc", borderRadius: 2 },
  mobileMenu: { background: "#0f1d2e", borderTop: "1px solid rgba(99,148,200,0.1)", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16 },
  mobileNavLink: { color: "#9ab4cc", textDecoration: "none", fontSize: 15 },

  hero: { position: "relative", overflow: "hidden", background: "linear-gradient(180deg,#0d1e30 0%,#0c1520 100%)", padding: "80px 24px 64px", borderBottom: "1px solid rgba(99,148,200,0.1)" },
  heroGlow: { position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(58,123,213,0.08) 0%,transparent 70%)", pointerEvents: "none" },
  heroContent: { maxWidth: 1200, margin: "0 auto", position: "relative" },
  eyebrow: { fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#3a7bd5", marginBottom: 20 },
  heroTitle: { fontFamily: "'Playfair Display',serif", fontSize: "clamp(48px,8vw,88px)", fontWeight: 700, lineHeight: 1.05, margin: "0 0 20px", color: "#f0ebe0", letterSpacing: -1 },
  heroSub: { fontSize: 17, lineHeight: 1.7, color: "#8aa4be", maxWidth: 520, margin: "0 0 48px", fontWeight: 300 },
  heroStats: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0 },
  statNum: { fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 600, color: "#f0ebe0", lineHeight: 1 },
  statLabel: { fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#6394c8" },
  statDivider: { width: 1, height: 32, background: "rgba(99,148,200,0.2)", marginRight: 24 },

  controls: { maxWidth: 1200, margin: "0 auto", padding: "36px 24px 0" },
  searchIcon: { position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 20, color: "#4a6a8a", pointerEvents: "none", lineHeight: 1 },
  searchInput: { width: "100%", padding: "14px 48px", background: "#0f1d2e", border: "1px solid rgba(99,148,200,0.2)", borderRadius: 10, color: "#e8e0d0", fontSize: 15, fontFamily: "'IBM Plex Sans',sans-serif", outline: "none", boxSizing: "border-box" },
  clearBtn: { position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#4a6a8a", cursor: "pointer", fontSize: 14, padding: 4 },
  filterRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  filterBtn: { padding: "7px 16px", background: "transparent", border: "1px solid rgba(99,148,200,0.2)", borderRadius: 20, color: "#7a9ab8", fontSize: 13, cursor: "pointer", fontFamily: "'IBM Plex Sans',sans-serif", whiteSpace: "nowrap" },
  filterBtnActive: { background: "#1a3a6a", border: "1px solid #3a7bd5", color: "#a8c8f0" },

  resultsBar: { maxWidth: 1200, margin: "0 auto", padding: "16px 24px 8px" },
  resultsCount: { fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: "#4a6a8a", letterSpacing: 0.5 },

  grid: { maxWidth: 1200, margin: "0 auto", padding: "8px 24px 64px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 },

  card: { background: "#0f1d2e", border: "1px solid rgba(99,148,200,0.12)", borderRadius: 12, padding: 24, cursor: "pointer", transition: "all 0.2s ease", display: "flex", flexDirection: "column", gap: 12 },
  cardHover: { border: "1px solid rgba(58,123,213,0.4)", background: "#111f30", transform: "translateY(-2px)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 },
  cardCategory: { fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#3a7bd5", background: "rgba(58,123,213,0.1)", padding: "3px 10px", borderRadius: 20 },
  cardDate: { fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#3a5a7a" },
  cardTitle: { fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, lineHeight: 1.4, color: "#e8e0d0", margin: 0 },
  cardAuthors: { fontSize: 13, color: "#6a8aaa", margin: 0, fontStyle: "italic" },
  cardAbstract: { fontSize: 14, lineHeight: 1.7, color: "#7a90a8", margin: 0, fontWeight: 300, flexGrow: 1 },
  cardFooter: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginTop: 4 },
  tag: { fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "#3a6a9a", letterSpacing: 0.3 },
  readMore: { fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#3a7bd5", letterSpacing: 0.5, whiteSpace: "nowrap" },

  overlay: { position: "fixed", inset: 0, background: "rgba(6,12,20,0.88)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  modal: { background: "#0f1d2e", border: "1px solid rgba(99,148,200,0.2)", borderRadius: 16, padding: "40px", maxWidth: 680, width: "100%", maxHeight: "90vh", overflowY: "auto", position: "relative", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" },
  closeBtn: { position: "absolute", top: 20, right: 20, background: "rgba(99,148,200,0.1)", border: "none", color: "#9ab4cc", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 14 },
  modalCategory: { fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#3a7bd5", marginBottom: 16 },
  modalTitle: { fontFamily: "'Playfair Display',serif", fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, lineHeight: 1.3, color: "#f0ebe0", margin: "0 0 16px" },
  modalMeta: { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 24 },
  modalAuthors: { fontSize: 14, color: "#7a9ab8", fontStyle: "italic" },
  dot: { color: "#2a4a6a" },
  modalDate: { fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: "#3a5a7a" },
  divider: { height: 1, background: "rgba(99,148,200,0.1)", marginBottom: 24 },
  abstractLabel: { fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#4a6a8a", margin: "0 0 12px", fontWeight: 500 },
  modalAbstract: { fontSize: 15, lineHeight: 1.8, color: "#8aa4be", margin: "0 0 24px", fontWeight: 300 },
  modalTags: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 },
  downloadBtn: { display: "inline-flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg,#1a4a8a,#3a7bd5)", color: "#fff", textDecoration: "none", padding: "14px 28px", borderRadius: 8, fontSize: 14, fontWeight: 500, letterSpacing: 0.5 },

  footer: { borderTop: "1px solid rgba(99,148,200,0.1)", background: "#090f18", padding: "48px 24px" },
  footerLogo: { fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: "#e8e0d0", marginBottom: 10 },
};

// Global CSS
const style = document.createElement("style");
style.textContent = `
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; background: #0c1520; }
  input::placeholder { color: #3a5a7a; }
  input:focus { border-color: rgba(58,123,213,0.5) !important; box-shadow: 0 0 0 3px rgba(58,123,213,0.08); }
  a:hover { opacity: 0.85; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #090f18; }
  ::-webkit-scrollbar-thumb { background: #1a3a5a; border-radius: 3px; }
  @media (max-width: 480px) {
    .grid { grid-template-columns: 1fr !important; }
  }
`;
document.head.appendChild(style);
