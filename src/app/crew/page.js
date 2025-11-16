import MainHeader from '@/components/custom/MainHeader';
import { getSingleType } from '@/lib/strapi';
import PageRenderer from '@/components/PageRenderer';

// Page metadata
export const metadata = {
  title: "Our Crew", // Will show as "Our Crew | CybroSecurity"
  description: "Meet the CybroSecurity team of cybersecurity experts",
};

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour

export default async function Crew() {
  
  const crew = await getSingleType('crew');


  return (
    <div className="container mx-auto p-4">
      <PageRenderer page={crew} />
    </div>
  );
}