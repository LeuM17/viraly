import { useState, useEffect, useRef } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────
const TONES = ["Hype 🔥", "Funny 😂", "Inspirational ✨", "Professional 💼", "Casual 😎"];
const PLATFORMS = ["Instagram", "TikTok"];
const NICHES = ["Restaurant / Food", "Fashion / Beauty", "Fitness", "Real Estate", "Creator / Influencer", "Retail / Shop", "Other"];
const LENGTHS = ["Short", "Medium", "Long"];
const LANGUAGES = ["English", "Spanish", "French", "Portuguese", "German", "Italian", "Arabic", "Hindi"];

const FEATURES = [
  { icon: "⚡", title: "Instant AI Captions", desc: "Generate 3 unique captions in seconds. No more staring at a blank screen." },
  { icon: "🌍", title: "8 Languages", desc: "Reach global audiences. Generate captions in English, Spanish, French, Portuguese and more." },
  { icon: "🎯", title: "Platform-Optimized", desc: "TikTok hooks, Instagram vibes. Each caption is crafted for the platform's unique style." },
  { icon: "👤", title: "Bio Generator", desc: "Craft the perfect profile bio that converts visitors into followers in seconds." },
  { icon: "📏", title: "Length Control", desc: "Short punchy or long storytelling — you choose exactly how long your caption should be." },
  { icon: "❤️", title: "Save Favorites", desc: "Never lose a great caption. Save your best ones and access them anytime." },
];

const TESTIMONIALS = [
  { name: "Sofia M.", role: "Fashion Creator", avatar: "S", text: "Viraly saves me 2 hours every single day. My engagement went up 40% in the first month.", stars: 5 },
  { name: "James T.", role: "Restaurant Owner", avatar: "J", text: "I'm not a writer, but Viraly makes me sound like one. My Instagram has never looked better.", stars: 5 },
  { name: "Priya K.", role: "Fitness Coach", avatar: "P", text: "The TikTok captions are insane. Hook-driven, viral-ready. I gained 10k followers in 3 weeks.", stars: 5 },
];

// ── API ───────────────────────────────────────────────────────────────────────
async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.map(b => b.text || "").join("") || "";
}

async function generateCaptions({ platform, niche, topic, tone, customNiche, length, language }) {
  const nicheLabel = niche === "Other" ? customNiche : niche;
  const lg = { Short: "1-2 sentences max", Medium: "3-4 sentences", Long: "5-6 sentences with storytelling" }[length];
  const text = await callClaude(`Expert social media copywriter. Generate 3 distinct captions for ${platform} for ${nicheLabel}.
Topic: "${topic}" | Tone: ${tone} | Length: ${lg} | Language: ${language}
Rules: unique style each, write in ${language}, emojis, 5-8 hashtags at end, ${platform === "TikTok" ? "punchy hook-driven" : "visual community-focused"}.
Number 1. 2. 3., separate with ---. Return only captions.`);
  return text.split("---").map(c => c.replace(/^\d+\.\s*/, "").trim()).filter(Boolean);
}

async function generateBio({ platform, niche, customNiche, name, keywords, language }) {
  const nicheLabel = niche === "Other" ? customNiche : niche;
  const text = await callClaude(`Generate 3 distinct ${platform} bios for ${nicheLabel}.
Name: "${name}" | Keywords: "${keywords}" | Language: ${language}
Rules: unique each, in ${language}, max ${platform === "Instagram" ? "150" : "80"} chars, emojis, compelling.
Number 1. 2. 3., separate with ---. Return only bios.`);
  return text.split("---").map(b => b.replace(/^\d+\.\s*/, "").trim()).filter(Boolean);
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const G = {
  green: "#4ade80",
  greenDim: "rgba(74,222,128,0.15)",
  greenBorder: "rgba(74,222,128,0.3)",
  bg: "#060608",
  card: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.07)",
  text: "#f0f0f0",
  muted: "rgba(255,255,255,0.4)",
  faint: "rgba(255,255,255,0.07)",
};

const inp = { width:"100%", padding:"13px 16px", borderRadius:"12px", background:"rgba(255,255,255,0.05)", border:`1px solid ${G.border}`, color:G.text, fontFamily:"'DM Sans', sans-serif", fontSize:"15px", outline:"none", boxSizing:"border-box" };
const sel = { ...inp, cursor:"pointer", appearance:"none" };
const lbl = { fontSize:"11px", fontWeight:"700", letterSpacing:"0.1em", color:G.muted, textTransform:"uppercase", display:"block", marginBottom:"10px" };

// ── Components ────────────────────────────────────────────────────────────────

function Logo({ size = 28 }) {
  return (
    <span style={{ fontFamily:"'Syne', sans-serif", fontSize:`${size}px`, fontWeight:"800", letterSpacing:"-0.5px" }}>
      <span style={{ color:"#fff" }}>Vir</span><span style={{ color:G.green }}>aly</span>
    </span>
  );
}

