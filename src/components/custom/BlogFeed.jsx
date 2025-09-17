'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogFeed({ category, blogs }) {

    const blogsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    
    // Calculate total pages and slice blogs for current page
    const totalPages = Math.ceil(blogs.length / blogsPerPage);
    const startIndex = (currentPage - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    const currentBlogs = blogs.slice(startIndex, endIndex);

    // Handle page navigation
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <section className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">{category.Name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentBlogs.map((blog, i) => (
                  <Link href={`/blogs/${blog.Slug}`} className="text-blue-500 mt-2 inline-block hover:scale-103 transition-transform duration-300 " key={i}>
                    <div key={blog.id} className="p-4 shadow">
                        <div className="relative">
                            {blog?.FeaturedImage && (
                                <div className="relative">
                                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/10 to-transparent rounded"></div>
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${blog.FeaturedImage.url}`}
                                        alt={blog.Title}
                                        width={700}
                                        height={500}
                                        className="object-cover rounded"
                                    />
                                </div>
                            )}
                            <h2 className="absolute bottom-4 left-4 text-6xl font-semibold text-white z-20">{blog.Title}</h2>
                        </div>
                        <p className="text-gray-600 mt-4">{blog.Excerpt}</p>
                        
                        
                    </div>
                    </Link>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-2">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded ${
                            currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => goToPage(index + 1)}
                            className={`px-4 py-2 rounded ${
                                currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded ${
                            currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
}