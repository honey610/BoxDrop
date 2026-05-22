import { useState } from "react";
import "./BoxCard.css";

function Order({ onClose, onSubmit }) {
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const handleSubmit = () => {
    if (!address.name || !address.phone || !address.addressLine1) {
      alert("Fill required fields");
      return;
    }
    onSubmit(address);
  };

  return (
    <div className="order-card">
      <h4 className="fw-bold mb-3">Delivery Details</h4>

      <input
        className="form-control mb-2"
        placeholder="Full Name"
        onChange={(e) => setAddress({ ...address, name: e.target.value })}
      />

      <input
        className="form-control mb-2"
        placeholder="Phone"
        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
      />

      <input
        className="form-control mb-2"
        placeholder="Address"
        onChange={(e) =>
          setAddress({ ...address, addressLine1: e.target.value })
        }
      />

      <div className="row g-2">
        <div className="col">
          <input
            className="form-control"
            placeholder="City"
            onChange={(e) =>
              setAddress({ ...address, city: e.target.value })
            }
          />
        </div>
        <div className="col">
          <input
            className="form-control"
            placeholder="State"
            onChange={(e) =>
              setAddress({ ...address, state: e.target.value })
            }
          />
        </div>
      </div>

      <input
        className="form-control mt-2"
        placeholder="Pincode"
        onChange={(e) =>
          setAddress({ ...address, pincode: e.target.value })
        }
      />

      <div className="d-flex gap-3 mt-4">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}

export default Order;
