"use client";

import { useState } from "react";
import Image from "next/image";
import { getStrapiMediaUrl } from "@/lib/strapi";
import styles from './styles.module.scss';

const CrewMembers = ({ data }) => {
  const { employee } = data || {};
  const [flippedCards, setFlippedCards] = useState({});

  const toggleCard = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section className={`container ${styles.crewMembers}`}>
      {employee && employee.length > 0 &&
        employee.map((member, i) => {
          const isFlipped = Boolean(flippedCards[i]);
          const memberSocials = member?.socials || member?.socialMedias || member?.social_medias || [];

          return (
            <div
              key={i}
              className={`${styles.memberCard} ${isFlipped ? styles['memberCard--flipped'] : ''}`}
            >
              <div className={styles.memberCard__media}>
                <div className={styles.memberCard__mediaInner}>
                  <div className={`${styles.memberCard__mediaFace} ${styles.memberCard__mediaFront}`}>
                    {member?.profile?.url && (
                      <Image
                        src={getStrapiMediaUrl(member.profile.url)}
                        alt={member.profile.alternativeText || member.name}
                        width={400}
                        height={280}
                        className={styles.memberCard__photo}
                      />
                    )}
                  </div>

                  <div className={`${styles.memberCard__mediaFace} ${styles.memberCard__mediaBack}`}>
                    <div
                      className={styles.memberCard__bio}
                      dangerouslySetInnerHTML={{ __html: member.bio || '' }}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.memberCard__content}>
                <div className={styles.memberCard__identity}>
                  <p className={styles.memberCard__name}>{member.name}</p>
                  <p className={styles.memberCard__title}>{member.title}</p>
                </div>

                <div className={styles.memberCard__actions}>
                  {memberSocials.length > 0 && (
                    <ul className={styles.memberCard__socials}>
                      {memberSocials.map((social, socialIndex) => (
                        <li key={socialIndex} className={styles.memberCard__socialItem}>
                          <a
                            href={social.mediaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.memberCard__socialLink}
                          >
                            {social?.mediaLogo?.url && (
                              <Image
                                src={getStrapiMediaUrl(social.mediaLogo.url)}
                                alt={social.mediaLogo.name || `${member.name} social`}
                                width={24}
                                height={24}
                                className={styles.memberCard__socialIcon}
                              />
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    type="button"
                    className={styles.memberCard__flipControl}
                    onClick={() => toggleCard(i)}
                    aria-label={isFlipped ? `Show ${member.name} photo` : `Show ${member.name} bio`}
                  >
                    <span className={styles.memberCard__flipLabel}>{isFlipped ? 'Photo' : 'Bio'}</span>
                    <span className={styles.memberCard__flipIcon} aria-hidden="true">↻</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })
      }
    </section>
  );
};

export default CrewMembers;
