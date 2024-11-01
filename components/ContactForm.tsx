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

    useEffect(() => {
        const randomFieldName = `field_${Math.random().toString(36).substring(7)}`;
        setHoneyPotFieldName(randomFieldName);
        setLoadTime(Date.now());
    }, [])

    const dynamicFormSchema = formSchema.extend({
        [honeyPotFieldName]: z.string().optional().refine((value) => {
            return value === "" && Date.now() - loadTime > 3000;
        }, { message: "Spam detected!" })
    });

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

    useEffect(() => {
        form.register(honeyPotFieldName);
    }, [honeyPotFieldName, form])

    const { executeRecaptcha } = useGoogleReCaptcha();

    async function handleSubmit(values: z.infer<typeof dynamicFormSchema>) {
        if (!executeRecaptcha) {
            console.error("Recaptcha not initialized");
            return;
        }

        const gRecaptchaToken = await executeRecaptcha("contact_form");

        const response = await axios({
            method: "POST",
            url: "/api/recaptcha-submit",
            data: {
                gRecaptchaToken
            },
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.data.success === true) {
            console.log("Recaptcha verification successful");
            console.log(values);
        } else {
            console.error("Recaptcha verification failed");
        }
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
                                <Input placeholder="Email address" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }}></FormField>

                    <FormField control={form.control} name="name" render={({ field }) => {
                        return <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Name" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }}></FormField>

                    <FormField control={form.control} name="subject" render={({ field }) => {
                        return <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                                <Input placeholder="Subject" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }}></FormField>

                    <FormField control={form.control} name="message" render={({ field }) => {
                        return <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Message" rows={9} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }}></FormField>

                    <Button type="submit" className="w-full">
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    );
}