import Image from "next/image";
import styles from './styles.module.scss';

const CrewMembers = ({ data }) => {
  const { employee } = data || {};

  return (
    <section className={`container ${styles.crewMembers}`}>
      {employee && employee.length > 0 &&
        employee.map((member, i) => (
          <div key={i} className={styles.memberCard}>
            <Image
              src={
                member.profile.url.startsWith("http")
                  ? member.profile.url
                  : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${member.profile.url.replace(/^\/+/, "")}`
              }
              alt={member.profile.alternativeText || member.name}
              width={400}
              height={400}
              className={styles.memberCard__photo}
            />
            <p className={styles.memberCard__name}>{member.name}</p>
            <p className={styles.memberCard__title}>{member.title}</p>
            <div
              className={styles.memberCard__bio}
              dangerouslySetInnerHTML={{ __html: member.bio }}
            />
          </div>
        ))
      }
    </section>
  );
};

export default CrewMembers;
