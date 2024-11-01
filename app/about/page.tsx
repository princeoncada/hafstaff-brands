import Image from "next/image";
import Link from "next/link";

export default function About() {
    return (
        <div className="max-w-[1440px] mx-auto px-6 py-12 space-y-16">
            <section className="text-center space-y-6">
                <h1 className="text-3xl font-bold">About Us</h1>
                <p className="max-w-3xl mx-auto">
                    Welcome to [Company Name]. We are committed to innovation, excellence, and building partnerships that empower businesses across industries.
                </p>
            </section>

            {/* Mission Section */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-center">Our Mission</h2>
                <div className="rounded-lg">
                    <Image src="/images/placeholder/600x300.png" alt="Mission" width={600} height={300} className="w-full h-auto rounded-lg" />
                    <p className="text-center italic mt-4">Driving success through partnership and innovation.</p>
                </div>
                <ul className="space-y-2  max-w-2xl mx-auto text-center">
                    <li>Create meaningful partnerships and foster growth.</li>
                    <li>Deliver innovative, quality-driven solutions.</li>
                    <li>Build success through collaboration.</li>
                </ul>
            </section>

            {/* Values Section */}
            <section>
                <h2 className="text-2xl font-semibold text-center mb-8">Our Values</h2>
                <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                    {[
                        { title: "Innovation", description: "Adapting and evolving with the latest industry trends.", img: "/images/placeholder/150x150.png" },
                        { title: "Excellence", description: "Delivering quality services that exceed expectations.", img: "/images/placeholder/150x150.png" },
                        { title: "Partnership", description: "Building lasting relationships with a focus on growth.", img: "/images/placeholder/150x150.png" },
                    ].map((value, index) => (
                        <div key={index} className="text-center">
                            <Image src={value.img} alt={value.title} width={150} height={150} className="w-36 h-36 rounded-full mx-auto" />
                            <h3 className="text-xl font-semibold mt-4">{value.title}</h3>
                            <p className="">{value.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Branches Section */}
            <section>
                <h2 className="text-2xl font-semibold text-center mb-8">Branches and Services</h2>
                {[
                    { name: "Branch 1", service: "Service Area", description: "Supporting growth with Branch 1 Service", img: "/images/placeholder/600x300.png" },
                    { name: "Branch 2", service: "Service Area", description: "Achieving results through Branch 2 Service", img: "/images/placeholder/600x300.png" },
                    { name: "Branch 3", service: "Service Area", description: "Elevating possibilities with Branch 3 Service", img: "/images/placeholder/600x300.png" },
                ].map((branch, index) => (
                    <div key={index} className="bg-gray-100 pb-6 rounded-lg mb-6">
                        <Image src={branch.img} alt={branch.name} width={600} height={300} className="w-full h-auto rounded-lg" />
                        <h3 className="text-xl font-semibold text-center mt-4 dark:text-black">{branch.name}</h3>
                        <p className="text-center italic mt-2 dark:text-black">{branch.description}</p>
                    </div>
                ))}
            </section>

            {/* Why Choose Us Section */}
            <section className="space-y-4 text-center">
                <h2 className="text-2xl font-semibold">Why Choose Us?</h2>
                <p className=" max-w-2xl mx-auto">
                    With a proven track record of success and a team of passionate experts, [Company Name] has become a trusted partner for businesses worldwide. Our approach is centered around understanding client needs and providing customized solutions that make a real difference.
                </p>
                <Link href="/contact" className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Let&apos;s make success happen
                </Link>
            </section>
        </div>
    );
}
