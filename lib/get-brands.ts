import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BrandMetadata } from '@/types/Brand';

const brandsDirectory = path.join(process.cwd(), 'app/brands/content');

export function getAllBrands(): (BrandMetadata & { slug: string })[] {
    const fileNames = fs.readdirSync(brandsDirectory);

    const brands = fileNames.map((fileName) => {
        const filePath = path.join(brandsDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);

        return {
            ...data as BrandMetadata,
            slug: fileName.replace(/\.mdx$/, ''),
        }
    });

    return brands;
}