import Navbar from '@/components/global/Navbar';
import { getSingleType, getBlogBySlug } from '@/lib/strapi';


export async function generateMetadata({ params }) {

  return {
    title: "CrybroSecurity Crew",
    description: "Meet our crew at CrybroSecurity",
  };
}

export default async function CrewLayout({ children }) {


  return (
    <div className="container mx-auto p-4">
      <main>
        {children}
      </main>
    </div>
  );
}