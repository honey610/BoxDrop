// import SellerSidebar from "./SellerSidebar";
// import { Outlet } from "react-router-dom";
// function SellerLayout({ children }) {
//   return (
//     <div className="d-flex min-vh-100">
//       <SellerSidebar />
//       <div className="flex-grow-1 p-4 bg-dark text-light">
//         <Outlet />
//       </div>
//     </div>
//   );
// }

// export default SellerLayout;
import { Outlet } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";
import Navbar from "../../component/Navbar";

function SellerLayout() {
  return (
    <>
      <Navbar />
    
    <div className="d-flex vh-100 bg-black text-light">
      <SellerSidebar />

      <div className="flex-grow-1 overflow-auto">
        <Outlet />
      </div>
    </div>
    </>
  );
}

export default SellerLayout;
