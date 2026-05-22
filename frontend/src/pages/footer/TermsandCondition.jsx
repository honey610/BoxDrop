import Navbar from "../../component/Navbar";
import "./PrivacyandTerms.css";

function TermsandConditions() {
  return (
    <>
      <Navbar />

      <div className="container-cr py-5 text-white">
        <h1 className="fw-bold mb-4">Terms & Conditions</h1>

        <p className="opacity-75">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mt-4">
          <h4>1. Acceptance of Terms</h4>
          <p>
            By accessing or using <strong>BoxDrop</strong>, you agree to comply
            with these Terms & Conditions.
          </p>
        </section>

        <section className="mt-4">
          <h4>2. Platform Role</h4>
          <p>
            BoxDrop is a marketplace that connects users with independent
            sellers. We are not responsible for the quality, delivery, or
            legality of seller products.
          </p>
        </section>

        <section className="mt-4">
          <h4>3. User Responsibilities</h4>
          <ul>
            <li>Provide accurate information</li>
            <li>Do not misuse the platform</li>
            <li>Comply with applicable laws</li>
          </ul>
        </section>

        <section className="mt-4">
          <h4>4. Seller Responsibilities</h4>
          <ul>
            <li>Fulfill orders accurately and on time</li>
            <li>Maintain product quality</li>
            <li>Comply with platform policies</li>
          </ul>
        </section>

        <section className="mt-4">
          <h4>5. Payments & Payouts</h4>
          <p>
            Payments made by users may be held until delivery confirmation.
            Sellers receive payouts subject to successful delivery.
          </p>
        </section>

        <section className="mt-4">
          <h4>6. Order Disputes</h4>
          <p>
            BoxDrop reserves the right to mediate disputes between users and
            sellers.
          </p>
        </section>

        <section className="mt-4">
          <h4>7. Account Suspension</h4>
          <p>
            We may suspend or terminate accounts that violate these terms.
          </p>
        </section>

        <section className="mt-4">
          <h4>8. Limitation of Liability</h4>
          <p>
            BoxDrop is not liable for indirect or consequential damages arising
            from platform usage.
          </p>
        </section>

        <section className="mt-4">
          <h4>9. Contact</h4>
          <p>
            For questions regarding these terms, contact:
            <br />
            <strong>support@boxdrop.com</strong>
          </p>
        </section>
      </div>
    </>
  );
}

export default TermsandConditions;
