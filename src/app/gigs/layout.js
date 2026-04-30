export async function generateMetadata() {
  return {
    title: 'CybroSecurity Gigs',
    description: 'Curated cybersecurity and IT job opportunities',
  };
}

export default async function GigsLayout({ children }) {
  return (
    <div className="container">
      <main>{children}</main>
    </div>
  );
}
