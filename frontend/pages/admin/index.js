import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProtected from '@/components/admin/AdminProtected';
import Dashboard from '@/components/admin/Dashboard';

/**
 * Admin Dashboard Page
 * 
 * Displays the main admin dashboard with resource metrics and quick actions
 */
const AdminDashboardPage = () => {
  return (
    <AdminProtected>
      <AdminLayout>
        <Head>
          <title>Admin Dashboard | Insight Directory</title>
          <meta name="description" content="Admin dashboard for Insight Directory" />
        </Head>
        
        <Dashboard />
      </AdminLayout>
    </AdminProtected>
  );
};

export default AdminDashboardPage;
