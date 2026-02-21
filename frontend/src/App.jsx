import { Routes, Route, Navigate } from "react-router-dom";
import AdminList from "./pages/AdminList.jsx";
import ConfigEdit from "./pages/ConfigEdit.jsx";
import Checkout from "./pages/Checkout.jsx";
import Success from "./pages/Success.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminList />} />
      <Route path="/configs/new" element={<ConfigEdit mode="create" />} />
      <Route path="/configs/:id" element={<ConfigEdit mode="edit" />} />
      <Route path="/checkout/:id" element={<Checkout />} />
      <Route path="/success" element={<Success />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
