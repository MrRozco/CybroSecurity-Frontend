import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = ({data}) => {

  const { logo, links, socialMedias } = data;


  return (
    <footer className=" px-4 flex flex-col justify center align-center text-white text-center mt-[10vh] w-full h-[30vh]">
        <div className='container mx-auto  flex  justify-between items-center'>
            <div>
                <Link href="/">
                {
                  <Image
                        src={
                        logo.url.startsWith("http")
                            ? logo.url
                            : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${logo.url.replace(/^\/+/, "")}`
                        }
                        alt={logo.alternativeText || "CybroSecurity Logo"}
                        width={200}
                        height={200}
                        className="rounded object-cover"
                    />
                }
            </Link>
            </div>
            <div>
                {socialMedias && socialMedias.length > 0 && (
                    <ul className='flex justify-center items-center gap-4 flex-wrap mt-4 mb-2'>
                        {socialMedias.map((social, i) => (
                            <li key={i}>
                                <a href={social.mediaLink} target="_blank" rel="noopener noreferrer">
                                   <Image
                                        src={
                                        social.mediaLogo.url.startsWith("http")
                                            ? social.mediaLogo.url
                                            : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${social.mediaLogo.url.replace(/^\/+/, "")}`
                                        }
                                        alt={social.mediaLogo.name || "CybroSecurity Logo"}
                                        width={40}
                                        height={40}
                                        className="rounded object-cover"
                                    /> 
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>  
        </div>
        <div className='container mx-auto'>
               {links && links.length > 0 && (
                 <ul className=' flex justify-start items-center gap-4 flex-wrap mt-4 mb-2 text-2xl mb-4'>
                    {links.map((link, i) => (
                        <li key={i} className="flex items-center">
                            <Link href={link.url} className='mr-4'>
                                {link.text}
                            </Link>
                            {i < links.length - 1 && (
                                <span className=" text-[#04c4f3]">|</span>
                            )}
                        </li>
                    ))}
                 </ul>
               )}

               <p>
                &copy; {new Date().getFullYear()} CybroSecurity. All rights reserved. Site made by NovaLink Web Solutions.
               </p>
        </div>

    </footer>
  );
};

export default Footer;