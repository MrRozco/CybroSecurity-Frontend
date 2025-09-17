"use client"
import Image from "next/image";
import Link from "next/link";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import React, { useState, useEffect } from "react";


export default function MainHeader({ data }) {

 if (!data.blogs || data.blogs.length === 0) return null;

  const [firstBlog, ...otherBlogs] = data.blogs;

  return (
    <header className="container text-white p-4 pb-40 mb-20">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main blog (large) */}
        <div className="md:w-3/5 w-full ">
          
          { firstBlog ? (


          <Link href={`/blogs/${firstBlog.Slug}`}>
            <div className="relative hover:scale-102 transition-transform duration-300 ">
              {/* Overlay */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/10 to-transparent rounded"></div>
              <Image
                src={
                  firstBlog.FeaturedImage.url.startsWith("http")
                    ? firstBlog.FeaturedImage.url
                    : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${firstBlog.FeaturedImage.url.replace(/^\/+/, "")}`
                }
                alt={firstBlog.FeaturedImage.alternativeText || firstBlog.Title}
                width={900}
                height={700}
                className="rounded object-cover"
              />
              <div className="absolute bottom-0 md:bottom-auto md:-mt-20 left-6 z-20">
                <h1 className="text-5xl md:text-8xl text-right font-bold">{firstBlog.Title}</h1>
                <p className="mt-2 text-2xl text-right">{firstBlog.Excerpt}</p>
                <div className="flex items-center gap-2 mt-1 justify-end">
                  {firstBlog.author?.Name && (
                    <>
                      <p>By</p>

                        <p className="text-lg text-[#04c4f3]">{firstBlog.author.Name}</p>

                    </>
                  )}
                {firstBlog.category?.Name && (
                    <>
                      <p>in</p>
                      
                        <p className="text-lg text-[#04c4f3] ">{firstBlog.category.Name}</p>

                    </>
                  )}
                </div>
              </div>
              
            </div> 
                     
          </Link>
          )
          :
          (
            <Skeleton variant="rectangular" width='100%' height={700} sx={{ bgcolor: 'grey.900' }}/>
          )
      }
        </div>
        {/* Other blogs (list) */}
        <div className="md:w-2/5 w-full flex flex-col gap-6 ">

          <p className="text-[#04c4f3] text-2xl">Top Stories</p>
          {otherBlogs.length > 0 ? (
            otherBlogs.map((blog) => (

            <Link href={`/blogs/${blog.Slug}`} key={blog.id} className="flex justify-between items-start gap-5 border-b-2 border-[#0467df] rounded p-2 hover:bg-[#1D2630] transition">
              <div>
                <h2 className="text-2xl md:text-4xl font-semibold">{blog.Title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  {blog.author?.Name && (
                    <>
                      <p>By</p>

                        <p className="text-nd text-[#04c4f3]">{blog.author.Name}</p>

                    </>
                  )}
                {blog.category?.Name && (
                    <>
                      <p>in</p>

                        <p className="text-md text-[#04c4f3]">{blog.category.Name}</p>

                    </>
                  )}
                </div>
              </div>
              <Image
                src={
                  blog.FeaturedImage.url.startsWith("http")
                    ? blog.FeaturedImage.url
                    : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${blog.FeaturedImage.url.replace(/^\/+/, "")}`
                }
                alt={blog.FeaturedImage.alternativeText || blog.Title}
                width={100}
                height={100}
                className="rounded "
              />
            </Link>
          )))
          :
          (
            <div className="flex flex-col gap-4 justify-end items-center">
            <div className=" w-full flex gap-4">
              <div className=" w-2/3 flex flex-col justify-center">
                <Skeleton variant="rounded" width='100%' height={40} sx={{ bgcolor: 'grey.900' }} style={{marginBottom: 6}}/>
                <Skeleton variant="rounded" width='80%' height={10} sx={{ bgcolor: 'grey.900' }} />
              </div>
              <div className="w-1/3">
                <Skeleton variant="rounded" width='100%' height={120} sx={{ bgcolor: 'grey.900' }} />
              </div>
            </div>
            <div className=" w-full flex gap-4">
              <div className=" w-2/3 flex flex-col justify-center">
                <Skeleton variant="rounded" width='100%' height={40} sx={{ bgcolor: 'grey.900' }} style={{marginBottom: 6}}/>
                <Skeleton variant="rounded" width='80%' height={10} sx={{ bgcolor: 'grey.900' }} />
              </div>
              <div className="w-1/3">
                <Skeleton variant="rounded" width='100%' height={120} sx={{ bgcolor: 'grey.900' }} />
              </div>
            </div>
            <div className=" w-full flex gap-4">
              <div className=" w-2/3 flex flex-col justify-center">
                <Skeleton variant="rounded" width='100%' height={40} sx={{ bgcolor: 'grey.900' }} style={{marginBottom: 6}}/>
                <Skeleton variant="rounded" width='80%' height={10} sx={{ bgcolor: 'grey.900' }} />
              </div>
              <div className="w-1/3">
                <Skeleton variant="rounded" width='100%' height={120} sx={{ bgcolor: 'grey.900' }} />
              </div>
            </div>
            <div className=" w-full flex gap-4">
              <div className=" w-2/3 flex flex-col justify-center">
                <Skeleton variant="rounded" width='100%' height={40} sx={{ bgcolor: 'grey.900' }} style={{marginBottom: 6}}/>
                <Skeleton variant="rounded" width='80%' height={10} sx={{ bgcolor: 'grey.900' }} />
              </div>
              <div className="w-1/3">
                <Skeleton variant="rounded" width='100%' height={120} sx={{ bgcolor: 'grey.900' }} />
              </div>
            </div>
            <div className=" w-full flex gap-4">
              <div className=" w-2/3 flex flex-col justify-center">
                <Skeleton variant="rounded" width='100%' height={40} sx={{ bgcolor: 'grey.900' }} style={{marginBottom: 6}}/>
                <Skeleton variant="rounded" width='80%' height={10} sx={{ bgcolor: 'grey.900' }} />
              </div>
              <div className="w-1/3">
                <Skeleton variant="rounded" width='100%' height={120} sx={{ bgcolor: 'grey.900' }} />
              </div>
            </div>
            </div>
          )
          }
        </div>
      </div>
    </header>
  );
}