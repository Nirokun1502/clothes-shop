import { Outlet, Navigate } from "react-router-dom";

const AdminRoutes = () => {
  // Lấy và phân tích dữ liệu từ localStorage
  const accountinfo = JSON.parse(localStorage.getItem("accountinfo"));

  // Kiểm tra nếu authorize tồn tại và roles chứa "ADMIN"
  const roles = accountinfo?.roles || [];
  console.log(roles);
  return roles.includes("ADMIN") ? <Outlet /> : <Navigate to="/unauthorized" />;
  // return roles.includes("ADMIN") ? <Outlet /> : <Outlet />;
};

export default AdminRoutes;
