import { getAllBrands } from "@/lib/get-brands";
import BrandCard from "@/components/BrandCard";

export default function Home() {
    const brands = getAllBrands();

    return (
        <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 p-4 md:py-8 gap-4">
                {
                    brands.map((brand) => (
                        <BrandCard key={brand.slug} brand={brand} />
                    ))
                }
            </div>
        </div>
    );
}
