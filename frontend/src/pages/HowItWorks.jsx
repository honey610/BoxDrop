import { Search, Package, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import "./HowItWorks.css";
import { useEffect } from "react";
import Navbar from "../component/Navbar";

function HowItWorks() {
    useEffect(() => {
  const sections = document.querySelectorAll(".fade-section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  sections.forEach((section) => observer.observe(section));

  return () => observer.disconnect();
}, []);

  const steps = [
    {
      icon: <Search size={40} />,
      title: "Discover Boxes",
      description:
        "Browse curated subscription boxes across food, beauty, fitness, tech, and more.",
    },
    {
      icon: <Package size={40} />,
      title: "Subscribe Easily",
      description:
        "Pick a box you love and subscribe in seconds. Pause or cancel anytime.",
    },
    {
      icon: <Truck size={40} />,
      title: "Monthly Delivery",
      description:
        "Get exciting boxes delivered to your doorstep every month.",
    },
  ];
  const faqData = [
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes. You can pause or cancel your subscription anytime from your profile.",
  },
  {
    question: "Are the boxes curated?",
    answer:
      "Yes. Each box is curated by independent creators and reviewed before listing.",
  },
  {
    question: "When will I receive my box?",
    answer:
      "Boxes are shipped monthly. Exact delivery dates depend on the seller.",
  },
];

  return (
    <>
    <Navbar />
    <div className="how-page-background">
    <div className="how-page container py-5">
      {/* Header */}
      <div className="text-center mb-5 fade-section">
        <h1 className="fw-bold">How BoxDrop Works</h1>
        <p className="text-muted mt-2">
          Discover. Subscribe. Enjoy.
        </p>
      </div>

      {/* Steps */}
      <div className="row g-4 mb-5">
        {steps.map((step, index) => (
          <div className="col-md-4 fade-section" key={index}>
            <div className="how-card">
              <div className="how-icon">{step.icon}</div>
              <h4 className="mt-3">{step.title}</h4>
              <p className="text-muted">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center fade-section mb-5">
        <Link to="/browse" className="btn btn-primary btn-lg px-5">
          Browse Boxes
        </Link>
      </div>

      {/* FAQ */}
      <div className="faq-section fade-section">
        <h3 className="fw-bold text-center mb-4">
          Frequently Asked Questions
        </h3>

        <div className="accordion" id="faqAccordion">
          {faqData.map((item, idx) => (
            <div className="accordion-item" key={idx}>
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${idx !== 0 ? "collapsed" : ""}`}
                  data-bs-toggle="collapse"
                  data-bs-target={`#faq-${idx}`}
                >
                  {item.question}
                </button>
              </h2>
              <div
                id={`faq-${idx}`}
                className={`accordion-collapse collapse ${
                  idx === 0 ? "show" : ""
                }`}
              >
                <div className="accordion-body">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
    </>
  );
}



export default HowItWorks;
