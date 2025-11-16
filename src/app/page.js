import MainHeader from '@/components/custom/MainHeader';
import { getSingleType } from '@/lib/strapi';
import PageRenderer from '@/components/PageRenderer';

// Page metadata
export const metadata = {
  title: "Home", // Will show as "Home | CybroSecurity"
  description: "Welcome to CybroSecurity - Your trusted cybersecurity partner",
};

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  
  const homepage = await getSingleType('homepage');

  return (
    <div className="container mx-auto py-4 px-10">
      <PageRenderer page={homepage} />
    </div>
  );
}