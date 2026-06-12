import React, { useState, useEffect } from "react";
import "./App.css";

// ============================================
// ERROR BOUNDARY - Production ready
// ============================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: "" };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error.message };
  }
  componentDidCatch(error, errorInfo) {
    console.error("App Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: 50, 
          textAlign: "center", 
          fontFamily: "'Inter', sans-serif",
          background: "#0A0F0D",
          minHeight: "100vh",
          color: "#E84A5F"
        }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>😵</div>
          <h2 style={{ marginBottom: 10 }}>Something went wrong</h2>
          <p style={{ color: "#7A9A7E", fontSize: 13, marginBottom: 24 }}>{this.state.errorMsg}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              background: "#1DB954", 
              border: "none", 
              borderRadius: 12, 
              padding: "12px 24px", 
              color: "#000", 
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            ↻ Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================
// THEMES
// ============================================
const THEMES = {
  dark: {
    green: "#1DB954", greenDark: "#17a349", bg: "#0A0F0D", surface: "#111A14", 
    card: "#162018", border: "#1E2E21", textPrimary: "#F0F7F1", textSecondary: "#7A9A7E", 
    textMuted: "#3E5E42", orange: "#E8854A", error: "#E84A5F",
  },
  light: {
    green: "#16A34A", greenDark: "#15803d", bg: "#F9FAFB", surface: "#FFFFFF", 
    card: "#FFFFFF", border: "#E5E7EB", textPrimary: "#111827", textSecondary: "#4B5563", 
    textMuted: "#9CA3AF", orange: "#EA580C", error: "#DC2626",
  }
};

// ============================================
// MOCK DATA
// ============================================
const playlists = [
  {
    id: 1, title: "Money Moves 💰", category: "Financial Literacy", books: 8, color: "#1DB954", 
    emoji: "💰", desc: "Master your finances and build wealth from scratch.",
    bookList: [
      { id: "book1", title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", progress: 72, pages: 336 },
      { id: "book2", title: "The Psychology of Money", author: "Morgan Housel", progress: 40, pages: 256 },
      { id: "book3", title: "Think and Grow Rich", author: "Napoleon Hill", progress: 0, pages: 320 },
    ],
  },
  {
    id: 2, title: "Build the Vision 🚀", category: "Entrepreneurship", books: 6, color: "#E8854A", 
    emoji: "🚀", desc: "From idea to execution — the founder's reading path.",
    bookList: [
      { id: "book4", title: "Zero to One", author: "Peter Thiel", progress: 55, pages: 224 },
      { id: "book5", title: "The Lean Startup", author: "Eric Ries", progress: 20, pages: 336 },
      { id: "book6", title: "Start with Why", author: "Simon Sinek", progress: 0, pages: 256 },
    ],
  },
  {
    id: 3, title: "Level Up ⚡", category: "Personal Development", books: 10, color: "#4A90E8", 
    emoji: "⚡", desc: "Habits, mindset, and discipline for the long game.",
    bookList: [
      { id: "book7", title: "Atomic Habits", author: "James Clear", progress: 88, pages: 320 },
      { id: "book8", title: "The 48 Laws of Power", author: "Robert Greene", progress: 30, pages: 480 },
      { id: "book9", title: "Deep Work", author: "Cal Newport", progress: 0, pages: 304 },
    ],
  },
  {
    id: 4, title: "Giants Walked Here 📖", category: "Biographies", books: 7, color: "#C86DD7", 
    emoji: "📖", desc: "The stories behind the people who changed the world.",
    bookList: [
      { id: "book10", title: "Long Walk to Freedom", author: "Nelson Mandela", progress: 15, pages: 656 },
      { id: "book11", title: "Shoe Dog", author: "Phil Knight", progress: 0, pages: 400 },
      { id: "book12", title: "Elon Musk", author: "Walter Isaacson", progress: 60, pages: 688 },
    ],
  },
];

const trendingBooks = [
  { title: "The Lean Startup", author: "Eric Ries", readers: "124 active", color: "#E8854A" },
  { title: "Zero to One", author: "Peter Thiel", readers: "98 active", color: "#1DB954" },
  { title: "Atomic Habits", author: "James Clear", readers: "215 active", color: "#4A90E8" },
  { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", readers: "180 active", color: "#C86DD7" },
];

const featuredBook = {
  id: "book7", title: "Atomic Habits", author: "James Clear", category: "Personal Development", 
  progress: 88, pages: 320, pagesRead: 282, chapter: "Chapter 14: How to Make Good Habits Inevitable",
};

const sampleText = `Every action you take is a vote for the type of person you wish to become. No single instance will transform your beliefs, but as the votes build up, so does the evidence of your new identity.

This is one reason why meaningful change does not require radical change. Small habits can make a meaningful difference by providing evidence of a new identity. And if a change is meaningful, it is actually big.

The goal is not to read a book, the goal is to become a reader. The goal is not to run a marathon, the goal is to become a runner.`;

// ============================================
// LOADING SKELETON COMPONENT
// ============================================
function SkeletonLoader({ colors }) {
  return (
    <div style={{ padding: "0 20px" }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ 
          background: colors.card, 
          borderRadius: 14, 
          padding: 16, 
          marginBottom: 10,
          animation: "pulse 1.5s ease-in-out infinite"
        }}>
          <div style={{ width: "80%", height: 20, background: colors.border, borderRadius: 8, marginBottom: 8 }} />
          <div style={{ width: "60%", height: 14, background: colors.border, borderRadius: 8 }} />
        </div>
      ))}
    </div>
  );
}

