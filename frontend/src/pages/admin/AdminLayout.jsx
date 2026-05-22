import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import Navbar from "../../component/Navbar";

function AdminLayout() {
  return (
    <>
      <Navbar />
    <div className="d-flex vh-100 bg-black text-white">
      <AdminSidebar />
      <div className="flex-grow-1 overflow-auto">
        <Outlet />
      </div>
    </div>
    </>
  );
}

export default AdminLayout;