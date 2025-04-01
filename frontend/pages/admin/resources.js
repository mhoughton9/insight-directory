import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import ResourceTable from '@/components/admin/ResourceTable';

/**
 * Resource Management Page
 * 
 * Displays a table of resources with filtering options
 */
const ResourceManagementPage = () => {
  return (
    <AdminLayout>
      <Head>
        <title>Resource Management | Insight Directory</title>
        <meta name="description" content="Manage resources for Insight Directory" />
      </Head>
      
      <ResourceTable />
    </AdminLayout>
  );
};

export default ResourceManagementPage;
