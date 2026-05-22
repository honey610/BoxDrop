
import React, { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import { Link } from "react-router-dom";
import BoxCard from "../component/BoxCard";
import api from "../api/api";
import hero from "../assets/hero.png";
import Footer from "../component/Footer";
import boxdropLogo from "../assets/pagelogo.png";
import "./Home.css";
import screenshot1 from "../assets/Screenshot 2026-01-16 124524.png";
import screenshot2 from "../assets/Screenshot 2026-01-16 124736.png"
import screenshot3 from "../assets/Screenshot 2026-01-16 124805.png"



function Home() {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [deferredPrompt, setDeferredPrompt] =  useState(null);



  

  // 🔹 Parallax hero effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroImg = document.querySelector(".hero-image");

      if (heroImg) {
        heroImg.style.transform = `
          translateY(${scrollY * 0.15}px)
          scale(${1 + scrollY * 0.0001})
        `;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
// const { scrollY } = useScroll();
// const heroY = useTransform(scrollY, [0, 400], [0, -60]);
// const heroScale = useTransform(scrollY, [0, 400], [1, 1.05]);

  // 🔹 Fetch boxes

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("📦 PWA install available");
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);
 
    const fetchBoxes = async () => {
      try {
        const res = await api.get("/boxes");
        setBoxes(res.data.boxes || []);
      } catch (err) {
        console.error("Failed to fetch boxes", err);
      } finally {
        setLoading(false);
      }
    };
 useEffect(() => {
    fetchBoxes();
  }, []);

  const handleInstall = async () => {
  console.log("Install clicked");
  console.log("DeferredPrompt:", deferredPrompt);

  if (!deferredPrompt) {
    console.log("❌ No install prompt available");
    return;
  }

  deferredPrompt.prompt();

  const choiceResult = await deferredPrompt.userChoice;
  console.log("User choice:", choiceResult);

  setDeferredPrompt(null);
};

  if (loading) {
    return <div className="page-center">Loading boxes...</div>;
  }

  const filteredBoxes = boxes.filter((box) =>
    box.title?.toLowerCase().includes(search.toLowerCase())
  );
const brands = [
  "Raycon",
  "Heinz To Home",
  "Staples",
  "JB Hi-Fi",
  "Crate and Barrel",
  "Carvana",
  "Wayfair",
  "Overstock",
  "BoxLunch",
  "Uncommon Goods",
  "ThinkGeek",
];


  return (
    <>
      <Navbar />
     
<div className="box">
      {/* HERO */}
      <section className="container hero-section">
        <div className="contain ">
 <div className="marquee">
      <div className="track">
        {[...brands, ...brands].map((brand, index) => (
          <span key={index} className="pill">
            {brand}
          </span>
        ))}
      </div>
    </div>
    </div>
        <div className="row">
          <div className="col-lg-9">
            <span className="hero-badge">
              #1 Marketplace for Subscription Boxes
            </span>

            <h1 className="hero-title">
              Unbox Your Next <span>Obsession</span>
            </h1>

            <p className="hero-subtitle">
              Discover curated monthly boxes for every passion.
            </p>

           

        <div className="row">
          <div className="col-xl-12">
            <div className="hero-image-container">
              <img
                src={hero}
                alt="Hero"
                className="hero-image img-fluid w-100"
              />
            </div>
          </div>
        </div>

        
          </div>
        </div>
      </section>
      
      <div className="hero-search d-flex mt-4 container ">
              <input
                type="text"
                className="form-control"
                placeholder="Search boxes"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn hero-btn">Explore</button>
            </div>
            {/* <motion.section
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
  className="hero-section"
>
  <motion.h1
    initial={{ y: 40, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.2 }}
  >
    Discover Subscription Boxes You’ll Love
  </motion.h1>

  <motion.p
    initial={{ y: 40, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.4 }}
  >
    Curated monthly boxes from trusted sellers
  </motion.p>
</motion.section> */}

           

      {/* FEATURED */}
      <section className="container py-5 mb-5">
         
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">Featured This Month</h2>
            <p className="text "style={{color:"white"}}>Hand-picked favorites trending now.</p>
          </div>
          <Link to="/browse" className="fw-semibold text-decoration-none">
            View All →
          </Link>
        </div>

        {filteredBoxes.length === 0 ? (
          <p className="text-muted">No boxes found.</p>
        ) : (
          <div className="row g-4">
            {filteredBoxes.slice(0, 6).map((box) => (
              <div className="col-md-6 col-lg-4" key={box._id}>
                <BoxCard box={box} />
              </div>
            ))}
          </div>
        )}
           </section>
        {/* <section className="container py-5 mb-5">
  <ScrollReveal>
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="fw-bold">Featured This Month</h2>
        <p className="text-white opacity-75">
          Hand-picked favorites trending now.
        </p>
      </div>
      <Link to="/browse" className="fw-semibold text-decoration-none">
        View All →
      </Link>
    </div>
  </ScrollReveal>

  <div className="row g-4">
    {filteredBoxes.slice(0, 6).map((box, i) => (
      <ScrollReveal key={box._id} delay={i * 0.08}>
        <div className="col-md-6 col-lg-4">
          <BoxCard box={box} />
        </div>
      </ScrollReveal>
    ))}
  </div>
</section> */}

   


       <section className="commerce-section">
      {/* Header */}
      <div className="commerce-header">
        <div className="brand">
          {/* <img src={boxdropLogo} alt="BoxDrop" /> */}
          <span>BoxDrop</span>
        </div>
          
        <h1>Sell, ship, and grow everywhere</h1>
        <p>
          BoxDrop helps creators launch and scale subscription boxes across
          channels — from discovery to delivery.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="commerce-features">
        <div className="feature-card">
          <img src={screenshot1} alt="" style={{width:"300px",height:"300px"}}/>
          <h4>In-person & Online</h4>
          <p>
            Manage subscriptions, inventory, and orders — online and offline.
          </p>
        </div>

        <div className="feature-card highlight">
           <img src={screenshot2} alt="" style={{width:"300px"}}/>
          <h4>Publish Across Channels</h4>
          <p>
            Reach customers via search, social media, and BoxDrop discovery.
          </p>
        </div>

        <div className="feature-card">
           <img src={screenshot3} alt="" style={{width:"300px"}}/>
          <h4>Seamless Checkout</h4>
          <p>
            Fast, secure checkout optimized for subscriptions and repeat orders.
          </p>
          {/* {["In-person & Online", "Publish Across Channels", "Seamless Checkout"].map(
  (title, i) => (
    <motion.div
      key={i}
      className="feature-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.1 }}
    >
      <h4>{title}</h4>
    </motion.div>
  )
)} */}
        </div>
      </div>

      {/* Hero Preview */}
      <div className="commerce-preview">
        <div className="preview-image">
          <span className="preview-tag">BOXDROP SHOWCASE</span>
          <h2>The Statement Box</h2>
          <button>Explore Boxes</button>
        </div>
      </div>
    </section>

    <button onClick={handleInstall} disabled={!deferredPrompt}>
        Install BoxDrop
      </button>

      <Footer />
      </div>
    </>
  );
}

export default Home;

// import React, { useEffect, useState } from "react";
// import Navbar from "../component/Navbar";
// import { Link } from "react-router-dom";
// import BoxCard from "../component/BoxCard";
// import api from "../api/api";
// import hero from "../assets/hero.png";
// import Footer from "../component/Footer";
// import boxdropLogo from "../assets/pagelogo.png";
// import "./home.css";
// import { motion, useScroll, useTransform } from "framer-motion";

// /* =========================
//    Shopify-style scroll data
// ========================= */
// const winterSteps = [
//   {
//     title: "Winter Wellness Box",
//     desc: "Self-care essentials curated for cold days.",
//     image: hero,
//   },
//   {
//     title: "Cozy Comfort Collection",
//     desc: "Warm, thoughtful items for everyday comfort.",
//     image: hero,
//   },
//   {
//     title: "Festive Surprise Box",
//     desc: "Limited-edition festive experiences.",
//     image: hero,
//   },
// ];

// function WinterSlide({ item, index, total }) {
//   const { scrollYProgress } = useScroll();

//   const start = index / total;
//   const end = (index + 1) / total;

//   const opacity = useTransform(
//     scrollYProgress,
//     [start, start + 0.08, end - 0.08, end],
//     [0, 1, 1, 0]
//   );

//   const y = useTransform(scrollYProgress, [start, end], [40, -40]);

//   return (
//     <motion.div className="winter-slide" style={{ opacity, y }}>
//       <div className="winter-text">
//         <h2>{item.title}</h2>
//         <p>{item.desc}</p>
//       </div>
//       <img src={item.image} alt={item.title} />
//     </motion.div>
//   );
// }

// function Home() {
//   const [boxes, setBoxes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [deferredPrompt, setDeferredPrompt] = useState(null);

//   /* Hero parallax */
//   const { scrollY } = useScroll();
//   const heroY = useTransform(scrollY, [0, 400], [0, -60]);
//   const heroScale = useTransform(scrollY, [0, 400], [1, 1.05]);

//   /* Fetch boxes */
//   useEffect(() => {
//     const fetchBoxes = async () => {
//       try {
//         const res = await api.get("/boxes");
//         setBoxes(res.data.boxes || []);
//       } catch (err) {
//         console.error("Failed to fetch boxes", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBoxes();
//   }, []);

//   /* PWA install */
//   useEffect(() => {
//     const handler = (e) => {
//       e.preventDefault();
//       setDeferredPrompt(e);
//     };
//     window.addEventListener("beforeinstallprompt", handler);
//     return () => window.removeEventListener("beforeinstallprompt", handler);
//   }, []);

//   const handleInstall = async () => {
//     if (!deferredPrompt) return;
//     deferredPrompt.prompt();
//     await deferredPrompt.userChoice;
//     setDeferredPrompt(null);
//   };

//   if (loading) return <div className="page-center">Loading boxes...</div>;

//   const filteredBoxes = boxes.filter((box) =>
//     box.title?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <>
//       <Navbar />

//       <div className="box">
//         {/* ================= HERO ================= */}
//         <section className="container hero-section">
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//           >
//             <span className="hero-badge">
//               #1 Marketplace for Subscription Boxes
//             </span>

//             <h1 className="hero-title">
//               Unbox Your Next <span>Obsession</span>
//             </h1>

//             <p className="hero-subtitle">
//               Discover curated monthly boxes for every passion.
//             </p>

//             <div className="hero-image-container">
//               <motion.img
//                 src={hero}
//                 alt="Hero"
//                 className="hero-image img-fluid w-100"
//                 style={{ y: heroY, scale: heroScale }}
//               />
//             </div>
//           </motion.div>
//         </section>

//         {/* ================= SEARCH ================= */}
//         <motion.div
//           className="hero-search d-flex mt-4 container"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//         >
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search boxes"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <button className="btn hero-btn">Explore</button>
//         </motion.div>

//         {/* ================= SHOPIFY WINTER SCROLL ================= */}
//         <section className="winter-scroll-section">
//           <div className="winter-sticky">
//             {winterSteps.map((item, index) => (
//               <WinterSlide
//                 key={index}
//                 item={item}
//                 index={index}
//                 total={winterSteps.length}
//               />
//             ))}
//           </div>
//         </section>

//         {/* ================= FEATURED ================= */}
//         <section className="container py-5">
//           <div className="row g-4">
//             {filteredBoxes.slice(0, 6).map((box) => (
//               <motion.div
//                 key={box._id}
//                 className="col-md-6 col-lg-4"
//                 initial={{ opacity: 0, y: 40 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <BoxCard box={box} />
//               </motion.div>
//             ))}
//           </div>
//         </section>

//         {/* ================= COMMERCE ================= */}
//         <section className="commerce-section">
//           <div className="commerce-header">
//             <div className="brand">
//               <img src={boxdropLogo} alt="BoxDrop" />
//               <span>BoxDrop</span>
//             </div>
//             <h1>Sell, ship, and grow everywhere</h1>
//             <p>
//               BoxDrop helps creators launch and scale subscription boxes across
//               channels.
//             </p>
//           </div>
//         </section>

//         <button onClick={handleInstall} disabled={!deferredPrompt}>
//           Install BoxDrop
//         </button>

//         <Footer />
//       </div>
//     </>
//   );
// }

// export default Home;

