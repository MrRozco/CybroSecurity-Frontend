import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getStrapiMediaUrl } from '@/lib/strapi';
import styles from './styles.module.scss';

const Footer = ({ data }) => {
  const { logo, links, socialMedias } = data;

  return (
    <footer className={styles.footer}>
      {/* Top row */}
      <div className={styles.footer__top}>
        <div className={styles.footer__logoLink}>
          <Link href="/">
            <Image
              src={getStrapiMediaUrl(logo.url)}
              alt={logo.alternativeText || "CybroSecurity Logo"}
              width={300}
              height={150}
              className={styles.footer__logoImage}
            />
          </Link>
        </div>

        <div>
          {socialMedias && socialMedias.length > 0 && (
            <ul className={styles.footer__socialList}>
              {socialMedias.map((social, i) => (
                <li key={i} className={styles.footer__socialItem}>
                  <a href={social.mediaLink} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={getStrapiMediaUrl(social.mediaLogo.url)}
                      alt={social.mediaLogo.name || "Social Media"}
                      width={40}
                      height={40}
                      className={styles.footer__socialImage}
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className={styles.footer__bottom}>
        {links && links.length > 0 && (
          <ul className={styles.footer__linksList}>
            {links.map((link, i) => (
              <li key={i} className={styles.footer__linkItem}>
                <Link href={link.url}>{link.text}</Link>
                {i < links.length - 1 && (
                  <span className={styles.footer__divider}>|</span>
                )}
              </li>
            ))}
          </ul>
        )}

        <p className={styles.footer__copyright}>
          &copy; {new Date().getFullYear()} CybroSecurity. All rights reserved. Site made by NovaLink Web Solutions.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
