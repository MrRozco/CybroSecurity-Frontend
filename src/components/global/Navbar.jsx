'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

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
    <nav className="container flex justify-between items-center p-6">
      {data.logo?.url && (
        <Link href="/">
          <Image
            src={
              data.logo.url.startsWith("http")
                ? data.logo.url
                : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${data.logo.url.replace(/^\/+/, "")}`
            }
            alt={data.logo.alternativeText || "Logo"}
            width={200}
            height={200}
            style={{ cursor: "pointer" }}
          />
        </Link>
      )}
      <div className="hidden md:flex flex-row gap-4 pb-4 border-b border-[#04c4f3] w-full md:w-auto">
        <ul className="flex space-x-4 items-center">
          {Array.isArray(data.links) &&
            data.links.map((link, index) => (
              <li key={index} className="flex items-center">
                {link?.url && link?.text && (
                  <Link
                    href={link.url}
                    className="text-[#04c4f3] text-2xl hover:underline mr-5"
                  >
                    {link.text}
                  </Link>
                )}
                {index < data.links.length - 1 && (
                  <span className="mx-2 text-[#04c4f3]">/</span>
                )}
              </li>
            ))}
        </ul>
        <button
        className="hidden md:block text-[#04c4f3] text-4xl cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        &#9776;
      </button>
      </div>

      {/* Hamburger menu button for desktop */}
      
      {/* Hamburger menu button for mobile */}
      <button
        className="block md:hidden text-[#04c4f3] text-4xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        &#9776;
      </button>

      {/* Side menu for both desktop and mobile */}
      <div
        ref={menuRef}
        className={`
          fixed top-0 right-0 h-full w-[70vw] max-w-xs bg-gray-800 p-4 rounded-l-lg shadow-lg 
          transition-transform duration-300 ease-in-out
          z-50
          ${isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}
        `}
      >
        <button
          className="absolute top-2 right-2 text-[#04c4f3] text-6xl"
          onClick={() => setIsOpen(false)}
        >
          &times;
        </button>
        <ul className="flex flex-col gap-5 space-y-4 mt-20">
          {Array.isArray(data.hamburgerLinks)
            ? data.hamburgerLinks.map((link, index) => (
                <li key={index}>
                  {link?.url && link?.text && (
                    <Link
                      href={link.url}
                      className="text-[#04c4f3] text-2xl hover:underline"
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