import { AuthProvider } from '@/components/admin/auth';
import { AdminStoreProvider } from '@/components/admin/store';
import AdminShell from '@/components/admin/shell';

export const metadata = {
  title: 'Admin — Modern Estimator',
  description: 'Modern Estimator admin panel',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <AdminStoreProvider>
        <AdminShell>{children}</AdminShell>
      </AdminStoreProvider>
    </AuthProvider>
  );
}
