import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Trophy,
  Shield,
  Activity,
  Target,
  Flame,
  Heart,
  Star,
  Award,
  ChevronRight,
  Mail,
  CheckCircle2,
  Sparkles,
  User,
  Menu,
  X,
  ArrowUpRight,
  Instagram,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Copy,
  Check,
  Quote,
  ClipboardList,
  Send,
  Paperclip,
  Trash2,
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";

const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || "tugas-files";

/* ============================================================
   DESIGN TOKENS
   Palette: Crimson/Burgundy Rose + Soft Peach + Warm Slate BG
   Type: Fraunces (display, editorial-athletic) + Inter (body/UI)
   ============================================================ */
const C = {
  bg: "#FFF9F7",
  bgAlt: "#FDF2ED",
  surface: "#FFFFFF",
  crimson: "#A81F3D",
  crimsonDeep: "#701429",
  crimsonSoft: "#C43A57",
  peach: "#F6C9AC",
  peachSoft: "#FBE3D2",
  ink: "#2B1620",
  inkSoft: "#6E4E57",
  inkFaint: "#9C7F86",
  gold: "#C0923F",
  line: "#EFDCD2",
};

/* ============================================================
   STATIC DATA
   ============================================================ */
const NAV_LINKS = [
  { id: "profil", label: "Profil" },
  { id: "perjuangan", label: "Perjuangan" },
  { id: "motivasi", label: "Cita-Cita" },
  { id: "posisi", label: "Keahlian" },
  { id: "tugas", label: "Tugas PKWU" },
  { id: "kontak", label: "Kontak" },
];

const QUICK_FACTS = [
  { icon: User, label: "Nama Lengkap", value: "Della Sugita" },
  { icon: Calendar, label: "Tanggal Lahir", value: "18 Januari 2009" },
  { icon: GraduationCap, label: "Sekolah", value: "SMA Negeri 12 Jakarta" },
  { icon: Activity, label: "Hobi Utama", value: "Bermain Bola / Futsal" },
  { icon: Shield, label: "Cita-Cita", value: "Polwan (Polisi Wanita)" },
];

const PROFILE_PHOTO_URL = import.meta.env.VITE_PROFILE_PHOTO_URL || "https://lqvjphmbebbcdquovkap.supabase.co/storage/v1/object/public/product-images/products/1785846905009-WhatsApp-Image-2026-08-03-at-20.40.12.jpeg";

const TIMELINE = [
  {
    step: "Kelas 7 SMP",
    title: "Langkah Pertama di Lapangan",
    desc: "Saya mulai mengenal dan jatuh cinta pada futsal, mengasah dasar teknik dan keberanian mengolah bola.",
  },
  {
    step: "SMP → SMA",
    title: "Konsistensi Tanpa Henti",
    desc: "Latihan rutin dan pertandingan demi pertandingan membentuk saya menjadi pemain yang serba bisa di lapangan.",
  },
  {
    step: "Kelas 12 SMA",
    title: "Panggilan Berlogo Garuda",
    desc: "Saya menerima surat resmi seleksi Timnas Futsal Putri U-19 — awal dari mimpi besar saya membela negara.",
  },
];

const ROLES = {
  flank: {
    name: "Flank",
    tagline: "Kelincahan & Penetrasi Sisi Lapangan",
    desc: "Sebagai flank, saya bergerak lincah membongkar pertahanan lawan dari sisi lapangan, mengandalkan kecepatan, kontrol bola rapat, dan visi umpan yang tajam untuk membuka ruang bagi tim.",
    traits: ["Kecepatan tinggi", "Dribbling rapat", "Visi umpan luas", "Transisi cepat"],
    court: { x: 78, y: 28 },
  },
  pivot: {
    name: "Pivot",
    tagline: "Ketajaman & Postur Lini Depan",
    desc: "Sebagai pivot, saya menjadi ujung tombak di lini depan — bertumpu pada penguasaan bola membelakangi gawang, sentuhan pertama yang matang, dan naluri mencetak gol di ruang sempit.",
    traits: ["Hold-up play", "Finishing tajam", "Postur kuat", "Naluri gol"],
    court: { x: 50, y: 74 },
  },
};

const CORE_VALUES = [
  { icon: Flame, title: "Tangguh & Pantang Menyerah", desc: "Tidak mudah goyah menghadapi tekanan, baik di lapangan maupun di kehidupan sehari-hari." },
  { icon: Shield, title: "Kedisiplinan & Mental Bintang", desc: "Menjaga ritme latihan dan pola pikir juara secara konsisten, kapan pun dan di mana pun." },
  { icon: Heart, title: "Kerja Sama Tim", desc: "Percaya bahwa kemenangan terbaik selalu lahir dari kekompakan dan kepercayaan antar rekan." },
  { icon: Star, title: "Kepemimpinan di Lapangan", desc: "Mengambil inisiatif dan menjadi penggerak semangat tim saat momen krusial pertandingan." },
];

