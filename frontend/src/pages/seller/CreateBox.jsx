
import { useState } from "react";
import { IndianRupee, PackageCheck } from "lucide-react";
import api from "../../api/api";
import "./Seller.css";
import { UploadCloud, X } from "lucide-react";


function CreateBox() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    itemsSummary: "",
    price: "",

    // images: [],
    billingCycle: "MONTHLY",
  });


  // const submit = async () => {
  //   if (!form.title || !form.price) return alert("Fill required fields");

  //   await api.post("/boxes/create", form);
  //   alert("Box submitted for review");
  // };

  const [images, setImages] = useState([]);

  const submit=async()=>{
    if(!form.title||!form.price) return alert("Fill required fields");
    try{
      const fd=new FormData();
      fd.append("title",form.title);
      fd.append("description",form.description);
      fd.append("itemsSummary",form.itemsSummary);
      fd.append("price",form.price);
      fd.append("billingCycle",form.billingCycle);
      for(let i=0;i<images.length;i++){
        fd.append("images",images[i]);
      }
      await api.post("/boxes/create",fd);
      alert("Box submitted for review");

    }catch(err){
      console.log(err);
    }
  }

const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);
  setImages((prev) => [...prev, ...files]);
};

const removeImage = (index) => {
  setImages(images.filter((_, i) => i !== index));
};


  return (
    <div className="create-box">

      {/* HEADER */}
      <div className="create-header">
        <div>
          <h1>Create New Box</h1>
          <p>Set up your subscription box for approval</p>
        </div>
      </div>

      {/* FORM GRID */}
      <div className="create-grid">

        {/* LEFT FORM */}
        <div className="form-panel">

          {/* BOX DETAILS */}
          <section>
            <h3>Box Details</h3>

            <label>Box Title *</label>
            <input
              placeholder="Premium Grooming Box"
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <label>Description</label>
            <textarea
              rows={4}
              placeholder="What does your box include?"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </section>

          {/* {Item Summary} */}
          <section> 
             <label>Item Summary</label>
             <textarea
              rows={4}
              placeholder="What does your box include?"
              onChange={(e) =>
                setForm({ ...form, itemsSummary: e.target.value })
              }
            />
              
          </section>

          {/* PRICING */}
          <section>
            <h3>Pricing & Billing</h3>

            <div className="price-row">
              <IndianRupee size={18} />
              <input
                type="number"
                placeholder="Price"
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
              />
            </div>

            <label>Billing Cycle</label>
            <select
              value={form.billingCycle}
              onChange={(e) =>
                setForm({ ...form, billingCycle: e.target.value })
              }
            >
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </section>
        </div>

        {/* MEDIA */}
<section>
  <h3>Box Images</h3>
  <p className="section-hint">
    Add high-quality images to improve conversions
  </p>

  <label className="upload-zone">
    <UploadCloud size={32} />
    <span>Drag & drop images or click to upload</span>
    <input
      type="file"
      multiple
      accept="image/*"
      hidden
      onChange={handleImageUpload}
    />
  </label>

  {images.length > 0 && (
    <div className="image-preview-grid">
      {images.map((img, index) => (
        <div className="image-preview" key={index}>
          <img src={URL.createObjectURL(img)} alt="preview" />
          <button onClick={() => removeImage(index)}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )}
</section>


        {/* RIGHT INFO */}
        <div className="info-panel">

          <div className="info-card">
            <PackageCheck size={28} />
            <h4>Review Process</h4>
            <p>
              All boxes go through manual review to ensure quality and trust.
            </p>
            <ul>
              <li>Approval within 24–48 hours</li>
              <li>No changes allowed during review</li>
              <li>You’ll be notified once live</li>
            </ul>
          </div>

          <button className="submit-btn" onClick={submit}>
            Submit for Review
          </button>
        </div>

      </div>
    </div>
  );
}

export default CreateBox;
