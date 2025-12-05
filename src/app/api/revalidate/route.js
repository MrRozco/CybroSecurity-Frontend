import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  // Optional: Add a secret token for security
  const secret = process.env.REVALIDATE_SECRET;
  const authHeader = request.headers.get('authorization');

  // Verify secret token if configured
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { path, tag, type } = body;

    // Revalidate by path
    if (path) {
      await revalidatePath(path);
      console.log(`Revalidated path: ${path}`);
      return NextResponse.json({ 
        revalidated: true, 
        path,
        message: `Revalidated: ${path}`,
        now: Date.now() 
      });
    }

    // Revalidate by tag
    if (tag) {
      await revalidateTag(tag);
      console.log(`Revalidated tag: ${tag}`);
      return NextResponse.json({ 
        revalidated: true, 
        tag,
        message: `Revalidated tag: ${tag}`,
        now: Date.now() 
      });
    }

    // Revalidate by content type (blogs, categories, etc.)
    if (type) {
      switch (type) {
        case 'blog':
          await revalidateTag('blogs');
          await revalidatePath('/');
          console.log('Revalidated all blogs and homepage');
          break;
        case 'category':
          await revalidateTag('categories');
          await revalidatePath('/');
          console.log('Revalidated all categories and homepage');
          break;
        case 'homepage':
          await revalidatePath('/');
          console.log('Revalidated homepage');
          break;
        case 'crew':
          await revalidatePath('/crew');
          console.log('Revalidated crew page');
          break;
        default:
          return NextResponse.json(
            { message: 'Invalid type specified' },
            { status: 400 }
          );
      }
      return NextResponse.json({ 
        revalidated: true, 
        type,
        message: `Revalidated: ${type}`,
        now: Date.now() 
      });
    }

    // No valid revalidation parameter provided
    return NextResponse.json(
      { message: 'Missing path, tag, or type parameter' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating', error: error.message },
      { status: 500 }
    );
  }
}
