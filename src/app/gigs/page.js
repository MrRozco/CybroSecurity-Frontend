import { getJobCategories, getJobLevels, getSingleType } from '@/lib/strapi';
import PageRenderer from '@/components/PageRenderer';

export const metadata = {
  title: 'Gigs',
  description: 'Curated job postings and career opportunities at CybroSecurity',
};

export const revalidate = 3600;

export default async function GigsPage() {
  const [gigsResult, jobCategories, jobLevels] = await Promise.all([
    getSingleType('gigs').catch(() => null),
    getJobCategories(),
    getJobLevels(),
  ]);

  const gigs = gigsResult && typeof gigsResult === 'object' ? gigsResult : { content: [] };

  const componentProps = {
    'structure.job-postings': {
      filterOptions: {
        categories: Array.isArray(jobCategories) ? jobCategories : [],
        levels: Array.isArray(jobLevels) ? jobLevels : [],
      },
    },
  };

  return (
    <div className="container">
      <PageRenderer page={gigs} componentProps={componentProps} />
    </div>
  );
}