const GOALS = [
  {
    icon: Shield,
    title: "Polisi Wanita (Polwan)",
    desc: "Ingin mengabdi kepada bangsa dan negara dengan kedisiplinan, integritas, dan keteguhan hati.",
  },
  {
    icon: Trophy,
    title: "Timnas Futsal Putri",
    desc: "Mengukir prestasi internasional dan membawa nama harum Indonesia di kancah futsal dunia.",
  },
];

const CONTACT_METHODS = [
  { icon: Mail, label: "Email", value: "della.sugita@example.com" },
  { icon: Instagram, label: "Instagram", value: "@della.sugita" },
  { icon: MapPin, label: "Domisili", value: "Jakarta, Indonesia" },
];

/* ============================================================
   HOOK: reveal-on-scroll
   ============================================================ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ============================================================
   HOOK: active section tracking
   ============================================================ */
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

/* ============================================================
   SUBCOMPONENT: Section eyebrow label
   ============================================================ */
function Eyebrow({ children }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-semibold tracking-[0.16em] uppercase"
      style={{ background: C.peachSoft, color: C.crimsonDeep }}
    >
      <Sparkles size={13} strokeWidth={2.5} />
      {children}
    </div>
  );
}

/* ============================================================
   SUBCOMPONENT: Mini futsal court diagram
   ============================================================ */
