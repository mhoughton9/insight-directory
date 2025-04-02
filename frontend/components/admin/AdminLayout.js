import Link from 'next/link';
import AdminProtected from './AdminProtected';

/**
 * Layout component for admin pages
 * Provides consistent header navigation and wraps content with AdminProtected
 */
export default function AdminLayout({ children }) {
  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <nav className="flex space-x-8">
                <Link href="/admin" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/admin/resources" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  Resources
                </Link>
                <Link href="/admin/teachers" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  Teachers
                </Link>
                <Link href="/admin/traditions" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  Traditions
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </AdminProtected>
  );
}
