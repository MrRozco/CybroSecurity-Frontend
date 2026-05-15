import { getJobCategories, getJobLevels, fetchFromStrapiSafe } from '@/lib/strapi';
import JobPostings from '@/components/custom/JobPostings';

export const revalidate = 3600;

export async function generateMetadata() {
  const gigs = await fetchFromStrapiSafe('gigs', {}, { fallback: null });
  return {
    title: gigs?.pageTitle || 'Gigs',
    description: gigs?.pageDescription || 'Curated job postings and career opportunities at CybroSecurity',
  };
}

export default async function GigsPage() {
  const [gigs, jobCategories, jobLevels] = await Promise.all([
    fetchFromStrapiSafe('gigs', {}, { fallback: null }),
    getJobCategories(),
    getJobLevels(),
  ]);

  const filterOptions = {
    categories: Array.isArray(jobCategories) ? jobCategories : [],
    levels: Array.isArray(jobLevels) ? jobLevels : [],
  };

  const jobPostingsData = {
    Title: gigs?.sectionTitle,
    description: gigs?.sectionDescription,
    job_postings: gigs?.job_postings ?? [],
  };

  return (
    <div className="container">
      <JobPostings data={jobPostingsData} filterOptions={filterOptions} />
    </div>
  );
}
