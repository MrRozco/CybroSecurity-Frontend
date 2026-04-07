import Navbar from '@/components/global/Navbar';
import { getSingleType } from '@/lib/strapi';

export default async function CategoryLayout({ children }) {

  return (
    <div className="container">
      <main>
        {children}
      </main>
    </div>
  );
}