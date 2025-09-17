'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar({ data }) {
  if (!data) return null;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="container flex justify-between items-center p-4">
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
      <div className="hidden md:block pb-4 border-b border-[#04c4f3] w-full md:w-auto">
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
        

            {/* hambuger menu for desktop */}

      <button
        className="hidden md:block text-[#04c4f3] text-4xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        &#9776; {/* Unicode hamburger icon */}
      </button>
      {/* Mobile menu: always rendered for smooth transition */}
      <div
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
          {Array.isArray(data.links) &&
            data.hamburgerLinks.map((link, index) => (
              <li key={index}>
                {link?.url && link?.text && (
                  <Link
                    href={link.url}
                    className="text-[#04c4f3] text-2xl hover:underline"
                  >
                    {link.text}
                  </Link>
                )}
              </li>
            ))}
        </ul>
      </div>
      </ul>
      </div>
    
      {/* hambuger menu for mobile */}

      <button
        className="block md:hidden text-[#04c4f3] text-4xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        &#9776; {/* Unicode hamburger icon */}
      </button>
      {/* Mobile menu: always rendered for smooth transition */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[70vw] max-w-xs bg-gray-800 p-4 rounded-l-lg shadow-lg md:hidden
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
          {Array.isArray(data.links) &&
            data.hamburgerLinks.map((link, index) => (
              <li key={index}>
                {link?.url && link?.text && (
                  <Link
                    href={link.url}
                    className="text-[#04c4f3] text-2xl hover:underline"
                  >
                    {link.text}
                  </Link>
                )}
              </li>
            ))}
        </ul>
      </div>
    </nav>
  );
}