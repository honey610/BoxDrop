// import { useState, useEffect} from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { applyForSeller } from "../features/seller/sellerSlice";
// import "./SellerApply.css";


// function SellerApply({ onClose }) {
//   const [brandName, setBrandName] = useState("");
//   const [description, setDescription] = useState("");

//   const dispatch = useDispatch();
//   const { loading, error, applicationStatus } = useSelector(
//     (state) => state.seller
//   );

//   const handleApply = () => {
//     if (!brandName || !description) {
//       alert("Please fill all fields");
//       return;
//     }

//     dispatch(
//       applyForSeller({
//         brandName,
//         description,
//       })
//     );
//   };

  

// useEffect(() => {
//   document.body.style.overflow = "hidden";
//   return () => {
//     document.body.style.overflow = "auto";
//   };
// }, []);

// const handleSubmit = async () => {
//   try {
//     const endpoint =
//       mode === "REAPPLY" ? "/sellers/reapply" : "/sellers/apply";

//     const res = await api.post(endpoint, {
//       brandName,
//       description,
//     });

//     alert(res.data.message);
//     onClose();
//   } catch (err) {
//     alert(err.response?.data?.message || "Submission failed");
//   }
// };


//   return (
//     <>
//     <div className="seller-apply-image">
//     <div className="modal-backdrop-custom">
//       <div className="modal-card">
//         <h4>Apply as a Seller</h4>

//         <input
//           type="text"
//           className="form-control mb-3"
//           placeholder="Brand Name"
//           value={brandName}
//           onChange={(e) => setBrandName(e.target.value)}
//         />

//         <textarea
//           className="form-control mb-3"
//           placeholder="Describe your subscription box"
//           rows="4"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />

//         {error && <p className="text-danger">{error}</p>}
//         {applicationStatus && (
//           <p className="text-success">{applicationStatus}</p>
//         )}

//         <div className="d-flex gap-2 mt-3">
//           <button className="btn btn-secondary" onClick={onClose}>
//             Cancel
//           </button>
//           <button
//             className="btn btn-primary"
//             disabled={loading}
//             onClick={handleApply}
//           >
//             {loading ? "Submitting..." : "Submit"}
//           </button>
//         </div>
//       </div>
//     </div>
//     </div>
//     </>
//   );
// }

// export default SellerApply;

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyForSeller } from "../features/seller/sellerSlice";
import "./SellerApply.css";

function SellerApply({ onClose, mode = "APPLY" }) {
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();
  const { loading, error, applicationStatus } = useSelector(
    (state) => state.seller
  );

  /* 🔒 Lock background scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  /* ✅ Auto close modal on success */
  useEffect(() => {
    if (applicationStatus) {
      onClose();
    }
  }, [applicationStatus, onClose]);

  const handleSubmit = () => {
    if (!brandName.trim() || !description.trim()) {
      alert("Brand name and description are required");
      return;
    }

    dispatch(
      applyForSeller({
        brandName,
        description,
        mode, // APPLY or REAPPLY
      })
    );
  };

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-card">
        <h4 className="mb-3">
          {mode === "REAPPLY" ? "Re-Apply as Seller" : "Apply as a Seller"}
        </h4>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Brand name"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />

        <textarea
          className="form-control mb-3"
          placeholder="Describe your subscription box"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* ❌ Error */}
        {error && <div className="text-danger mt-2">{error}</div>}

        {/* ✅ Success */}
        {applicationStatus && (
          <div className="text-success mt-2">{applicationStatus}</div>
        )}

        <div className="d-flex gap-2 mt-4">
          <button
            className="btn btn-secondary w-50"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="btn btn-primary w-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : mode === "REAPPLY"
              ? "Re-Apply"
              : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SellerApply;

