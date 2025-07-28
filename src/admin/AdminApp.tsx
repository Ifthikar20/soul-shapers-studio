import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminAuthWrapper from "./components/shared/AdminAuthWrapper";
import AdminLayout from "./components/layout/AdminLayout";

const AdminApp = () => {
  return (
    <AdminAuthWrapper>
      <Routes>
        <Route path="/" element={<AdminLayout />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminAuthWrapper>
  );
};

export default AdminApp;