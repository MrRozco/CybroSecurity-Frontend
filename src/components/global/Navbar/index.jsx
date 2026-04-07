'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import styles from './styles.module.scss';

export default function Navbar({ data }) {
  if (!data) return null;

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <nav className={`container ${styles.navbar}`}>
      {data.logo?.url && (
        <Link href="/" className={styles.navbar__logo}>
          <Image
            src={
              data.logo.url.startsWith("http")
                ? data.logo.url
                : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${data.logo.url.replace(/^\/+/, "")}`
            }
            alt={data.logo.alternativeText || "Logo"}
            width={150}
            height={100}
          />
        </Link>
      )}

      {/* Desktop link row */}
      <div className={styles.navbar__linksRow}>
        <ul className={styles.navbar__linksList}>
          {Array.isArray(data.links) &&
            data.links.map((link, index) => (
              <li key={index} className={styles.navbar__linkItem}>
                {link?.url && link?.text && (
                  <Link href={link.url} className={styles.navbar__link}>
                    {link.text}
                  </Link>
                )}
                {index < data.links.length - 1 && (
                  <span className={styles.navbar__divider}>/</span>
                )}
              </li>
            ))}
        </ul>

        {/* Hamburger — desktop */}
        <button
          className={styles.navbar__hamburgerDesktop}
          onClick={() => setIsOpen(!isOpen)}
        >
          &#9776;
        </button>
      </div>

      {/* Hamburger — mobile */}
      <button
        className={styles.navbar__hamburgerMobile}
        onClick={() => setIsOpen(!isOpen)}
      >
        &#9776;
      </button>

      {/* Side drawer */}
      <div
        ref={menuRef}
        className={`${styles.sideMenu} ${isOpen ? styles['sideMenu--open'] : styles['sideMenu--closed']}`}
      >
        <button
          className={styles.sideMenu__close}
          onClick={() => setIsOpen(false)}
        >
          &times;
        </button>
        <ul className={styles.sideMenu__list}>
          {Array.isArray(data.hamburgerLinks)
            ? data.hamburgerLinks.map((link, index) => (
                <li key={index}>
                  {link?.url && link?.text && (
                    <Link
                      href={link.url}
                      className={styles.sideMenu__link}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.text}
                    </Link>
                  )}
                </li>
              ))
            : null}
        </ul>
      </div>
    </nav>
  );
}