function NavBar({ page, setPage }) {
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:50, padding:"0 24px", height:"60px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(6,6,8,0.85)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${G.border}` }}>
      <div style={{ cursor:"pointer" }} onClick={() => setPage("home")}><Logo size={22} /></div>
      <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
        {["home","tool","pricing"].map(p => (
          <button key={p} onClick={() => setPage(p)} style={{ padding:"6px 14px", borderRadius:"8px", border:"none", background: page===p ? G.greenDim : "transparent", color: page===p ? G.green : G.muted, fontFamily:"'DM Sans', sans-serif", fontSize:"14px", fontWeight:"600", cursor:"pointer", textTransform:"capitalize" }}>
            {p === "home" ? "Home" : p === "tool" ? "Tool" : "Pricing"}
          </button>
        ))}
        <button onClick={() => setPage("tool")} style={{ marginLeft:"8px", padding:"8px 18px", borderRadius:"8px", border:"none", background:`linear-gradient(135deg, #4ade80, #22c55e)`, color:"#000", fontFamily:"'Syne', sans-serif", fontSize:"13px", fontWeight:"800", cursor:"pointer" }}>
          Try Free →
        </button>
      </div>
    </nav>
  );
}

function Stars({ n = 5 }) {
  return <span style={{ color:"#facc15", fontSize:"14px" }}>{"★".repeat(n)}</span>;
}

