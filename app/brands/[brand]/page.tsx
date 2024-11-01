import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { brand: string } }): Promise<Metadata> {
    const { brand } = await params;
    const uri_decoded = decodeURIComponent(brand);
    const filePath = path.join(process.cwd(), `app/brands/content/${uri_decoded}.mdx`);

    if (!fs.existsSync(filePath)) {
        return {
            title: 'Not Found',
            description: 'The brand you are looking for does not exist.',
        };
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter } = matter(fileContents);

    return {
        title: frontmatter.title,
        description: frontmatter.summary,
    };
}

export default async function Brand({ params }: Readonly<{ params: { brand: string } }>) {
    const { brand } = await params;
    const uri_decoded = decodeURIComponent(brand);
    const filePath = path.join(process.cwd(), `app/brands/content/${uri_decoded}.mdx`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { content } = matter(fileContents);

    return (
        <div className='w-full'>
            <div className='max-w-[1440px] mx-auto'>
                <div className='max-w-[1440px] prose dark:prose-invert p-8 py-8'>
                    <MDXRemote
                        source={content}
                    />
                    <Link href={`/`} className='mt-8 flex justify-start'>
                        <Button className=''><ArrowLeft /> Return &nbsp;</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
