import AdminAuthWrapper from "@/admin/components/shared/AdminAuthWrapper";
import AdminLayout from "./AdminLayout";  // Now in the same folder

const AdminPage = () => {
  return (
    <AdminAuthWrapper>
      <AdminLayout />
    </AdminAuthWrapper>
  );
};

export default AdminPage;