// ============================================
// CUSTOM SVG LOGO
// ============================================
const GrowstackLogo = ({ width = 40, height = 40 }) => (
  <svg width={width} height={height} viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gBlue" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#0052D4" /><stop offset="100%" stopColor="#001C88" /></linearGradient>
      <linearGradient id="sGreen" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#38EF7D" /><stop offset="100%" stopColor="#007A55" /></linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.4"/></filter>
    </defs>
    <g>
      <rect x="30" y="30" width="35" height="100" rx="17.5" fill="url(#gBlue)" />
      <rect x="30" y="30" width="90" height="35" rx="17.5" fill="url(#gBlue)" />
      <rect x="30" y="95" width="90" height="35" rx="17.5" fill="url(#gBlue)" />
      <rect x="70" y="62.5" width="50" height="35" rx="17.5" fill="url(#gBlue)" />
      <rect x="85" y="62.5" width="35" height="67.5" rx="17.5" fill="url(#gBlue)" />
    </g>
    <g filter="url(#shadow)">
      <rect x="135" y="30" width="85" height="35" rx="17.5" fill="url(#sGreen)" />
      <rect x="135" y="30" width="35" height="65" rx="17.5" fill="url(#sGreen)" />
      <rect x="135" y="62.5" width="85" height="35" rx="17.5" fill="url(#sGreen)" />
      <rect x="185" y="62.5" width="35" height="75" rx="17.5" fill="url(#sGreen)" />
      <rect x="50" y="120" width="170" height="45" rx="22.5" fill="url(#sGreen)" />
      <rect x="65" y="132" width="140" height="21" rx="10.5" fill="#FFFFFF" />
      <polygon points="115,142 135,142 135,185 125,175 115,185" fill="url(#gBlue)" />
    </g>
  </svg>
);

