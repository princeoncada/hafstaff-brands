import ContactForm from "@/components/ContactForm";
import GoogleCaptchaWrapper from "@/components/GoogleCaptchaWrapper";
import Image from "next/image";

export default function Contact() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
            {/* Page Title */}
            <section className="text-center">
                <h1 className="text-3xl font-bold">Get in Touch</h1>
                <p className=" mt-4">
                    We&apos;d love to hear from you! Whether you have questions, feedback, or a project in mind, our team is here to help.
                </p>
            </section>

            {/* Contact Information */}
            <section className="grid grid-cols-1 md:grid-cols-2 md:gap-16 gap-8">
                <div className="flex items-center w-full h-full">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-semibold">Contact Information</h2>
                        <p className="">Feel free to reach out to us directly through any of the contact details below.</p>
                        <div className="flex flex-col flex-1">
                            <p className="font-medium">Email: <a href="mailto:info@company.com" className="text-blue-500 hover:underline">info@company.com</a></p>
                            <p className="font-medium">Phone: <a href="tel:+1234567890" className="text-blue-500 hover:underline">+1 (234) 567-890</a></p>
                            <p className="font-medium">Address: 123 Business Avenue, Suite 101, City, Country</p>
                        </div>
                    </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-gray-100 rounded-lg">
                    <Image
                        src="/images/placeholder/600x300.png"
                        width={600}
                        height={300}
                        alt="Map Placeholder"
                        className="w-full h-auto rounded-lg"
                    />
                </div>
            </section>

            {/* Contact Form */}
            <section>
                <GoogleCaptchaWrapper>
                    <ContactForm />
                </GoogleCaptchaWrapper>
            </section>
        </div>
    );
}
