'use client';

import * as z from "zod";
import axios from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useToast } from "@/hooks/use-toast"
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
    emailAddress: z.string().email(),
    name: z.string().min(3).max(50),
    subject: z.string().min(5).max(100),
    message: z.string().min(10).max(500),
    timestamp: z.string()
});

export default function ContactForm() {
    const [honeyPotFieldName, setHoneyPotFieldName] = useState<string>("honeypot");
    const [loadTime, setLoadTime] = useState<number>(Date.now());
    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast()

    // Generate a random field name for the honeypot field
    useEffect(() => {
        const randomFieldName = `field_${Math.random().toString(36).substring(7)}`;
        setHoneyPotFieldName(randomFieldName);
        setLoadTime(Date.now());
    }, [])

    // Dynamically add the honeypot field to the form schema
    const dynamicFormSchema = formSchema.extend({
        [honeyPotFieldName]: z.string().optional().refine((value) => {
            return value === "" && Date.now() - loadTime > 3000;
        }, { message: "Spam detected!" })
    });

    // Initialize the form with the dynamic schema
    const form = useForm<z.infer<typeof dynamicFormSchema>>({
        resolver: zodResolver(dynamicFormSchema),
        defaultValues: {
            emailAddress: "",
            name: "",
            subject: "",
            message: "",
            timestamp: loadTime.toString()
        },
    })

    // Register the honeypot field into the form schema
    useEffect(() => {
        form.register(honeyPotFieldName);
    }, [honeyPotFieldName, form])

    // Initialize Google ReCaptcha Hook for Form Submission Verification
    const { executeRecaptcha } = useGoogleReCaptcha();

    // Handler for Form Submission
    async function handleSubmit(values: z.infer<typeof dynamicFormSchema>) {
        // Set Loading State to True
        setLoading(true);

        // Verify Recaptcha Token
        if (!executeRecaptcha) {
            console.error("Recaptcha not initialized");
            return;
        }

        // Initialize Recaptcha Token
        const gRecaptchaToken = await executeRecaptcha("contact_form");

        // Finalize Email HTML Template Body 

        // Initialize User Feedback Variables
        let title: string;
        let description: string;

        const htmlTemplate = `
            <div>
                <strong>Email:</strong> ${values.emailAddress}
                <br/>
                <strong>Name:</strong> ${values.name}
                <br/>
                <strong>Message:</strong> ${values.message}
            </div>
        `

        const data = {
            from: values.emailAddress,
            subject: values.subject,
            body: values.message,
            html: htmlTemplate,
            gRecaptchaToken
        }

        // Request to Send Email
        await axios({
            method: "POST",
            url: "/api/send-email",
            data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {

            // Successful Email Send User Feedback with Status Code 200
            title = response.status === 200 ? "Email Sent!" : "Something went wrong.";
            description = response.status === 200 ? "Your email was sent successfully." : "Failed to send email.";

            // Reset Form Fields on Successful Email Send
            form.reset();

        }).catch((error) => {

            // Uncaptured errors response status codes responses
            title = "Something went wrong.";
            description = "Contact form is currently unavailable.";

            // Rate Limit Exceeded User Feedback with Status Code 429
            title = error.status === 429 ? "Rate Limit Exceeded" : title;
            description = error.status === 429 ? "Please wait a moment before sending another email." : description;
        }).finally(() => {

            // Display User Feedback Toast Notification
            toast({
                title,
                description
            })
        })

        // Set Loading State to False
        setLoading(false);
    }

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-md w-full mx-auto flex flex-col gap-4">

                    {/* Honeypot Field - Randomized Name and Hidden */}
                    <input
                        type="text"
                        placeholder="Tell Us More"
                        {...form.register(honeyPotFieldName)}
                        className="hidden"
                        tabIndex={-1}
                        autoComplete="off"
                    />

                    {/* Timestamp Field - Hidden */}
                    <input
                        type="hidden"
                        value={loadTime.toString()}
                        {...form.register("timestamp")}
                    />

                    <FormField control={form.control} name="emailAddress" render={({ field }) => {
                        return <FormItem>
                            <FormLabel>Email address</FormLabel>
                            <FormControl>
                                <Input placeholder="john.doe@email.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }}></FormField>

                    <FormField control={form.control} name="name" render={({ field }) => {
                        return <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }}></FormField>

                    <FormField control={form.control} name="subject" render={({ field }) => {
                        return <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                                <Input placeholder="Your subject..." type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }}></FormField>

                    <FormField control={form.control} name="message" render={({ field }) => {
                        return <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Your message here..." rows={9} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }}></FormField>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <div className="flex flex-row gap-2 items-center justify-center"><LoaderCircle className="animate-spin" size={24} /> Please Wait</div> : "Submit"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}