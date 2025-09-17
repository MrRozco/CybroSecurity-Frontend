import Image from "next/image";

const CrewMembers = ({data}) => {

    const {employee} = data || {};

    console.log("CrewMembers data:", data);

    return (

        <section className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8" >
            {employee && employee.length > 0 && (
                employee.map((member, i) => (
                    <div key={i} className="flex flex-col bg-[#0a223f] justify-center items-center text-center  text-white p-4 hover:scale-105 transition-transform duration-300">
                        <Image
                            src={
                            member.profile.url.startsWith("http")
                                ? member.profile.url
                                : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${member.profile.url.replace(/^\/+/, "")}`
                            }
                            alt={member.profile.alternativeText || "CybroSecurity Logo"}
                            width={400}
                            height={400}
                            className="rounded object-cover mb-5"
                        />
                        <p className="text-4xl! text-bold!" >{member.name}</p>
                        <p >{member.title}</p>
                        <div dangerouslySetInnerHTML={{ __html: member.bio }} />
                    </div>
                ))
            )}
        </section>
    )
}

export default CrewMembers;

