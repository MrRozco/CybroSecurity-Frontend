import { getCategories } from "@/lib/strapi";
import Link from 'next/link';
import Image from 'next/image';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

export default async function  CategoryFeed(data) {

    const { category, topBlogs, topTitle } = data.data;
    const categories = await getCategories();
    const feedCategory = categories.find((cat) => cat.Slug === category.Slug);

    if (!feedCategory) {
        return <div>Category not found</div>;
    }

    const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/blogs?filters[category][Slug][$eq]=${feedCategory.Slug}&populate=*`
  );
  

    const categoryBlogs = (await response.json()).data;

    if (!categoryBlogs || categoryBlogs.length === 0) {
        return <div>No blogs found in this category</div>;
    }

    const [firstBlog, ...otherBlogs] = categoryBlogs;


    return (
        <section className="flex flex-col-reverse md:flex-row mt-40 justify-around">
            
            <div className="md:w-1/2 w-full flex flex-col relative ">
            <h2 className="
                    md:absolute md:right-[calc(100%+2.7rem)] md:top-5 z-20
                    !text-7xl font-bold
                    whitespace-nowrap
                    md:rotate-270 md:origin-top-right
                    pointer-events-none
                    ">{feedCategory.Name}</h2>
                <div className="border-b-6 border-[#1D2630]  hover:bg-[#1D2630] p-4">
                    
                    {firstBlog ? (
                        <div className="">
                            <Link href={`/blogs/${firstBlog.Slug}`}>
                                <div className="relative mb-0">
                                    {/* Overlay only covers the image */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent rounded z-10"></div>
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
                                </div>
                                {/* Text block is outside the image container */}
                                <div className="relative z-20 rounded-b  -mt-8 ">
                                    <h3 className="text-5xl font-bold">{firstBlog.Title}</h3>
                                    <p className="text-white mt-2 text-xl">{firstBlog.Excerpt}</p>
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <Skeleton variant="rectangular" width='100%' height={700} sx={{ bgcolor: 'grey.900' }}/>
                    )}
                </div>
                <div>
                    {otherBlogs.length > 0 ? ( otherBlogs.slice(0, 5).map((blog, i) => (
                        <Link key={i} href={`/blogs/${blog.Slug}`} className="">
                        <div key={blog.id} className="flex  hover:bg-[#1D2630] p-4 justify-between items-center border-b-6 border-[#1D2630]">
                            <div>
                                <h3 className="text-4xl font-bold mb-2 text-white">{blog.Title}</h3>
                                <p className="text-white mb-4 text-xl">{blog.Excerpt}</p>       
                            </div>
                            {blog.FeaturedImage && (
                                <Image
                                    src={
                                        blog.FeaturedImage.url.startsWith("http")
                                        ? blog.FeaturedImage.url
                                        : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${blog.FeaturedImage.url.replace(/^\/+/, "")}`
                                    }
                                    alt={blog.Title}
                                    width={150}
                                    height={150}
                                    className="rounded-lg"
                                />
                            )}
                        </div>
                        </Link>
                    ))) : (
                        <div className="flex flex-col gap-4 justify-end items-center">
                            <div className=" w-full flex gap-4 mt-5">
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
                    )}
                </div>
                <Link href={`/category/${feedCategory.Slug}`} className="text-[#04c4f3] text-2xl mt-4 hover:underline">
                View all in {feedCategory.Name}
                </Link>
            </div>
            <div className="md:w-1/3 w-full rounded-lg p-6 bg-[#04c4f3] h-fit md:sticky top-10 z-100 mb-10 ">
                {topTitle && (
                    <h3 className="
                    md:absolute md:right-[calc(100%+2.9rem)] md:top-0
                    !text-7xl font-bold
                    whitespace-nowrap
                    md:rotate-270 md:origin-top-right
                    pointer-events-none
                    ">
                    {topTitle}
                    </h3>
                )}
                {topBlogs && ( 
                    topBlogs.map((blog, i) => (
                        <div key={i}>
                            <Link href={`/blogs/${blog.Slug}`} key={blog.id} >
                                <div className="mb-8 pb-4 border-b-3 border-[#0467df] hover:underline decoration-[#0467df] hover:decoration-[#0467df] transition">
                                    <h4 className="text-3xl font-bold mt-4">{blog.Title}</h4>
                                    <p className="text-[#040e1a] text-xl mt-2">{blog.Excerpt}</p>
                                </div>
                            </Link>
                        </div>
                    ))
                    
                )}

            </div>
            <div></div>
            
        </section>
    )
}