// ============================================
// ONBOARDING SCREEN
// ============================================
function OnboardingScreen({ onNext, colors }) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "Unlock Your Potential",
      body: "Curated learning paths designed to bridge the gap between classroom theory and industry mastery.",
    },
    {
      title: "Designed for Africa",
      body: "Optimized for low-data environments with offline access to your entire library of knowledge.",
    },
    {
      title: "Build Your Future",
      body: "Join thousands of youths mastering finance, entrepreneurship, and leadership to lead the continent.",
    },
  ];

  const s = steps[step];

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", display: "flex", flexDirection: "column", padding: "60px 28px 44px", fontFamily: "'Inter', sans-serif" }}>
      {/* Progress Dots */}
      <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
        {steps.map((_, i) => (
          <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i === step ? colors.green : colors.border, transition: "all .3s" }} />
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1 style={{ color: colors.textPrimary, fontSize: 36, fontWeight: 800, lineHeight: 1.1, margin: "0 0 20px" }}>{s.title}</h1>
        <p style={{ color: colors.textSecondary, fontSize: 16, lineHeight: 1.6, maxWidth: 300 }}>{s.body}</p>
      </div>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
        <button
          onClick={() => { if (step < 2) setStep(step + 1); else onNext("home"); }}
          style={{ background: colors.green, color: "#fff", border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer" }}
        >
          {step < 2 ? "Next" : "Get Started"}
        </button>
        {step < 2 && (
          <button onClick={() => onNext("home")} style={{ background: "transparent", color: colors.textMuted, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Skip to App
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================
// SCREENS
// ============================================

function HomeScreen({ navigate, colors, isDark, toggleTheme, readingProgress }) {
  const [greeting, setGreeting] = useState("Good morning");
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const minutesLeft = Math.round((featuredBook.pages - featuredBook.pagesRead) * 1.5);
  const streakDays = 12;

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", paddingBottom: 80, transition: "background 0.3s" }}>
      
      {/* PULL TO REFRESH INDICATOR */}
      {refreshing && (
        <div style={{ textAlign: "center", padding: "10px 0", color: colors.green, fontSize: 12 }}>
          🔄 Refreshing...
        </div>
      )}
      
      <div style={{ padding: "52px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <GrowstackLogo width={38} height={38} />
          <div>
            <h2 style={{ color: colors.textPrimary, margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em" }}>Growstack</h2>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={toggleTheme} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18 }}>
            {isDark ? "☀️" : "🌙"}
          </button>
          <div onClick={() => navigate("profile")} style={{ width: 40, height: 40, borderRadius: "50%", background: colors.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
            S
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px 0", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ color: colors.textSecondary, margin: 0, fontSize: 14 }}>{greeting}, <span style={{ color: colors.textPrimary, fontWeight: 700}}>Sam 👋</span></p>
        <div style={{ background: colors.green + "20", borderRadius: 20, padding: "4px 12px", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span>🔥</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: colors.green }}>{streakDays} day streak</span>
        </div>
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <p style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>Continue Reading</p>
        <div onClick={() => navigate("reader")} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 16, cursor: "pointer", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: `${featuredBook.progress}%`, height: 3, background: colors.green }} />
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 56, height: 78, borderRadius: 8, background: "linear-gradient(135deg, #1DB954, #0a5e28)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>⚡</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: colors.textPrimary, fontWeight: 700, fontSize: 15, margin: "0 0 4px" }}>{featuredBook.title}</p>
              <p style={{ color: colors.textSecondary, fontSize: 12, margin: "0 0 10px" }}>{featuredBook.author}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 4, background: colors.border, borderRadius: 2 }}>
                  <div style={{ width: `${featuredBook.progress}%`, height: "100%", background: colors.green, borderRadius: 2 }} />
                </div>
                <span style={{ color: colors.green, fontSize: 12, fontWeight: 700 }}>{featuredBook.progress}%</span>
              </div>
              <p style={{ color: colors.textMuted, fontSize: 11, marginTop: 8 }}>⏱️ ~{minutesLeft} min left</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Your Playlists</p>
          <span onClick={() => navigate("library")} style={{ color: colors.green, fontSize: 13, cursor: "pointer" }}>See all</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {playlists.map((pl) => (
            <div key={pl.id} onClick={() => navigate("playlist", pl)} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "transform 0.2s" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${pl.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{pl.emoji}</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: colors.textPrimary, fontWeight: 700, fontSize: 14, margin: "0 0 2px" }}>{pl.title}</p>
                <p style={{ color: colors.textSecondary, fontSize: 12, margin: 0 }}>{pl.books} books · {pl.category}</p>
              </div>
              <span style={{ color: colors.textMuted, fontSize: 18 }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlaylistScreen({ playlist, navigate, colors, readingProgress, saveProgress }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleStartPlaylist = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("reader");
    }, 500);
  };

  const handleDownload = () => {
    if (isDownloaded) return;
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setIsDownloaded(true);
    }, 1500);
  };

  const handleShare = () => {
    alert("✨ Share link copied! ✨\nInvite friends to join this playlist.");
  };

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", paddingBottom: 80 }}>
      <div style={{ padding: "52px 20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <button onClick={() => navigate("library")} style={{ background: "transparent", border: "none", color: colors.textSecondary, fontSize: 14, cursor: "pointer", padding: 0 }}>← Back</button>
          <button onClick={handleShare} style={{ background: "transparent", border: "none", color: colors.green, fontSize: 14, cursor: "pointer" }}>📤 Share</button>
        </div>
        <div style={{ width: 72, height: 72, borderRadius: 16, background: `${playlist.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: 16 }}>{playlist.emoji}</div>
        <h1 style={{ color: colors.textPrimary, fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>{playlist.title}</h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, margin: "0 0 6px" }}>{playlist.category} · {playlist.books} books</p>
        <p style={{ color: colors.textMuted, fontSize: 13, lineHeight: 1.6, margin: "0 0 20px" }}>{playlist.desc}</p>
        
        <div 
          onClick={handleDownload}
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, cursor: "pointer", opacity: isDownloaded ? 0.6 : 1 }}
        >
          <div style={{ width: 40, height: 24, borderRadius: 12, background: isDownloaded ? colors.green : colors.border, position: "relative", transition: "all 0.3s" }}>
            <div style={{ position: "absolute", top: 2, left: isDownloaded ? 18 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "all 0.3s" }} />
          </div>
          <span style={{ color: colors.textSecondary, fontSize: 13, fontWeight: 600 }}>
            {isDownloading ? "Downloading (12MB)..." : isDownloaded ? "Downloaded for offline" : "Download for offline"}
          </span>
        </div>

        <button
          onClick={handleStartPlaylist}
          disabled={isLoading}
          style={{ background: playlist.color, color: "#fff", border: "none", borderRadius: 12, padding: "14px 28px", fontSize: 15, fontWeight: 700, cursor: isLoading ? "wait" : "pointer", width: "100%", opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading ? "Loading..." : "▶ Start Playlist"}
        </button>
      </div>
      <div style={{ padding: "0 20px" }}>
        <p style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>Books in this playlist</p>
        {playlist.bookList.map((book, i) => (
          <div key={i} onClick={() => book.progress > 0 ? navigate("reader") : alert("✨ Start this book from the beginning! ✨")} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <p style={{ color: colors.textPrimary, fontWeight: 700, fontSize: 14, margin: "0 0 3px" }}>{book.title}</p>
                <p style={{ color: colors.textSecondary, fontSize: 12, margin: 0 }}>{book.author}</p>
              </div>
              <span style={{ color: book.progress > 0 ? playlist.color : colors.textMuted, fontSize: 12, fontWeight: 700 }}>
                {book.progress > 0 ? `${book.progress}%` : "Start"}
              </span>
            </div>
            {book.progress > 0 && (
              <div style={{ height: 3, background: colors.border, borderRadius: 2 }}>
                <div style={{ width: `${book.progress}%`, height: "100%", background: playlist.color, borderRadius: 2 }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function LibraryScreen({ navigate, colors }) {
  return (
    <div style={{ background: colors.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", paddingBottom: 80 }}>
      <div style={{ padding: "52px 20px 20px" }}>
        <h1 style={{ color: colors.textPrimary, fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>Library</h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, margin: "0 0 4px" }}>All your reading playlists</p>
        <p style={{ color: colors.textMuted, fontSize: 12, margin: "0 0 24px" }}>{playlists.length} playlists total</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {playlists.map((pl) => (
            <div key={pl.id} onClick={() => navigate("playlist", pl)} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 16, cursor: "pointer" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${pl.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 10 }}>{pl.emoji}</div>
              <p style={{ color: colors.textPrimary, fontWeight: 700, fontSize: 13, margin: "0 0 4px", lineHeight: 1.3 }}>{pl.title}</p>
              <p style={{ color: colors.textSecondary, fontSize: 11, margin: 0 }}>{pl.books} books</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExploreScreen({ navigate, colors }) {
  const categories = [
    { name: "Financial Literacy", emoji: "💰", color: "#1DB954", count: 24 },
    { name: "Entrepreneurship", emoji: "🚀", color: "#E8854A", count: 18 },
    { name: "Personal Growth", emoji: "⚡", color: "#4A90E8", count: 32 },
    { name: "Biographies", emoji: "📖", color: "#C86DD7", count: 15 },
  ];
  
  return (
    <div style={{ background: colors.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", paddingBottom: 80, overflowX: "hidden" }}>
      <div style={{ padding: "52px 20px 20px" }}>
        <h1 style={{ color: colors.textPrimary, fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>Explore</h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, margin: "0 0 24px" }}>Discover new knowledge paths</p>

        <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <span style={{ color: colors.textMuted, fontSize: 16 }}>🔍</span>
          <span style={{ color: colors.textMuted, fontSize: 14 }}>Search books, topics, authors...</span>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <p style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Trending at FUT Minna 🔥</p>
          </div>
          
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, msOverflowStyle: "none", scrollbarWidth: "none", width: "100vw", marginLeft: "-20px", paddingLeft: "20px", paddingRight: "20px" }}>
            {trendingBooks.map((book, i) => (
              <div key={i} onClick={() => navigate("reader")} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 14, padding: "16px", minWidth: 150, cursor: "pointer", flexShrink: 0 }}>
                <p style={{ color: colors.textPrimary, fontWeight: 700, fontSize: 13, margin: "0 0 6px", lineHeight: 1.3 }}>{book.title}</p>
                <p style={{ color: colors.textSecondary, fontSize: 11, margin: "0 0 12px" }}>{book.author}</p>
                <span style={{ color: book.color, fontSize: 10, fontWeight: 700, background: `${book.color}15`, padding: "4px 8px", borderRadius: 8 }}>{book.readers}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 14px" }}>Browse by Category</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {categories.map((cat, i) => (
            <div key={i} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 14, padding: "16px", cursor: "pointer" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{cat.emoji}</div>
              <p style={{ color: colors.textPrimary, fontWeight: 700, fontSize: 13, margin: "0 0 4px", lineHeight: 1.3 }}>{cat.name}</p>
              <p style={{ color: cat.color, fontSize: 11, margin: 0, fontWeight: 600 }}>{cat.count} books</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({ navigate, colors }) {
  const stats = [
    { label: "Books Read", value: "7", change: "+2 this month" },
    { label: "Reading Streak", value: "12d", change: "🔥 Best: 15d" },
    { label: "Hours Read", value: "34h", change: "≈ 4 books" },
  ];
  const achievements = [
    { name: "Early Adopter", unlocked: true, icon: "🏆" },
    { name: "7-Day Streak", unlocked: true, icon: "⚡" },
    { name: "10 Books", unlocked: false, icon: "📚" },
  ];
  return (
    <div style={{ background: colors.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", paddingBottom: 80 }}>
      <div style={{ padding: "52px 20px 24px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: colors.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 800, color: "#fff", margin: "0 auto 12px" }}>S</div>
        <h2 style={{ color: colors.textPrimary, fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>SAM (Kyng Tallext)</h2>
        <p style={{ color: colors.textSecondary, fontSize: 13, margin: "0 0 4px" }}>samuelowooluwa318@gmail.com</p>
        <p style={{ color: colors.textMuted, fontSize: 12, margin: "0 0 24px" }}>FUT Minna</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 28 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: "14px 8px" }}>
              <p style={{ color: colors.green, fontSize: 20, fontWeight: 800, margin: "0 0 2px" }}>{s.value}</p>
              <p style={{ color: colors.textSecondary, fontSize: 11, margin: "0 0 2px" }}>{s.label}</p>
              <p style={{ color: colors.textMuted, fontSize: 9, margin: 0 }}>{s.change}</p>
            </div>
          ))}
        </div>
        
        <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 14, padding: "16px", textAlign: "left", marginBottom: 12 }}>
          <p style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 14px" }}>Achievements</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "space-around" }}>
            {achievements.map((ach, i) => (
              <div key={i} style={{ textAlign: "center", opacity: ach.unlocked ? 1 : 0.3 }}>
                <div style={{ fontSize: 28 }}>{ach.icon}</div>
                <p style={{ color: colors.textSecondary, fontSize: 10, margin: "4px 0 0" }}>{ach.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 14, padding: "16px", textAlign: "left", marginBottom: 12 }}>
          <p style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 14px" }}>Current Plan</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: colors.textPrimary, fontWeight: 700, fontSize: 15, margin: "0 0 2px" }}>Growstack Free</p>
              <p style={{ color: colors.textSecondary, fontSize: 12, margin: 0 }}>2 playlists · Limited access</p>
            </div>
            <button style={{ background: colors.green, color: "#000", border: "none", borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Upgrade</button>
          </div>
        </div>

        <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 14, overflow: "hidden", textAlign: "left", marginTop: 12 }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
            <span style={{ color: colors.textPrimary, fontSize: 14 }}>App Version</span>
            <span style={{ color: colors.textMuted, fontSize: 12 }}>v2.0.0</span>
          </div>
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
            <span style={{ color: colors.textPrimary, fontSize: 14 }}>Logout</span>
            <span style={{ color: colors.error, fontSize: 14 }}>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReaderScreen({ navigate, colors, isDark, readingProgress, saveProgress }) {
  const [fontSize, setFontSize] = useState(16);
  const [showControls, setShowControls] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = readingProgress[featuredBook.id];
    return saved || Math.floor((featuredBook.progress / 100) * featuredBook.pages);
  });
  const [showAudio, setShowAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const readerBg = isDark ? "#0E1A10" : "#F8F9FA";
  const readerText = isDark ? "#C8DEC9" : "#374151";
  const totalPages = featuredBook.pages;

  // Save progress when page changes
  useEffect(() => {
    saveProgress(featuredBook.id, currentPage);
  }, [currentPage, saveProgress, featuredBook.id]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") setCurrentPage(prev => Math.max(1, prev - 1));
      if (e.key === "ArrowRight") setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [totalPages]);

  const progressPercent = Math.round((currentPage / totalPages) * 100);

  return (
    <div style={{ background: readerBg, minHeight: "100vh", fontFamily: "Georgia, serif", color: colors.textPrimary, position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "48px 20px 16px" }}>
        <button onClick={() => navigate("home")} style={{ background: "transparent", border: "none", color: colors.textSecondary, fontSize: 22, cursor: "pointer" }}>✕</button>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: colors.textSecondary, fontSize: 11, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>{featuredBook.title}</p>
          <p style={{ color: colors.textMuted, fontSize: 11, margin: 0 }}>{featuredBook.chapter}</p>
        </div>
        <button onClick={() => setShowControls(!showControls)} style={{ background: "transparent", border: "none", color: colors.textSecondary, fontSize: 18, cursor: "pointer" }}>Aa</button>
      </div>

      {showControls && (
        <div style={{ background: colors.card, margin: "0 20px 16px", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, border: `1px solid ${colors.border}` }}>
          <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} style={{ background: colors.border, border: "none", color: colors.textPrimary, borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18 }}>−</button>
          <span style={{ color: colors.textSecondary, fontSize: 13, flex: 1, textAlign: "center" }}>Font size: {fontSize}px</span>
          <button onClick={() => setFontSize(Math.min(24, fontSize + 2))} style={{ background: colors.border, border: "none", color: colors.textPrimary, borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18 }}>+</button>
        </div>
      )}

      <div style={{ padding: "0 20px 6px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, height: 2, background: colors.border, borderRadius: 2 }}>
          <div style={{ width: `${progressPercent}%`, height: "100%", background: colors.green }} />
        </div>
        <span style={{ color: colors.textMuted, fontSize: 11 }}>{currentPage}/{totalPages} pages</span>
      </div>

      <div className="reader-content" style={{ padding: "24px 28px 140px", lineHeight: 1.9, fontSize }}>
        <h3 style={{ color: colors.green, fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 20px" }}>{featuredBook.chapter}</h3>
        {sampleText.split("\n\n").map((p, i) => (
          <p key={i} style={{ color: readerText, margin: "0 0 20px", textAlign: "justify" }}>{p}</p>
        ))}
        <p style={{ color: readerText, margin: "0 0 20px", textAlign: "justify", fontStyle: "italic" }}>— Page {currentPage} —</p>
      </div>

      {!showAudio && (
        <button 
          onClick={() => setShowAudio(true)}
          style={{ position: "fixed", bottom: 80, right: 20, background: colors.green, color: "#fff", border: "none", borderRadius: 30, padding: "12px 20px", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.3)", cursor: "pointer", zIndex: 60 }}
        >
          🎧 Listen
        </button>
      )}

      {showAudio && (
        <div style={{ position: "fixed", bottom: 65, left: 20, right: 20, background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 16, padding: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", zIndex: 70 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <p style={{ color: colors.textPrimary, fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>Chapter 14 (Audio Preview)</p>
              <p style={{ color: colors.textSecondary, fontSize: 12, margin: 0 }}>James Clear · 12:45</p>
            </div>
            <button onClick={() => setShowAudio(false)} style={{ background: "transparent", border: "none", color: colors.textMuted, fontSize: 18, cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              style={{ width: 40, height: 40, borderRadius: "50%", background: colors.green, color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer", flexShrink: 0 }}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <div style={{ flex: 1, height: 24, display: "flex", alignItems: "center", gap: 2 }}>
              {[12, 18, 8, 24, 14, 20, 10, 16, 22, 12, 8, 18, 14, 20, 10].map((h, i) => (
                <div key={i} style={{ flex: 1, background: isPlaying ? colors.green : colors.border, height: isPlaying ? h : 4, borderRadius: 2, transition: "height 0.2s", opacity: i < 7 ? 1 : 0.3 }} />
              ))}
            </div>
            <span style={{ color: colors.textMuted, fontSize: 11, fontVariantNumeric: "tabular-nums" }}>12:45</span>
          </div>
        </div>
      )}

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: readerBg, borderTop: `1px solid ${colors.border}`, padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 50 }}>
        <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} style={{ background: "transparent", border: "none", color: currentPage === 1 ? colors.textMuted : colors.textSecondary, fontSize: 24, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}>‹ Prev</button>
        <span style={{ color: colors.green, fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>{progressPercent}% complete</span>
        <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} style={{ background: "transparent", border: "none", color: currentPage === totalPages ? colors.textMuted : colors.textSecondary, fontSize: 24, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}>Next ›</button>
      </div>
    </div>
  );
}

// ============================================
// BOTTOM NAVIGATION
// ============================================
function BottomNav({ current, navigate, colors }) {
  const tabs = [
    { 
      id: "home", 
      label: "Home",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ) 
    },
    { 
      id: "library", 
      label: "Library",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
          <path d="m16 6 4 14"></path>
          <path d="M12 6v14"></path>
          <path d="M8 8v12"></path>
          <path d="M4 4v16"></path>
        </svg>
      ) 
    },
    { 
      id: "explore", 
      label: "Explore",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      ) 
    },
    { 
      id: "profile", 
      label: "Profile",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ) 
    },
  ];
  
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: colors.surface, borderTop: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-around", padding: "10px 0 20px", zIndex: 100, transition: "background 0.3s" }}>
      {tabs.map((tab) => (
        <button 
          key={tab.id} 
          onClick={() => navigate(tab.id)} 
          style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "0 16px" }}
        >
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", color: current === tab.id ? colors.green : colors.textMuted, transition: "color 0.2s" }}>
            {tab.icon}
          </span>
          <span style={{ fontSize: 10, color: current === tab.id ? colors.green : colors.textMuted, fontFamily: "'Inter', sans-serif", fontWeight: current === tab.id ? 700 : 500, transition: "color 0.2s" }}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [screen, setScreen] = useState("onboarding");
  const [activeTab, setActiveTab] = useState("home");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [readingProgress, setReadingProgress] = useState(() => {
    const saved = localStorage.getItem("growstack_progress");
    return saved ? JSON.parse(saved) : {};
  });
  
  const currentColors = isDark ? THEMES.dark : THEMES.light;

  // Save progress to localStorage
  const saveProgress = (bookId, page) => {
    const newProgress = { ...readingProgress, [bookId]: page };
    setReadingProgress(newProgress);
    localStorage.setItem("growstack_progress", JSON.stringify(newProgress));
  };

  // Network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const navigate = (dest, data = null) => {
    if (dest === "playlist" && data) setSelectedPlaylist(data);
    if (["home", "library", "explore", "profile"].includes(dest)) setActiveTab(dest);
    setScreen(dest);
  };

  const toggleTheme = () => setIsDark(!isDark);
  const showNav = screen !== "reader" && screen !== "playlist" && screen !== "onboarding";

  return (
    <ErrorBoundary>
      {!isOnline && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, background: currentColors.orange, color: "#fff", textAlign: "center", padding: 4, fontSize: 11, zIndex: 200 }}>
          📡 Offline mode - saved content available
        </div>
      )}
      <div style={{ 
        maxWidth: 390, 
        margin: "0 auto", 
        minHeight: "100vh", 
        position: "relative", 
        overflow: "hidden", 
        boxShadow: "0 0 60px rgba(0,0,0,0.6)", 
        background: currentColors.bg,
        paddingTop: !isOnline ? 24 : 0
      }}>
        {screen === "onboarding" && <OnboardingScreen onNext={navigate} colors={currentColors} />}
        {screen === "home" && <HomeScreen navigate={navigate} colors={currentColors} isDark={isDark} toggleTheme={toggleTheme} readingProgress={readingProgress} />}
        {screen === "library" && <LibraryScreen navigate={navigate} colors={currentColors} />}
        {screen === "explore" && <ExploreScreen navigate={navigate} colors={currentColors} />}
        {screen === "profile" && <ProfileScreen navigate={navigate} colors={currentColors} />}
        {screen === "playlist" && selectedPlaylist && <PlaylistScreen playlist={selectedPlaylist} navigate={navigate} colors={currentColors} readingProgress={readingProgress} saveProgress={saveProgress} />}
        {screen === "reader" && <ReaderScreen navigate={navigate} colors={currentColors} isDark={isDark} readingProgress={readingProgress} saveProgress={saveProgress} />}
        {showNav && <BottomNav current={activeTab} navigate={navigate} colors={currentColors} />}
      </div>
    </ErrorBoundary>
  );
}