import { useEffect, useState } from "react";
import api from  "../api/api";
import BoxCard from "../component/BoxCard";
import "./Browse.css";
import Navbar from "../component/Navbar";

function Browse() {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const res = await api.get("/boxes");
        setBoxes(res.data.boxes);
      } catch (err) {
        console.error("Failed to fetch boxes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoxes();
  }, []);

  const filteredBoxes = boxes.filter((box) =>
    box.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="page-center">Loading boxes...</div>;
  }

  return (
    <>
    <Navbar />
<div className="browse-page-container d-flex ">
    <div className="browse-page container py-5">
      {/* Header */}
      <div className="browse-header mb-4">
        <h2 className="fw-bold">Browse Subscription Boxes</h2>
        <p className="text-muted">
          Discover curated boxes from independent creators
        </p>
      </div>

      {/* Search */}
      <div className="browse-search mb-5 "  >
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search boxes (coffee, fitness, pets...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      {filteredBoxes.length === 0 ? (
        <p className="text-muted">No boxes found.</p>
      ) : (
        <div className="row g-4">
          {filteredBoxes.map((box) => (
            <div className="col-md-6 col-lg-4" key={box._id}>
              <BoxCard box={box} />
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
    </>
  );
}

export default Browse;
