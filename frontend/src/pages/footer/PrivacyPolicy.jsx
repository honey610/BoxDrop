import Navbar from "../../component/Navbar";
import "./PrivacyandTerms.css";

function PrivacyPolicy() {
  return (
    <>
      <Navbar />

      <div className="container-cr py-5 text-white " >
        <h1 className="fw-bold mb-4">Privacy Policy</h1>

        <p className="opacity-75">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mt-4">
          <h4>1. Introduction</h4>
          <p>
            At <strong>BoxDrop</strong>, we respect your privacy and are committed
            to protecting your personal information. This Privacy Policy
            explains how we collect, use, and safeguard your data.
          </p>
        </section>

        <section className="mt-4">
          <h4>2. Information We Collect</h4>
          <ul>
            <li>Personal details such as name, email, and phone number</li>
            <li>Shipping and delivery addresses</li>
            <li>Order and transaction information</li>
            <li>Usage data to improve platform performance</li>
          </ul>
        </section>

        <section className="mt-4">
          <h4>3. How We Use Your Information</h4>
          <ul>
            <li>To process orders and deliveries</li>
            <li>To send order updates and notifications</li>
            <li>To improve our services and user experience</li>
            <li>To prevent fraud and ensure platform security</li>
          </ul>
        </section>

        <section className="mt-4">
          <h4>4. Data Sharing</h4>
          <p>
            We do not sell your personal data. Information is shared only with
            sellers and service providers strictly for order fulfillment and
            platform operations.
          </p>
        </section>

        <section className="mt-4">
          <h4>5. Data Security</h4>
          <p>
            We implement industry-standard security measures to protect your
            data. However, no system is completely secure.
          </p>
        </section>

        <section className="mt-4">
          <h4>6. Your Rights</h4>
          <p>
            You may request access, correction, or deletion of your personal
            data by contacting us.
          </p>
        </section>

        <section className="mt-4">
          <h4>7. Contact Us</h4>
          <p>
            For questions about this Privacy Policy, contact us at:
            <br />
            <strong>support@boxdrop.com</strong>
          </p>
        </section>
      </div>
    </>
  );
}

export default PrivacyPolicy;
