import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandMetadata } from "@/types/Brand";
import Image from "next/image";
import Link from "next/link";

interface BrandCardProps {
    brand: BrandMetadata & { slug: string };
}

export default function BrandCard({ brand }: Readonly<BrandCardProps>) {
    const formattedDate = new Date(brand.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <Link href={`/brands/${brand.slug}`}>
            <Card>
                <CardHeader className="gap-2">
                    <CardTitle>{brand.title}</CardTitle>
                    <CardDescription>{brand.summary}</CardDescription>
                </CardHeader>
                <CardContent className="px-6">
                    <div className="relative w-full h-96">
                        <Image
                            className="w-full h-full object-cover"
                            src={brand.images[1]}
                            alt={brand.title}
                            width={500}
                            height={500}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <p className="text-sm">{formattedDate}</p>
                </CardFooter>
            </Card>
        </Link>
    );
}
