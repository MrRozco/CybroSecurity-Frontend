import Image from "next/image";
import { getStrapiMediaUrl } from "@/lib/strapi";
import styles from './styles.module.scss';

const CrewMembers = ({ data }) => {
  const { employee } = data || {};

  return (
    <section className={`container ${styles.crewMembers}`}>
      {employee && employee.length > 0 &&
        employee.map((member, i) => (
          <div key={i} className={styles.memberCard}>
            <Image
              src={getStrapiMediaUrl(member.profile.url)}
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
