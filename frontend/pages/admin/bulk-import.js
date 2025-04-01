import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProtected from '@/components/admin/AdminProtected';
import BulkImportForm from '@/components/admin/BulkImportForm';

/**
 * Bulk Import Page
 * 
 * Allows administrators to import multiple resources at once via JSON
 */
const BulkImportPage = () => {
  return (
    <AdminProtected>
      <AdminLayout>
        <Head>
          <title>Bulk Import Resources | Insight Directory</title>
          <meta name="description" content="Import multiple resources at once" />
        </Head>
        
        <BulkImportForm />
      </AdminLayout>
    </AdminProtected>
  );
};

export default BulkImportPage;