// ── Landing Page ──────────────────────────────────────────────────────────────
function HomePage({ setPage }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div style={{ paddingTop:"60px" }}>
      {/* Hero */}
      <section style={{ minHeight:"90vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"80px 24px 60px", position:"relative", overflow:"hidden" }}>
        {/* Glow */}
        <div style={{ position:"absolute", top:"10%", left:"50%", transform:"translateX(-50%)", width:"800px", height:"400px", background:"radial-gradient(ellipse, rgba(74,222,128,0.08) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:0, left:"20%", width:"300px", height:"300px", background:"radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)", pointerEvents:"none" }} />

        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition:"all 0.8s ease", maxWidth:"780px" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:G.greenDim, border:`1px solid ${G.greenBorder}`, borderRadius:"100px", padding:"6px 16px", marginBottom:"28px", fontSize:"13px", color:G.green, fontWeight:"600" }}>
            <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:G.green, display:"inline-block", animation:"pulse 2s infinite" }} />
            AI-Powered Social Media Tool
          </div>

          <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:"clamp(44px, 8vw, 80px)", fontWeight:"800", lineHeight:1.05, margin:"0 0 24px", letterSpacing:"-2px" }}>
            <span style={{ color:"#fff" }}>Stop Guessing.</span><br />
            <span style={{ background:`linear-gradient(135deg, ${G.green}, #86efac)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Start Going Viral.</span>
          </h1>

          <p style={{ fontSize:"clamp(16px, 2.5vw, 20px)", color:G.muted, lineHeight:1.7, margin:"0 0 40px", maxWidth:"560px", marginLeft:"auto", marginRight:"auto" }}>
            Viraly generates scroll-stopping captions and bios for Instagram & TikTok in seconds — powered by AI.
          </p>

          <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => setPage("tool")} style={{ padding:"16px 36px", borderRadius:"12px", border:"none", background:`linear-gradient(135deg, #4ade80, #22c55e)`, color:"#000", fontFamily:"'Syne', sans-serif", fontSize:"17px", fontWeight:"800", cursor:"pointer", boxShadow:"0 0 40px rgba(74,222,128,0.25)" }}>
              ⚡ Try Viraly Free
            </button>
            <button onClick={() => setPage("pricing")} style={{ padding:"16px 36px", borderRadius:"12px", border:`1px solid ${G.border}`, background:"transparent", color:G.muted, fontFamily:"'DM Sans', sans-serif", fontSize:"16px", fontWeight:"600", cursor:"pointer" }}>
              See Pricing →
            </button>
          </div>

          <p style={{ marginTop:"20px", fontSize:"13px", color:"rgba(255,255,255,0.25)" }}>No credit card required · 5 free captions daily</p>
        </div>
      </section>

      {/* Social proof strip */}
      <div style={{ borderTop:`1px solid ${G.border}`, borderBottom:`1px solid ${G.border}`, padding:"18px 24px", textAlign:"center", background:"rgba(255,255,255,0.015)" }}>
        <p style={{ margin:0, fontSize:"13px", color:G.muted }}>
          Trusted by <strong style={{ color:"#fff" }}>creators, restaurants, gyms, brands</strong> — generating captions in <strong style={{ color:G.green }}>8 languages</strong>
        </p>
      </div>

      {/* Features */}
      <section style={{ maxWidth:"1100px", margin:"0 auto", padding:"100px 24px" }}>
        <div style={{ textAlign:"center", marginBottom:"64px" }}>
          <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:"clamp(30px, 5vw, 48px)", fontWeight:"800", margin:"0 0 16px", color:"#fff" }}>Everything you need to go viral</h2>
          <p style={{ color:G.muted, fontSize:"17px", margin:0 }}>Built for creators, small businesses, and marketing teams.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:"16px" }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:"20px", padding:"28px", transition:"border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = G.greenBorder}
              onMouseLeave={e => e.currentTarget.style.borderColor = G.border}>
              <div style={{ fontSize:"32px", marginBottom:"14px" }}>{f.icon}</div>
              <h3 style={{ fontFamily:"'Syne', sans-serif", fontSize:"18px", fontWeight:"800", margin:"0 0 8px", color:"#fff" }}>{f.title}</h3>
              <p style={{ color:G.muted, fontSize:"14px", lineHeight:1.65, margin:0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background:"rgba(255,255,255,0.015)", borderTop:`1px solid ${G.border}`, borderBottom:`1px solid ${G.border}`, padding:"100px 24px" }}>
        <div style={{ maxWidth:"800px", margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:"clamp(28px, 5vw, 44px)", fontWeight:"800", margin:"0 0 60px", color:"#fff" }}>3 steps to go viral</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"32px" }}>
            {[
              { n:"01", title:"Pick your platform", desc:"Choose Instagram or TikTok and describe your niche." },
              { n:"02", title:"Describe your post", desc:"Tell Viraly what the post is about and pick your tone." },
              { n:"03", title:"Copy & post", desc:"Get 3 AI-generated captions instantly. Copy and go viral." },
            ].map((s, i) => (
              <div key={i} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Syne', sans-serif", fontSize:"48px", fontWeight:"800", color:G.greenBorder, marginBottom:"16px", lineHeight:1 }}>{s.n}</div>
                <h3 style={{ fontFamily:"'Syne', sans-serif", fontSize:"18px", fontWeight:"800", color:"#fff", margin:"0 0 10px" }}>{s.title}</h3>
                <p style={{ color:G.muted, fontSize:"14px", lineHeight:1.6, margin:0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ maxWidth:"1000px", margin:"0 auto", padding:"100px 24px" }}>
        <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:"clamp(28px, 5vw, 44px)", fontWeight:"800", textAlign:"center", margin:"0 0 60px", color:"#fff" }}>Loved by creators</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"16px" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:"20px", padding:"28px" }}>
              <Stars n={t.stars} />
              <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"15px", lineHeight:1.7, margin:"14px 0 20px" }}>"{t.text}"</p>
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <div style={{ width:"40px", height:"40px", borderRadius:"50%", background:`linear-gradient(135deg, ${G.green}, #22c55e)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne', sans-serif", fontSize:"16px", fontWeight:"800", color:"#000" }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight:"700", fontSize:"14px", color:"#fff" }}>{t.name}</div>
                  <div style={{ fontSize:"12px", color:G.muted }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"80px 24px", textAlign:"center", background:"rgba(74,222,128,0.03)", borderTop:`1px solid ${G.greenBorder}` }}>
        <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:"clamp(28px, 5vw, 48px)", fontWeight:"800", margin:"0 0 16px", color:"#fff" }}>Ready to go viral?</h2>
        <p style={{ color:G.muted, fontSize:"17px", margin:"0 0 36px" }}>Start free. No credit card needed.</p>
        <button onClick={() => setPage("tool")} style={{ padding:"18px 48px", borderRadius:"14px", border:"none", background:`linear-gradient(135deg, #4ade80, #22c55e)`, color:"#000", fontFamily:"'Syne', sans-serif", fontSize:"18px", fontWeight:"800", cursor:"pointer", boxShadow:"0 0 60px rgba(74,222,128,0.2)" }}>
          ⚡ Start for Free
        </button>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:`1px solid ${G.border}`, padding:"32px 24px", textAlign:"center" }}>
        <Logo size={20} />
        <p style={{ color:"rgba(255,255,255,0.2)", fontSize:"13px", margin:"12px 0 0" }}>© 2026 Viraly. All rights reserved.</p>
      </footer>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}

