// import { Link, useLocation } from "react-router-dom";

// function SellerSidebar() {
//   const { pathname } = useLocation();

//   const nav = [
//     { label: "Dashboard", path: "/seller/dashboard" },
//     { label: "My Boxes", path: "/seller/boxes" },
//     { label: "Create Box", path: "/seller/boxes/new" },
//     { label: "Analytics", path: "/seller/analytics" },
//   ];

//   return (
//     <div className="sidebar bg-black text-light p-3" style={{ width: 240 }}>
//       <h4 className="fw-bold mb-4">BoxDrop Seller</h4>

//       {nav.map((item) => (
//         <Link
//           key={item.path}
//           to={item.path}
//           className={`d-block py-2 px-3 rounded text-decoration-none ${
//             pathname === item.path ? "bg-primary text-white" : "text-light"
//           }`}
//         >
//           {item.label}
//         </Link>
//       ))}
//     </div>
//   );
// }

// export default SellerSidebar;
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusSquare,
  BarChart3,
} from "lucide-react";
import "./Seller.css";

function SellerSidebar() {
  const { pathname } = useLocation();

  const nav = [
    {
      label: "Dashboard",
      path: "/seller/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "My Boxes",
      path: "/seller/boxes",
      icon: <Package size={20} />,
    },
    {
      label: "Create Box",
      path: "/seller/boxes/new",
      icon: <PlusSquare size={20} />,
    },
    {
      label: "Analytics",
      path: "/seller/analytics",
      icon: <BarChart3 size={20} />,
    },
    {
      label: "Orders",
      path: "/seller/orders",
      icon: <PlusSquare size={20} />,
    },
    {
      label: "Subscriptions",
      path: "/seller/subscriptions",
      icon: <BarChart3 size={20} />,
    },
  ];

  return (
    <div className="seller-sidebar">
      <h3 className="sidebar-title">BoxDrop Seller</h3>

      <nav className="sidebar-nav">
        {nav.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>

              {/* LEFT ACCENT GLOW */}
              {isActive && <span className="active-glow" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default SellerSidebar;
