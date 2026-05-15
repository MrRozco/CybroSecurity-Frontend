import CrewHeader from '@/components/custom/CrewHeader';
import CrewMembers from '@/components/custom/CrewMembers';
import { getSingleType } from '@/lib/strapi';

export const metadata = {
  title: 'Our Crew',
  description: 'Meet the CybroSecurity team of cybersecurity experts',
};

export const revalidate = 3600;

export default async function Crew() {
  const crew = await getSingleType('crew');

  return (
    <div className="container">
      {crew?.header && <CrewHeader data={crew.header} />}
      {crew?.members && <CrewMembers data={crew.members} />}
    </div>
  );
}