function CourtDiagram({ activeKey }) {
  const flank = ROLES.flank.court;
  const pivot = ROLES.pivot.court;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" role="img" aria-label="Diagram posisi lapangan futsal">
      <rect x="4" y="4" width="92" height="92" rx="4" fill="none" stroke={C.line} strokeWidth="1.4" />
      <line x1="4" y1="50" x2="96" y2="50" stroke={C.line} strokeWidth="1.4" />
      <circle cx="50" cy="50" r="12" fill="none" stroke={C.line} strokeWidth="1.4" />
      <circle cx="50" cy="50" r="1" fill={C.line} />
      <path d="M 4 34 A 16 16 0 0 1 4 66" fill="none" stroke={C.line} strokeWidth="1.4" />
      <path d="M 96 34 A 16 16 0 0 0 96 66" fill="none" stroke={C.line} strokeWidth="1.4" />

      {/* Flank marker */}
      <g style={{ transition: "opacity 300ms ease" }} opacity={activeKey === "flank" ? 1 : 0.35}>
        <circle cx={flank.x} cy={flank.y} r={activeKey === "flank" ? 5.5 : 4} fill={C.crimson} />
        <circle cx={flank.x} cy={flank.y} r={activeKey === "flank" ? 9 : 0} fill={C.crimson} opacity="0.18" />
        <text x={flank.x} y={flank.y - 9} textAnchor="middle" fontSize="5.2" fontWeight="700" fill={C.crimsonDeep}>
          FLANK
        </text>
      </g>

      {/* Pivot marker */}
      <g style={{ transition: "opacity 300ms ease" }} opacity={activeKey === "pivot" ? 1 : 0.35}>
        <circle cx={pivot.x} cy={pivot.y} r={activeKey === "pivot" ? 5.5 : 4} fill={C.crimson} />
        <circle cx={pivot.x} cy={pivot.y} r={activeKey === "pivot" ? 9 : 0} fill={C.crimson} opacity="0.18" />
        <text x={pivot.x} y={pivot.y + 11} textAnchor="middle" fontSize="5.2" fontWeight="700" fill={C.crimsonDeep}>
          PIVOT
        </text>
      </g>
    </svg>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("flank");
  const [copiedField, setCopiedField] = useState(null);

  const [taskForm, setTaskForm] = useState({
    nama: "",
    kelas: "",
    judul: "",
    catatan: "",
  });
  const [taskFile, setTaskFile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [taskError, setTaskError] = useState("");
  const [justSubmittedId, setJustSubmittedId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const activeSection = useActiveSection(NAV_LINKS.map((n) => n.id));
  useReveal();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("adminMode");
      if (saved === "true") setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data, error } = await supabase
        .from("tugas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase load error:", error);
        setTaskError("Gagal memuat tugas dari Supabase.");
        return;
      }

      setSubmissions(
        (data || []).map((item) => ({
          ...item,
          waktu: item.created_at ? new Date(item.created_at) : new Date(),
        }))
      );
    };

    fetchSubmissions();
  }, []);

  const handleNavClick = useCallback((id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleCopy = useCallback((value, field) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField((cur) => (cur === field ? null : cur)), 1800);
  }, []);

  const handleAdminLogin = useCallback(() => {
    if (adminPassword.trim() === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAdmin(true);
      setAdminError("");
      localStorage.setItem("adminMode", "true");
      setAdminPassword("");
      return;
    }

    setAdminError("Password admin salah.");
  }, [adminPassword]);

  const handleAdminLogout = useCallback(() => {
    setIsAdmin(false);
    localStorage.removeItem("adminMode");
  }, []);

  const handleTaskFileChange = useCallback((e) => {
    setTaskFile(e.target.files?.[0] || null);
  }, []);

  const handleTaskField = useCallback(
    (field) => (e) => {
      const value = e.target.value;
      setTaskForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleTaskSubmit = useCallback(async () => {
    if (!isAdmin) {
      setTaskError("Hanya admin yang dapat mengunggah tugas.");
      return;
    }

    if (!taskForm.nama.trim() || !taskForm.kelas.trim() || !taskForm.judul.trim()) {
      setTaskError("Nama, kelas, dan judul tugas wajib diisi.");
      return;
    }

    if (!taskFile) {
      setTaskError("File tugas wajib diunggah.");
      return;
    }

    setTaskError("");

    // Use server-side upload endpoint to avoid RLS/permission issues.
    try {
      const formData = new FormData();
      formData.append("file", taskFile);
      formData.append("nama", taskForm.nama.trim());
      formData.append("kelas", taskForm.kelas.trim());
      formData.append("judul", taskForm.judul.trim());
      formData.append("catatan", taskForm.catatan.trim());

      const resp = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await resp.json();

      if (!resp.ok) {
        console.error("Upload endpoint error:", result);
        setTaskError(result?.error || "Gagal mengunggah file tugas.");
        return;
      }

      const inserted = result.inserted;
      inserted.waktu = inserted.created_at ? new Date(inserted.created_at) : new Date();

      setSubmissions((prev) => [inserted, ...prev]);
      setTaskForm({ nama: "", kelas: "", judul: "", catatan: "" });
      setTaskFile(null);
      setJustSubmittedId(inserted.id);
      setTimeout(() => setJustSubmittedId((cur) => (cur === inserted.id ? null : cur)), 2400);
    } catch (e) {
      console.error("Upload error:", e);
      setTaskError("Gagal mengunggah file tugas. Coba lagi nanti.");
    }
  }, [isAdmin, taskFile, taskForm]);

  const handleTaskDelete = useCallback(async (id) => {
    const submission = submissions.find((item) => item.id === id);

    const { error } = await supabase.from("tugas").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      setTaskError("Gagal menghapus tugas dari Supabase. Coba lagi nanti.");
      return;
    }

    if (submission?.file_path) {
      const { error: storageError } = await supabase
        .storage
        .from(STORAGE_BUCKET)
        .remove([submission.file_path]);

      if (storageError) {
        console.error("Supabase storage delete error:", storageError);
      }
    }

    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  }, [submissions]);

  const role = ROLES[selectedRole];

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh" }} className="font-sans antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=Inter:wght@400;500;600;700;800&display=swap');
        .font-sans { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        [data-reveal] { opacity: 0; transform: translateY(22px); transition: opacity 700ms cubic-bezier(0.2,0.7,0.2,1), transform 700ms cubic-bezier(0.2,0.7,0.2,1); }
        [data-reveal].is-visible { opacity: 1; transform: translateY(0); }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal] { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
        .role-card { transition: border-color 240ms ease, box-shadow 240ms ease, transform 240ms ease; }
        .role-card:hover { transform: translateY(-3px); }
        .nav-link { position: relative; }
        .nav-link::after {
          content: ""; position: absolute; left: 0; right: 0; bottom: -6px; height: 2px;
          background: ${C.crimson}; transform: scaleX(0); transform-origin: left; transition: transform 260ms ease;
        }
        .nav-link.active::after { transform: scaleX(1); }
        .btn-primary { transition: transform 200ms ease, box-shadow 200ms ease, background 200ms ease; }
        .btn-primary:hover { transform: translateY(-2px); }
        .fact-row { transition: background 200ms ease; }
        .fact-row:hover { background: ${C.peachSoft}; }
        .value-card { transition: transform 220ms ease, box-shadow 220ms ease; }
        .value-card:hover { transform: translateY(-4px); box-shadow: 0 18px 40px -20px rgba(112,20,41,0.35); }
        .contact-btn { transition: transform 200ms ease, box-shadow 200ms ease, background 200ms ease; }
        .contact-btn:hover { transform: translateY(-2px); }
        input[type="text"], input[type="url"], textarea {
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }
        input[type="text"]:focus, input[type="url"]:focus, textarea:focus {
          border-color: ${C.crimson} !important;
          box-shadow: 0 0 0 3px rgba(168,31,61,0.12);
        }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .float-slow { animation: floatSlow 5s ease-in-out infinite; }
        @keyframes pulseRing { 0% { transform: scale(0.9); opacity: 0.6; } 100% { transform: scale(1.35); opacity: 0; } }
        .pulse-ring { animation: pulseRing 2.6s ease-out infinite; }
      `}</style>

      {/* ============================ NAVBAR ============================ */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ background: "rgba(255,249,247,0.85)", borderBottom: `1px solid ${C.line}` }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => handleNavClick("hero")}
            className="flex items-center gap-3 group"
          >
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-sm"
              style={{ background: C.crimson, color: "#fff" }}
            >
              DS
            </span>
            <span className="font-display font-semibold text-[15px] tracking-tight" style={{ color: C.ink }}>
              Della Sugita
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`nav-link text-sm font-medium ${activeSection === link.id ? "active" : ""}`}
                style={{ color: activeSection === link.id ? C.crimsonDeep : C.inkSoft }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick("kontak")}
              className="btn-primary text-sm font-semibold px-5 py-2.5 rounded-full"
              style={{ background: C.crimson, color: "#fff", boxShadow: "0 10px 24px -12px rgba(168,31,61,0.6)" }}
            >
              Hubungi Saya
            </button>
          </nav>

          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full"
            style={{ background: C.peachSoft }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Buka menu navigasi"
          >
            {menuOpen ? <X size={18} color={C.crimsonDeep} /> : <Menu size={18} color={C.crimsonDeep} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden px-5 pb-5 flex flex-col gap-1" style={{ borderTop: `1px solid ${C.line}` }}>
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-left py-3 text-sm font-medium border-b"
                style={{ color: C.inkSoft, borderColor: C.line }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick("kontak")}
              className="mt-3 text-sm font-semibold px-5 py-3 rounded-full text-center"
              style={{ background: C.crimson, color: "#fff" }}
            >
              Hubungi Saya
            </button>
          </div>
        )}
      </header>

      {/* ============================ HERO ============================ */}
      <section id="hero" className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: `radial-gradient(120% 90% at 85% 0%, ${C.peachSoft} 0%, ${C.bg} 55%)` }}
        />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-20 md:pt-20 md:pb-28 grid md:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-[0.14em] uppercase"
              style={{ background: "#fff", color: C.crimsonDeep, border: `1px solid ${C.line}` }}
            >
              <Star size={13} strokeWidth={2.5} />
              Pelajar · Atlet · Calon Polwan
            </div>

            <h1 className="font-display font-semibold leading-[1.05] text-[2.6rem] sm:text-[3.2rem] md:text-[3.6rem] tracking-tight mb-6">
              <span style={{ color: C.ink }}>Della</span>{" "}
              <span style={{ color: C.crimson }}>Sugita</span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed max-w-xl mb-8" style={{ color: C.inkSoft }}>
              Saya siswi SMA Negeri 12 Jakarta yang berdedikasi tinggi, pantang menyerah,
              dan memiliki passion mendalam di bidang olahraga futsal — dengan cita-cita
              besar menjadi Polisi Wanita.
            </p>

            <div
              className="rounded-3xl p-5 sm:p-6 mb-8 relative"
              style={{ background: C.surface, border: `1px solid ${C.line}` }}
            >
              <Quote size={22} style={{ color: C.peach }} className="absolute -top-3 left-5" />
              <p className="font-display italic text-[17px] sm:text-lg leading-relaxed" style={{ color: C.crimsonDeep }}>
                "Tidak ada hidup tanpa masalah, dan tidak ada usaha tanpa rasa lelah.
                Tetap semangat dari Bismillah sampai Alhamdulillah."
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mb-9">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                style={{ background: C.peachSoft, color: C.crimsonDeep }}
              >
                <GraduationCap size={14} /> Pelajar SMAN 12 Jakarta
              </span>
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                style={{ background: C.peachSoft, color: C.crimsonDeep }}
              >
                <Shield size={14} /> Calon Polwan
              </span>
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                style={{ background: C.peachSoft, color: C.crimsonDeep }}
              >
                <Activity size={14} /> Pemain Futsal
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleNavClick("perjuangan")}
                className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm"
                style={{ background: C.crimson, color: "#fff", boxShadow: "0 14px 30px -14px rgba(168,31,61,0.65)" }}
              >
                Baca Kisah Perjuangan <ChevronRight size={16} />
              </button>
              <button
                onClick={() => handleNavClick("kontak")}
                className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm"
                style={{ background: "#fff", color: C.crimsonDeep, border: `1px solid ${C.line}` }}
              >
                Hubungi Saya <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          {/* Hero avatar badge */}
          <div className="flex justify-center md:justify-end">
            <div className="relative float-slow">
              <div
                className="absolute inset-0 rounded-full pulse-ring"
                style={{ border: `2px solid ${C.crimson}` }}
              />
              <div
                className="w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden relative"
                style={{
                  background: `linear-gradient(155deg, ${C.crimson} 0%, ${C.crimsonDeep} 100%)`,
                  boxShadow: "0 30px 60px -20px rgba(112,20,41,0.5)",
                }}
              >
                <img
                  src={PROFILE_PHOTO_URL}
                  alt="Foto profil Della Sugita"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ boxShadow: "inset 0 0 0 4px rgba(255,255,255,0.9)" }}
                />
              </div>
              <div
                className="absolute -bottom-2 -right-2 sm:right-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: C.gold }}
              >
                <Shield size={24} color="#fff" />
              </div>
              <div
                className="absolute -top-3 -left-4 px-3 py-2 rounded-2xl shadow-lg flex items-center gap-1.5"
                style={{ background: "#fff", border: `1px solid ${C.line}` }}
              >
                <Flame size={14} color={C.crimson} />
                <span className="text-xs font-bold" style={{ color: C.ink }}>Disiplin & Tangguh</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ PROFIL ============================ */}
      <section id="profil" className="max-w-6xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-14 items-start">
          <div data-reveal>
            <Eyebrow>Tentang Saya</Eyebrow>
            <h2 className="font-display font-semibold text-3xl sm:text-4xl leading-tight mb-5" style={{ color: C.ink }}>
              Berdedikasi di Lapangan,
              <br />
              Berintegritas di Kehidupan.
            </h2>
            <p className="text-[15px] leading-relaxed mb-4" style={{ color: C.inkSoft }}>
              Saya Della Sugita, siswi SMA Negeri 12 Jakarta yang berdedikasi tinggi,
              pantang menyerah, dan memiliki passion mendalam di bidang olahraga futsal
              serta bercita-cita menjadi Polisi Wanita (Polwan).
            </p>
            <p className="text-[15px] leading-relaxed" style={{ color: C.inkSoft }}>
              Bagi saya, lapangan futsal bukan sekadar arena bertanding — melainkan
              tempat menempa kedisiplinan, kerja sama, dan mental juara yang saya bawa
              ke setiap aspek kehidupan saya.
            </p>
          </div>

          <div
            data-reveal
            className="rounded-3xl overflow-hidden"
            style={{ background: C.surface, border: `1px solid ${C.line}` }}
          >
            {QUICK_FACTS.map((fact, i) => {
              const Icon = fact.icon;
              return (
                <div
                  key={fact.label}
                  className="fact-row flex items-center gap-4 px-6 py-4.5 py-5"
                  style={{ borderBottom: i < QUICK_FACTS.length - 1 ? `1px solid ${C.line}` : "none" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: C.peachSoft, color: C.crimsonDeep }}
                  >
                    <Icon size={17} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.1em] uppercase" style={{ color: C.inkFaint }}>
                      {fact.label}
                    </p>
                    <p className="text-[15px] font-semibold" style={{ color: C.ink }}>
                      {fact.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ PERJUANGAN ============================ */}
      <section id="perjuangan" className="py-20 md:py-28" style={{ background: C.bgAlt }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-14" data-reveal>
            <Eyebrow>Kisah Perjuangan</Eyebrow>
            <h2 className="font-display font-semibold text-3xl sm:text-4xl leading-tight" style={{ color: C.ink }}>
              Enam Tahun Konsisten di Atas Lapangan
            </h2>
          </div>

          <div className="grid md:grid-cols-[1fr_1fr] gap-10 items-stretch">
            {/* Timeline */}
            <div data-reveal className="space-y-0">
              {TIMELINE.map((item, i) => (
                <div key={item.step} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0"
                      style={{ background: C.crimson, color: "#fff" }}
                    >
                      {i + 1}
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className="w-px flex-1 my-1" style={{ background: C.line, minHeight: "2.5rem" }} />
                    )}
                  </div>
                  <div className="pb-9">
                    <p className="text-[11px] font-bold tracking-[0.14em] uppercase mb-1" style={{ color: C.gold }}>
                      {item.step}
                    </p>
                    <p className="font-display font-semibold text-lg mb-1.5" style={{ color: C.ink }}>
                      {item.title}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: C.inkSoft }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Featured story card */}
            <div
              data-reveal
              className="rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between"
              style={{ background: `linear-gradient(160deg, ${C.crimsonDeep} 0%, ${C.crimson} 100%)`, color: "#fff" }}
            >
              <div
                className="absolute -right-10 -top-10 w-44 h-44 rounded-full"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.14)" }}>
                  <Award size={13} /> Momen Panggilan Garuda
                </div>
                <p className="font-display italic text-lg sm:text-xl leading-relaxed mb-6" style={{ color: C.peachSoft }}>
                  "Sejak kelas 7 SMP hingga duduk di kelas 12 SMA, saya secara konsisten
                  mengasah kemampuan di lapangan futsal hingga tumbuh menjadi pemain
                  istimewa yang serba bisa — baik sebagai flank yang lincah membongkar
                  pertahanan lawan, maupun sebagai pivot yang tajam di lini depan."
                </p>
                <p className="text-sm leading-relaxed opacity-90">
                  Dedikasi dan kerja keras saya selama enam tahun tersebut akhirnya
                  berbuah manis ketika saya menerima surat resmi berlogo Garuda yang
                  memanggil saya untuk mengikuti seleksi Tim Nasional Futsal Putri U-19
                  — sebuah awal dari mimpi besar saya untuk membela negara di kancah
                  internasional.
                </p>
              </div>
              <div className="relative flex items-center gap-2 mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.18)" }}>
                <CheckCircle2 size={16} />
                <span className="text-xs font-semibold tracking-wide">Terverifikasi — Surat Seleksi Timnas U-19</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ MOTIVASI & CITA-CITA ============================ */}
      <section id="motivasi" className="max-w-6xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <div className="max-w-2xl mb-14" data-reveal>
          <Eyebrow>Motivasi & Cita-Cita</Eyebrow>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl leading-tight" style={{ color: C.ink }}>
            Dari Bismillah Sampai Alhamdulillah
          </h2>
        </div>

        <div
          data-reveal
          className="rounded-3xl p-8 sm:p-14 text-center mb-14 relative overflow-hidden"
          style={{ background: `linear-gradient(160deg, ${C.crimsonDeep} 0%, ${C.crimson} 100%)` }}
        >
          <div
            className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />
          <Quote size={30} color={C.peach} className="mx-auto mb-6 relative" />
          <p className="font-display italic text-2xl sm:text-3xl leading-snug max-w-2xl mx-auto relative" style={{ color: "#fff" }}>
            "Tidak ada hidup tanpa masalah, dan tidak ada usaha tanpa rasa lelah. Tetap
            semangat dari Bismillah sampai Alhamdulillah."
          </p>
          <p className="mt-6 text-xs font-semibold tracking-[0.18em] uppercase relative" style={{ color: C.peachSoft }}>
            — Della Sugita
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {GOALS.map((g, i) => {
            const Icon = g.icon;
            return (
              <div
                key={g.title}
                data-reveal
                style={{ transitionDelay: `${i * 100}ms`, background: C.surface, border: `1px solid ${C.line}` }}
                className="rounded-3xl p-7 sm:p-8"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: C.peachSoft }}
                >
                  <Icon size={20} color={C.crimsonDeep} />
                </div>
                <p className="font-display font-semibold text-xl mb-2.5" style={{ color: C.ink }}>
                  {g.title}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: C.inkSoft }}>
                  {g.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================ KEAHLIAN & KARAKTER ============================ */}
      <section id="posisi" className="py-20 md:py-28" style={{ background: C.bgAlt }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-14" data-reveal>
            <Eyebrow>Keahlian & Karakter</Eyebrow>
            <h2 className="font-display font-semibold text-3xl sm:text-4xl leading-tight" style={{ color: C.ink }}>
              Nilai yang Sama Kuatnya di Dalam dan Luar Lapangan
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed" style={{ color: C.inkSoft }}>
              Karakter dan kedisiplinan saya terbentuk lewat peran saya di lapangan futsal — flank dan pivot — namun terus saya bawa ke setiap aspek kehidupan.
            </p>
          </div>

          <div className="grid md:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
            <div
              data-reveal
              className="rounded-3xl p-6 sm:p-8 aspect-square max-w-md mx-auto w-full"
              style={{ background: C.surface, border: `1px solid ${C.line}` }}
            >
              <CourtDiagram activeKey={selectedRole} />
            </div>

            <div data-reveal>
              <div className="flex gap-3 mb-6">
                {Object.entries(ROLES).map(([key, r]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedRole(key)}
                    className="role-card flex-1 rounded-2xl px-5 py-4 text-left"
                    style={{
                      background: selectedRole === key ? C.crimson : C.surface,
                      border: `1.5px solid ${selectedRole === key ? C.crimson : C.line}`,
                      boxShadow: selectedRole === key ? "0 16px 30px -16px rgba(168,31,61,0.55)" : "none",
                    }}
                  >
                    <span
                      className="font-display font-bold text-lg block"
                      style={{ color: selectedRole === key ? "#fff" : C.ink }}
                    >
                      {r.name}
                    </span>
                    <span
                      className="text-xs font-medium block mt-0.5"
                      style={{ color: selectedRole === key ? "rgba(255,255,255,0.85)" : C.inkFaint }}
                    >
                      {r.tagline}
                    </span>
                  </button>
                ))}
              </div>

              <div className="rounded-3xl p-6 sm:p-7" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
                <p className="text-[15px] leading-relaxed mb-5" style={{ color: C.inkSoft }}>
                  {role.desc}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {role.traits.map((trait) => (
                    <span
                      key={trait}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold"
                      style={{ background: C.peachSoft, color: C.crimsonDeep }}
                    >
                      <Target size={12} /> {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Core values */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-16">
            {CORE_VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  data-reveal
                  style={{ transitionDelay: `${i * 80}ms`, background: C.surface, border: `1px solid ${C.line}` }}
                  className="value-card rounded-3xl p-6"
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: C.crimson }}
                  >
                    <Icon size={18} color="#fff" />
                  </div>
                  <p className="font-display font-semibold text-[15px] mb-2" style={{ color: C.ink }}>
                    {v.title}
                  </p>
                  <p className="text-[13px] leading-relaxed" style={{ color: C.inkSoft }}>
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ TUGAS PKWU ============================ */}
      <section id="tugas" className="max-w-6xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <div className="max-w-2xl mb-14" data-reveal>
          <Eyebrow>Ruang Sekolah</Eyebrow>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl leading-tight" style={{ color: C.ink }}>
            Pengumpulan Tugas PKWU
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed" style={{ color: C.inkSoft }}>
            Isi form berikut untuk mengumpulkan tugas PKWU.
            Unggah file tugas atau gambar pendukung agar guru bisa memeriksa dengan lebih mudah.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-start">
          {/* Form */}
          <div
            data-reveal
            className="rounded-3xl p-6 sm:p-8"
            style={{ background: C.surface, border: `1px solid ${C.line}` }}
          >
            {!isAdmin ? (
              <>
                <div className="mb-5">
                  <p className="text-sm leading-relaxed" style={{ color: C.inkSoft }}>
                    Hanya admin yang dapat mengunggah tugas. Masuk sebagai admin di bawah ini untuk menambah tugas baru.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase mb-1.5" style={{ color: C.inkFaint }}>
                    Password Admin
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Masukkan password admin"
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: C.bgAlt, border: `1px solid ${C.line}`, color: C.ink }}
                  />
                </div>

                {adminError && (
                  <p className="text-xs font-semibold mb-4" style={{ color: C.crimson }}>
                    {adminError}
                  </p>
                )}

                <button
                  onClick={handleAdminLogin}
                  className="btn-primary w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm"
                  style={{ background: C.crimson, color: "#fff", boxShadow: "0 14px 30px -14px rgba(168,31,61,0.65)" }}
                >
                  Masuk Admin
                </button>
              </>
            ) : (
              <>
                <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-sm leading-relaxed" style={{ color: C.inkSoft }}>
                    Admin mode aktif. Unggah file tugas langsung dari komputer Anda.
                  </p>
                  <button
                    onClick={handleAdminLogout}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                    style={{ background: C.bgAlt, color: C.crimson, border: `1px solid ${C.line}` }}
                  >
                    Keluar Admin
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase mb-1.5" style={{ color: C.inkFaint }}>
                      Nama Siswa
                    </label>
                    <input
                      type="text"
                      value={taskForm.nama}
                      onChange={handleTaskField("nama")}
                      placeholder="Nama lengkap"
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: C.bgAlt, border: `1px solid ${C.line}`, color: C.ink }}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase mb-1.5" style={{ color: C.inkFaint }}>
                      Kelas
                    </label>
                    <input
                      type="text"
                      value={taskForm.kelas}
                      onChange={handleTaskField("kelas")}
                      placeholder="Contoh: XII IPS 2"
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: C.bgAlt, border: `1px solid ${C.line}`, color: C.ink }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase mb-1.5" style={{ color: C.inkFaint }}>
                    Judul Tugas
                  </label>
                  <input
                    type="text"
                    value={taskForm.judul}
                    onChange={handleTaskField("judul")}
                    placeholder="Contoh: Proposal Usaha Kerajinan"
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: C.bgAlt, border: `1px solid ${C.line}`, color: C.ink }}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase mb-1.5" style={{ color: C.inkFaint }}>
                    File / Gambar Tugas
                  </label>
                  <input
                    type="file"
                    onChange={handleTaskFileChange}
                    accept=".pdf,.doc,.docx,.zip,.rar,.png,.jpg,.jpeg,.gif,.webp"
                    className="w-full text-sm outline-none"
                    style={{ color: C.ink }}
                  />
                  {taskFile && (
                    <p className="text-xs mt-2" style={{ color: C.inkFaint }}>
                      File terpilih: {taskFile.name}
                    </p>
                  )}
                </div>

                <div className="mb-5">
                  <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase mb-1.5" style={{ color: C.inkFaint }}>
                    Catatan (opsional)
                  </label>
                  <textarea
                    value={taskForm.catatan}
                    onChange={handleTaskField("catatan")}
                    placeholder="Catatan tambahan untuk guru..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                    style={{ background: C.bgAlt, border: `1px solid ${C.line}`, color: C.ink }}
                  />
                </div>

                {taskError && (
                  <p className="text-xs font-semibold mb-4" style={{ color: C.crimson }}>
                    {taskError}
                  </p>
                )}

                <button
                  onClick={handleTaskSubmit}
                  className="btn-primary w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm"
                  style={{ background: C.crimson, color: "#fff", boxShadow: "0 14px 30px -14px rgba(168,31,61,0.65)" }}
                >
                  <Send size={16} /> Unggah Tugas
                </button>
              </>
            )}
          </div>

          {/* Submitted list */}
          <div data-reveal>
            <div className="flex items-center gap-2 mb-5">
              <ClipboardList size={16} color={C.crimsonDeep} />
              <p className="text-sm font-semibold" style={{ color: C.ink }}>
                Tugas Terkumpul ({submissions.length})
              </p>
            </div>

            {submissions.length === 0 ? (
              <div
                className="rounded-3xl p-10 text-center"
                style={{ background: C.bgAlt, border: `1px dashed ${C.line}` }}
              >
                <ClipboardList size={28} color={C.inkFaint} className="mx-auto mb-3" />
                <p className="text-sm" style={{ color: C.inkFaint }}>
                  Belum ada tugas yang dikumpulkan.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {submissions.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-2xl p-5 relative"
                    style={{
                      background: C.surface,
                      border: `1px solid ${justSubmittedId === s.id ? C.crimson : C.line}`,
                      boxShadow: justSubmittedId === s.id ? "0 14px 30px -18px rgba(168,31,61,0.5)" : "none",
                      transition: "border-color 300ms ease, box-shadow 300ms ease",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <p className="font-display font-semibold text-[15px] truncate" style={{ color: C.ink }}>
                          {s.judul}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: C.inkFaint }}>
                          {s.nama} · Kelas {s.kelas}
                        </p>
                      </div>
                      <button
                        onClick={() => handleTaskDelete(s.id)}
                        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: C.peachSoft }}
                        aria-label="Hapus tugas"
                      >
                        <Trash2 size={14} color={C.crimsonDeep} />
                      </button>
                    </div>

                    {s.catatan && (
                      <p className="text-xs leading-relaxed mb-2" style={{ color: C.inkSoft }}>
                        {s.catatan}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-3 mt-3 pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
                      {s.file_url ? (
                      (() => {
                        const isImage = /\.(png|jpe?g|gif|webp)$/i.test(s.file_name || "");
                        return isImage ? (
                          <div className="space-y-2">
                            <img
                              src={s.file_url}
                              alt={s.file_name || "Preview tugas"}
                              className="rounded-2xl max-h-40 object-contain border"
                              style={{ borderColor: C.line }}
                            />
                            <a
                              href={s.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold"
                              style={{ color: C.crimsonDeep }}
                            >
                              <Paperclip size={12} /> {s.file_name || "Lihat file"}
                            </a>
                          </div>
                        ) : (
                          <a
                            href={s.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold"
                            style={{ color: C.crimsonDeep }}
                          >
                            <Paperclip size={12} /> {s.file_name || "Lihat file"}
                          </a>
                        );
                      })()
                    ) : (
                      <span className="text-xs" style={{ color: C.inkFaint }}>
                        File tidak tersedia
                      </span>
                    )}
                      <span className="text-[11px]" style={{ color: C.inkFaint }}>
                        {s.waktu.toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================ KONTAK / FOOTER ============================ */}
      <footer id="kontak" className="py-20 md:py-28" style={{ background: C.crimsonDeep }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-[1fr_1fr] gap-14 items-start">
            <div data-reveal>
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-semibold tracking-[0.14em] uppercase"
                style={{ background: "rgba(255,255,255,0.1)", color: C.peachSoft }}
              >
                <Sparkles size={13} /> Let's Connect
              </div>
              <h2 className="font-display font-semibold text-3xl sm:text-4xl leading-tight mb-5" style={{ color: "#fff" }}>
                Terbuka Untuk Kolaborasi
                <br />
                & Peluang Baru
              </h2>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: "rgba(255,255,255,0.75)" }}>
                Baik untuk peluang tim, liputan media, maupun sekadar menyapa dan
                memberi semangat — jangan ragu untuk menghubungi.
              </p>
            </div>

            <div data-reveal className="space-y-3">
              {CONTACT_METHODS.map((c) => {
                const Icon = c.icon;
                const isCopied = copiedField === c.label;
                return (
                  <button
                    key={c.label}
                    onClick={() => handleCopy(c.value, c.label)}
                    className="contact-btn w-full flex items-center justify-between gap-4 px-5 py-4 rounded-2xl text-left"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)" }}
                  >
                    <span className="flex items-center gap-3.5 min-w-0">
                      <span
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(255,255,255,0.1)" }}
                      >
                        <Icon size={16} color={C.peachSoft} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] font-semibold tracking-[0.1em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
                          {c.label}
                        </span>
                        <span className="block text-sm font-semibold truncate" style={{ color: "#fff" }}>
                          {c.value}
                        </span>
                      </span>
                    </span>
                    <span className="shrink-0">
                      {isCopied ? (
                        <Check size={17} color="#fff" />
                      ) : (
                        <Copy size={17} color="rgba(255,255,255,0.55)" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-16 pt-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.14)" }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-xs"
                style={{ background: "#fff", color: C.crimson }}
              >
                DS
              </span>
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                Della Sugita — Futsal Player & Calon Polwan
              </span>
            </div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              Bismillah sampai Alhamdulillah.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
