import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PackageCheck,
  Users,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import "./AdminSidebar.css";

function AdminSidebar() {
  const { pathname } = useLocation();

  const nav = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Box Approvals", path: "/admin/box-approvals", icon: <PackageCheck size={20} /> },
    { label: "Seller Approvals", path: "/admin/seller-approvals", icon: <ShieldCheck size={20} /> },
    { label: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { label: "Analytics", path: "/admin/analytics", icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="admin-sidebar">
      <h3 className="sidebar-title">Admin Panel</h3>

      {nav.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`sidebar-link ${pathname === item.path ? "active" : ""}`}
        >
          <span className="icon">{item.icon}</span>
          {item.label}
          {pathname === item.path && <span className="active-glow" />}
        </Link>
      ))}
    </div>
  );
}

export default AdminSidebar;