// ── Pricing Page ──────────────────────────────────────────────────────────────
function PricingPage({ setPage }) {
  const plans = [
    {
      name:"Free", price:0, desc:"Perfect for getting started",
      features:["5 captions per day","1 bio per day","English only","3 caption options","Basic tones"],
      locked:["Multiple languages","Save favorites","Unlimited generations","Priority speed"],
      cta:"Get Started Free", highlight:false,
    },
    {
      name:"Pro", price:12, desc:"For serious creators & businesses",
      features:["Unlimited captions","Unlimited bios","All 8 languages","Save favorites","All tones & lengths","Priority AI speed"],
      locked:[],
      cta:"Get Pro →", highlight:true,
    },
    {
      name:"Business", price:29, desc:"For agencies & teams",
      features:["Everything in Pro","Multiple brand profiles","Caption scheduler","3 team members","Analytics dashboard","Priority support"],
      locked:[],
      cta:"Get Business →", highlight:false,
    },
  ];

  return (
    <div style={{ paddingTop:"100px", minHeight:"100vh" }}>
      <div style={{ maxWidth:"1000px", margin:"0 auto", padding:"60px 24px" }}>
        <div style={{ textAlign:"center", marginBottom:"64px" }}>
          <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:"clamp(36px, 6vw, 56px)", fontWeight:"800", margin:"0 0 16px", color:"#fff" }}>Simple, honest pricing</h1>
          <p style={{ color:G.muted, fontSize:"17px", margin:0 }}>Start free. Upgrade when you're ready. Cancel anytime.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"16px", alignItems:"start" }}>
          {plans.map((plan, i) => (
            <div key={i} style={{ background: plan.highlight ? "rgba(74,222,128,0.05)" : G.card, border:`1px solid ${plan.highlight ? G.greenBorder : G.border}`, borderRadius:"24px", padding:"32px", position:"relative", transform: plan.highlight ? "scale(1.02)" : "scale(1)" }}>
              {plan.highlight && (
                <div style={{ position:"absolute", top:"-13px", left:"50%", transform:"translateX(-50%)", background:`linear-gradient(135deg, #4ade80, #22c55e)`, color:"#000", fontSize:"11px", fontWeight:"800", padding:"4px 16px", borderRadius:"100px", letterSpacing:"0.06em", whiteSpace:"nowrap" }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ marginBottom:"24px" }}>
                <div style={{ fontFamily:"'Syne', sans-serif", fontSize:"22px", fontWeight:"800", color:"#fff", marginBottom:"4px" }}>{plan.name}</div>
                <div style={{ color:G.muted, fontSize:"14px", marginBottom:"16px" }}>{plan.desc}</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:"4px" }}>
                  <span style={{ fontFamily:"'Syne', sans-serif", fontSize:"44px", fontWeight:"800", color: plan.highlight ? G.green : "#fff" }}>${plan.price}</span>
                  {plan.price > 0 && <span style={{ color:G.muted, fontSize:"15px" }}>/month</span>}
                </div>
              </div>

              <button onClick={() => setPage("tool")} style={{ width:"100%", padding:"14px", borderRadius:"12px", border: plan.highlight ? "none" : `1px solid ${G.border}`, background: plan.highlight ? `linear-gradient(135deg, #4ade80, #22c55e)` : "rgba(255,255,255,0.05)", color: plan.highlight ? "#000" : G.muted, fontFamily:"'Syne', sans-serif", fontSize:"15px", fontWeight:"800", cursor:"pointer", marginBottom:"24px" }}>
                {plan.cta}
              </button>

              <div style={{ borderTop:`1px solid ${G.border}`, paddingTop:"20px" }}>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
                    <span style={{ color:G.green, fontSize:"14px", flexShrink:0 }}>✓</span>
                    <span style={{ color:"rgba(255,255,255,0.75)", fontSize:"14px" }}>{f}</span>
                  </div>
                ))}
                {plan.locked.map((f, j) => (
                  <div key={j} style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px", opacity:0.35 }}>
                    <span style={{ color:G.muted, fontSize:"14px", flexShrink:0 }}>✕</span>
                    <span style={{ color:G.muted, fontSize:"14px" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginTop:"80px", maxWidth:"640px", margin:"80px auto 0" }}>
          <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:"28px", fontWeight:"800", textAlign:"center", margin:"0 0 40px", color:"#fff" }}>FAQ</h2>
          {[
            { q:"Can I cancel anytime?", a:"Yes. No contracts, no lock-in. Cancel with one click from your account settings." },
            { q:"Do I need a credit card to start?", a:"Nope. The free plan requires no payment info at all." },
            { q:"What languages are supported?", a:"Pro and Business plans support English, Spanish, French, Portuguese, German, Italian, Arabic, and Hindi." },
            { q:"How does the daily limit work?", a:"Free users get 5 captions and 1 bio per day. The counter resets at midnight." },
          ].map((faq, i) => (
            <div key={i} style={{ borderBottom:`1px solid ${G.border}`, padding:"20px 0" }}>
              <div style={{ fontFamily:"'Syne', sans-serif", fontSize:"16px", fontWeight:"700", color:"#fff", marginBottom:"8px" }}>{faq.q}</div>
              <div style={{ color:G.muted, fontSize:"14px", lineHeight:1.6 }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tool Page ─────────────────────────────────────────────────────────────────
function ToolPage() {
  const TABS = ["✍️ Captions", "👤 Bio Generator", "❤️ Saved"];
  const [tab, setTab] = useState("✍️ Captions");
  const plan = "free";

  const [captionsUsed, setCaptionsUsed] = useState(0);
  const [biosUsed, setBiosUsed] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("");

  const [platform, setPlatform] = useState("Instagram");
  const [niche, setNiche] = useState("Restaurant / Food");
  const [customNiche, setCustomNiche] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Casual 😎");
  const [length, setLength] = useState("Medium");
  const [language, setLanguage] = useState("English");
  const [captions, setCaptions] = useState([]);
  const [loadingCaptions, setLoadingCaptions] = useState(false);
  const [captionError, setCaptionError] = useState("");

  const [bioPlatform, setBioPlatform] = useState("Instagram");
  const [bioNiche, setBioNiche] = useState("Restaurant / Food");
  const [bioCustomNiche, setBioCustomNiche] = useState("");
  const [bioName, setBioName] = useState("");
  const [bioKeywords, setBioKeywords] = useState("");
  const [bioLanguage, setBioLanguage] = useState("English");
  const [bios, setBios] = useState([]);
  const [loadingBios, setLoadingBios] = useState(false);
  const [bioError, setBioError] = useState("");

  const [saved, setSaved] = useState([]);
  const [copied, setCopied] = useState(null);

  const triggerUpgrade = (reason) => { setUpgradeReason(reason); setShowUpgrade(true); };
  const handleCopy = (text, id) => { navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000); };
  const handleSave = (text, type) => {
    if (plan === "free") { triggerUpgrade("Save your best captions forever with Viraly Pro!"); return; }
    if (!saved.find(s => s.text === text)) setSaved(prev => [{ text, type, id: Date.now() }, ...prev]);
  };

  const handleGenerateCaptions = async () => {
    if (captionsUsed >= 5) { triggerUpgrade("You've used all 5 free captions today. Go unlimited with Viraly Pro!"); return; }
    if (!topic.trim()) { setCaptionError("Tell us what the post is about!"); return; }
    if (niche === "Other" && !customNiche.trim()) { setCaptionError("Please describe your niche!"); return; }
    if (plan === "free" && language !== "English") { triggerUpgrade(`Multi-language captions are a Pro feature. Upgrade to write in ${language}!`); return; }
    setCaptionError(""); setLoadingCaptions(true); setCaptions([]);
    try {
      const result = await generateCaptions({ platform, niche, topic, tone, customNiche, length, language });
      setCaptions(result); setCaptionsUsed(u => u + 1);
    } catch { setCaptionError("Something went wrong. Please try again."); }
    setLoadingCaptions(false);
  };

  const handleGenerateBios = async () => {
    if (biosUsed >= 1) { triggerUpgrade("Upgrade to Viraly Pro for unlimited bio generations!"); return; }
    if (!bioName.trim()) { setBioError("Enter your name or brand!"); return; }
    if (!bioKeywords.trim()) { setBioError("Add keywords about what you do!"); return; }
    if (plan === "free" && bioLanguage !== "English") { triggerUpgrade(`Multi-language bios are a Pro feature!`); return; }
    setBioError(""); setLoadingBios(true); setBios([]);
    try {
      const result = await generateBio({ platform: bioPlatform, niche: bioNiche, customNiche: bioCustomNiche, name: bioName, keywords: bioKeywords, language: bioLanguage });
      setBios(result); setBiosUsed(u => u + 1);
    } catch { setBioError("Something went wrong. Please try again."); }
    setLoadingBios(false);
  };

  const genBtn = (loading, maxed) => ({ width:"100%", padding:"15px", borderRadius:"12px", border:"none", background: loading ? "rgba(74,222,128,0.15)" : maxed ? G.faint : `linear-gradient(135deg, #4ade80, #22c55e)`, color: maxed ? G.muted : "#000", fontFamily:"'Syne', sans-serif", fontSize:"16px", fontWeight:"800", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading || maxed ? "none" : "0 6px 24px rgba(74,222,128,0.2)", transition:"all 0.2s" });
  const sBtn = (active, danger) => ({ padding:"7px 14px", borderRadius:"100px", border:"1px solid", borderColor: danger ? "rgba(248,113,113,0.2)" : active ? "rgba(74,222,128,0.4)" : G.border, background: danger ? "transparent" : active ? "rgba(74,222,128,0.1)" : G.faint, color: danger ? "rgba(248,113,113,0.7)" : active ? G.green : G.muted, fontFamily:"'DM Sans', sans-serif", fontSize:"13px", fontWeight:"600", cursor:"pointer", marginRight:"8px" });

  const PlatformToggle = ({ value, onChange }) => (
    <div style={{ display:"flex", gap:"8px", marginBottom:"20px" }}>
      {PLATFORMS.map(p => (
        <button key={p} onClick={() => onChange(p)} style={{ flex:1, padding:"11px", borderRadius:"10px", border:"1px solid", borderColor: value===p ? G.greenBorder : G.border, background: value===p ? G.greenDim : G.faint, color: value===p ? G.green : G.muted, fontFamily:"'DM Sans', sans-serif", fontSize:"14px", fontWeight:"600", cursor:"pointer" }}>
          {p === "Instagram" ? "📸 Instagram" : "🎵 TikTok"}
        </button>
      ))}
    </div>
  );

  const NicheSelect = ({ value, onChange, customValue, onCustomChange }) => (
    <div style={{ marginBottom:"18px" }}>
      <label style={lbl}>Niche</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={sel}>
        {NICHES.map(n => <option key={n} value={n} style={{ background:"#0d0d14" }}>{n}</option>)}
      </select>
      {value === "Other" && <input value={customValue} onChange={e => onCustomChange(e.target.value)} placeholder="Describe your niche..." style={{ ...inp, marginTop:"8px" }} />}
    </div>
  );

  const LanguageSelect = ({ value, onChange }) => (
    <div style={{ marginBottom:"18px" }}>
      <label style={lbl}>Language {plan==="free" && <span style={{ color:G.green, fontSize:"9px", background:G.greenDim, padding:"1px 6px", borderRadius:"4px", marginLeft:"6px" }}>PRO</span>}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={sel}>
        {LANGUAGES.map(l => <option key={l} value={l} style={{ background:"#0d0d14" }}>{l}{plan==="free" && l!=="English" ? " 🔒" : ""}</option>)}
      </select>
    </div>
  );

  const ResultCards = ({ items, type, loading }) => {
    if (loading) return <div style={{ textAlign:"center", padding:"40px", color:G.muted }}>✨ Viraly is working its magic...</div>;
    if (!items.length) return null;
    return (
      <div style={{ marginTop:"24px" }}>
        <h3 style={{ fontFamily:"'Syne', sans-serif", fontSize:"17px", fontWeight:"800", marginBottom:"14px", color:"#fff" }}>
          {type === "caption" ? "Your Captions ✨" : "Your Bios 👤"}
        </h3>
        {items.map((text, i) => {
          const id = `${type}-${i}-${text.slice(0,8)}`;
          const isSaved = !!saved.find(s => s.text === text);
          return (
            <div key={i} style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:"14px", padding:"20px", marginBottom:"10px" }}>
              <div style={{ fontSize:"10px", fontWeight:"700", letterSpacing:"0.1em", color:G.green, textTransform:"uppercase", marginBottom:"8px" }}>Option {i+1}</div>
              <p style={{ fontSize:"14px", lineHeight:1.75, color:"rgba(255,255,255,0.8)", margin:"0 0 12px", whiteSpace:"pre-wrap" }}>{text}</p>
              <button onClick={() => handleCopy(text, id)} style={sBtn(copied===id)}>{copied===id ? "✓ Copied!" : "Copy"}</button>
              <button onClick={() => handleSave(text, type)} style={sBtn(isSaved)}>{plan==="free" ? "🔒 Save (Pro)" : isSaved ? "❤️ Saved" : "Save"}</button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ paddingTop:"80px", minHeight:"100vh" }}>
      {/* Upgrade modal */}
      {showUpgrade && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", backdropFilter:"blur(12px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px" }}>
          <div style={{ background:"#0d0d14", border:`1px solid ${G.greenBorder}`, borderRadius:"24px", padding:"36px 28px", maxWidth:"460px", width:"100%", textAlign:"center" }}>
            <Logo size={24} />
            <div style={{ fontSize:"36px", margin:"16px 0 12px" }}>🚀</div>
            <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:"22px", fontWeight:"800", margin:"0 0 10px", color:"#fff" }}>Unlock Viraly Pro</h2>
            <p style={{ color:G.muted, fontSize:"14px", margin:"0 0 24px", lineHeight:1.6 }}>{upgradeReason}</p>
            <div style={{ display:"flex", gap:"10px", marginBottom:"20px" }}>
              <div style={{ flex:1, background:G.greenDim, border:`1px solid ${G.greenBorder}`, borderRadius:"14px", padding:"18px" }}>
                <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:"800", fontSize:"15px", color:G.green, marginBottom:"4px" }}>Pro</div>
                <div style={{ fontSize:"24px", fontWeight:"800", color:"#fff", marginBottom:"10px" }}>$12<span style={{ fontSize:"12px", color:G.muted, fontWeight:"400" }}>/mo</span></div>
                {["Unlimited captions","All languages","Save favorites","Bio generator"].map(f => (
                  <div key={f} style={{ fontSize:"12px", color:"rgba(255,255,255,0.6)", marginBottom:"4px", textAlign:"left" }}>✓ {f}</div>
                ))}
                <button style={{ marginTop:"12px", width:"100%", padding:"10px", borderRadius:"8px", border:"none", background:`linear-gradient(135deg, #4ade80, #22c55e)`, color:"#000", fontFamily:"'Syne', sans-serif", fontSize:"13px", fontWeight:"800", cursor:"pointer" }}>Get Pro →</button>
              </div>
              <div style={{ flex:1, background:G.card, border:`1px solid ${G.border}`, borderRadius:"14px", padding:"18px" }}>
                <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:"800", fontSize:"15px", color:G.muted, marginBottom:"4px" }}>Business</div>
                <div style={{ fontSize:"24px", fontWeight:"800", color:"#fff", marginBottom:"10px" }}>$29<span style={{ fontSize:"12px", color:G.muted, fontWeight:"400" }}>/mo</span></div>
                {["Everything in Pro","Team access","Scheduler","Analytics"].map(f => (
                  <div key={f} style={{ fontSize:"12px", color:"rgba(255,255,255,0.6)", marginBottom:"4px", textAlign:"left" }}>✓ {f}</div>
                ))}
                <button style={{ marginTop:"12px", width:"100%", padding:"10px", borderRadius:"8px", border:`1px solid ${G.border}`, background:"transparent", color:G.muted, fontFamily:"'Syne', sans-serif", fontSize:"13px", fontWeight:"700", cursor:"pointer" }}>Get Business</button>
              </div>
            </div>
            <button onClick={() => setShowUpgrade(false)} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.25)", fontSize:"13px", cursor:"pointer" }}>Continue with free</button>
          </div>
        </div>
      )}

      <div style={{ maxWidth:"680px", margin:"0 auto", padding:"32px 20px 80px" }}>
        {/* Usage */}
        <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:"14px", padding:"14px 18px", marginBottom:"16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
            <span style={{ fontSize:"12px", color:G.muted, fontWeight:"600" }}>FREE PLAN</span>
            <button onClick={() => triggerUpgrade("Unlock unlimited captions, all languages, and saving with Viraly Pro!")} style={{ padding:"5px 14px", borderRadius:"8px", border:"none", background:`linear-gradient(135deg, #4ade80, #22c55e)`, color:"#000", fontFamily:"'DM Sans', sans-serif", fontSize:"12px", fontWeight:"700", cursor:"pointer" }}>⚡ Upgrade</button>
          </div>
          {[{used: captionsUsed, limit: 5, label:"Captions"}, {used: biosUsed, limit: 1, label:"Bios"}].map(({used, limit, label}) => (
            <div key={label} style={{ marginBottom:"8px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                <span style={{ fontSize:"11px", color:G.muted }}>{label} today</span>
                <span style={{ fontSize:"11px", color: used>=limit ? "#f87171" : G.muted }}>{used}/{limit}</span>
              </div>
              <div style={{ height:"3px", background:G.faint, borderRadius:"100px" }}>
                <div style={{ height:"100%", width:`${Math.min((used/limit)*100,100)}%`, background: used>=limit ? "#f87171" : `linear-gradient(90deg, #4ade80, #22c55e)`, borderRadius:"100px" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:"4px", marginBottom:"18px", background:G.faint, borderRadius:"12px", padding:"4px" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:"9px 4px", borderRadius:"9px", border:"none", background: tab===t ? G.greenDim : "transparent", color: tab===t ? G.green : G.muted, fontFamily:"'DM Sans', sans-serif", fontSize:"12px", fontWeight:"600", cursor:"pointer" }}>{t}</button>
          ))}
        </div>

        {/* Captions */}
        {tab === "✍️ Captions" && (
          <>
            <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:"18px", padding:"24px" }}>
              <label style={lbl}>Platform</label>
              <PlatformToggle value={platform} onChange={setPlatform} />
              <NicheSelect value={niche} onChange={setNiche} customValue={customNiche} onCustomChange={setCustomNiche} />
              <div style={{ marginBottom:"18px" }}>
                <label style={lbl}>What's the post about?</label>
                <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. New summer menu launch, behind the scenes..." rows={3} style={{ ...inp, resize:"vertical", lineHeight:1.6 }} />
              </div>
              <div style={{ marginBottom:"18px" }}>
                <label style={lbl}>Tone</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
                  {TONES.map(t => (
                    <button key={t} onClick={() => setTone(t)} style={{ padding:"7px 12px", borderRadius:"100px", border:"1px solid", borderColor: tone===t ? G.greenBorder : G.border, background: tone===t ? G.greenDim : G.faint, color: tone===t ? G.green : G.muted, fontFamily:"'DM Sans', sans-serif", fontSize:"13px", fontWeight:"500", cursor:"pointer" }}>{t}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom:"18px" }}>
                <label style={lbl}>Length</label>
                <div style={{ display:"flex", gap:"8px" }}>
                  {LENGTHS.map(l => (
                    <button key={l} onClick={() => setLength(l)} style={{ flex:1, padding:"9px", borderRadius:"10px", border:"1px solid", borderColor: length===l ? G.greenBorder : G.border, background: length===l ? G.greenDim : G.faint, color: length===l ? G.green : G.muted, fontFamily:"'DM Sans', sans-serif", fontSize:"13px", fontWeight:"600", cursor:"pointer" }}>{l}</button>
                  ))}
                </div>
              </div>
              <LanguageSelect value={language} onChange={setLanguage} />
              {captionError && <p style={{ color:"#f87171", fontSize:"13px", margin:"0 0 14px" }}>{captionError}</p>}
              <button onClick={handleGenerateCaptions} disabled={loadingCaptions} style={genBtn(loadingCaptions, captionsUsed >= 5)}>
                {loadingCaptions ? "✨ Generating..." : captionsUsed >= 5 ? "🔒 Limit Reached — Upgrade" : "⚡ Generate Captions"}
              </button>
            </div>
            <ResultCards items={captions} type="caption" loading={loadingCaptions} />
            {captions.length > 0 && !loadingCaptions && (
              <button onClick={handleGenerateCaptions} style={{ marginTop:"8px", width:"100%", padding:"12px", borderRadius:"10px", border:`1px solid ${G.border}`, background:G.faint, color:G.muted, fontFamily:"'DM Sans', sans-serif", fontSize:"14px", fontWeight:"600", cursor:"pointer" }}>🔄 Regenerate</button>
            )}
          </>
        )}

        {/* Bio */}
        {tab === "👤 Bio Generator" && (
          <>
            <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:"18px", padding:"24px" }}>
              <label style={lbl}>Platform</label>
              <PlatformToggle value={bioPlatform} onChange={setBioPlatform} />
              <NicheSelect value={bioNiche} onChange={setBioNiche} customValue={bioCustomNiche} onCustomChange={setBioCustomNiche} />
              <div style={{ marginBottom:"18px" }}>
                <label style={lbl}>Name or Brand</label>
                <input value={bioName} onChange={e => setBioName(e.target.value)} placeholder="e.g. Bella's Bakery, John Fitness..." style={inp} />
              </div>
              <div style={{ marginBottom:"18px" }}>
                <label style={lbl}>What you offer / keywords</label>
                <input value={bioKeywords} onChange={e => setBioKeywords(e.target.value)} placeholder="e.g. handmade cakes, NYC delivery..." style={inp} />
              </div>
              <LanguageSelect value={bioLanguage} onChange={setBioLanguage} />
              {bioError && <p style={{ color:"#f87171", fontSize:"13px", margin:"0 0 14px" }}>{bioError}</p>}
              <button onClick={handleGenerateBios} disabled={loadingBios} style={genBtn(loadingBios, biosUsed >= 1)}>
                {loadingBios ? "✨ Crafting bios..." : biosUsed >= 1 ? "🔒 Limit Reached — Upgrade" : "⚡ Generate Bios"}
              </button>
            </div>
            <ResultCards items={bios} type="bio" loading={loadingBios} />
          </>
        )}

        {/* Saved */}
        {tab === "❤️ Saved" && (
          plan === "free" ? (
            <div style={{ background:G.card, border:`1px solid ${G.greenBorder}`, borderRadius:"18px", padding:"48px 28px", textAlign:"center" }}>
              <div style={{ fontSize:"32px", marginBottom:"12px" }}>🔒</div>
              <h3 style={{ fontFamily:"'Syne', sans-serif", fontSize:"18px", fontWeight:"800", margin:"0 0 8px", color:"#fff" }}>Pro Feature</h3>
              <p style={{ color:G.muted, fontSize:"14px", margin:"0 0 20px" }}>Save unlimited captions and bios with Viraly Pro.</p>
              <button onClick={() => triggerUpgrade("Upgrade to save unlimited captions and bios!")} style={{ padding:"12px 28px", borderRadius:"10px", border:"none", background:`linear-gradient(135deg, #4ade80, #22c55e)`, color:"#000", fontFamily:"'Syne', sans-serif", fontSize:"15px", fontWeight:"800", cursor:"pointer" }}>
                ⚡ Get Pro — $12/mo
              </button>
            </div>
          ) : saved.length === 0 ? (
            <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:"18px", padding:"48px", textAlign:"center" }}>
              <div style={{ fontSize:"32px", marginBottom:"12px" }}>❤️</div>
              <p style={{ color:G.muted, fontSize:"15px", margin:0 }}>No saved items yet. Hit "Save" on any result.</p>
            </div>
          ) : (
            saved.map(item => (
              <div key={item.id} style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:"14px", padding:"20px", marginBottom:"10px" }}>
                <div style={{ fontSize:"10px", fontWeight:"700", color:G.green, textTransform:"uppercase", marginBottom:"8px" }}>{item.type === "bio" ? "👤 Bio" : "✍️ Caption"}</div>
                <p style={{ fontSize:"14px", lineHeight:1.75, color:"rgba(255,255,255,0.8)", margin:"0 0 12px", whiteSpace:"pre-wrap" }}>{item.text}</p>
                <button onClick={() => handleCopy(item.text, `s-${item.id}`)} style={sBtn(copied===`s-${item.id}`)}>
                  {copied===`s-${item.id}` ? "✓ Copied!" : "Copy"}
                </button>
                <button onClick={() => setSaved(prev => prev.filter(s => s.id !== item.id))} style={sBtn(false, true)}>Remove</button>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  return (
    <div style={{ minHeight:"100vh", background:G.bg, color:G.text, fontFamily:"'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      <NavBar page={page} setPage={setPage} />
      {page === "home" && <HomePage setPage={setPage} />}
      {page === "tool" && <ToolPage />}
      {page === "pricing" && <PricingPage setPage={setPage} />}
    </div>
  );
}
