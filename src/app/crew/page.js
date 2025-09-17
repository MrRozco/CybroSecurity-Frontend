import MainHeader from '@/components/custom/MainHeader';
import { getSingleType } from '@/lib/strapi';
import PageRenderer from '@/components/PageRenderer';


export default async function Crew() {
  
  const crew = await getSingleType('crew');


  return (
    <div className="container mx-auto p-4">
      <PageRenderer page={crew} />
    </div>
  );
}