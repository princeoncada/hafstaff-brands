'use client';

import { useEffect, useState } from "react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import Link from "next/link";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes"
// import Image from 'next/image'

const links = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "About",
        href: "/about",
    },
    {
        name: "Contact",
        href: "/contact",
    }
]

export default function Menubar() {
    const [open, setOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const { setTheme, resolvedTheme } = useTheme()
    const [loadTheme, setLoadTheme] = useState(false);

    useEffect(() => {
        setDarkMode(resolvedTheme === "dark");
        setLoadTheme(true);
    }, [resolvedTheme]);

    function toggleDrawer() {
        setOpen(!open);
    }

    function toggleDarkMode() {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        setTheme(newDarkMode ? "dark" : "light");
    }

    return (
        <>
            <div className="md:hidden relative flex flex-row items-center justify-center p-4 py-9">
                <div className="absolute left-4">
                    {loadTheme && <Button className="px-2" variant="outline" onClick={toggleDarkMode}>
                        {!darkMode ? <Sun /> : <Moon />}
                    </Button>}
                </div>
                <div className="w-48 text-center text-3xl">
                    {/* <Link href={`/`}>
                        <Image src={`/logo.webp`} alt="Company Logo" width={2000} height={2000} />
                    </Link> */}
                    <Link href={`/`}>
                        HAFSTAFF
                    </Link>
                </div>
                <div className="absolute right-4">
                    <Drawer open={open} onOpenChange={setOpen}>
                        <DrawerTrigger className="flex justify-center items-center p-2 rounded-md border-input border" onClick={toggleDrawer}>
                            {open ? <X size={18} /> : <Menu size={18} />}
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Main Menu</DrawerTitle>
                            </DrawerHeader>
                            <DrawerFooter>
                                <div className="flex flex-col gap-3.5">
                                    {
                                        links.map((link) => (
                                            <Link href={link.href} key={link.name}>
                                                {link.name}
                                            </Link>
                                        ))
                                    }
                                </div>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>

            <div className="hidden md:block max-w-[1440px] mx-auto py-6">
                <div className="relative flex flex-row items-center justify-center p-3">
                    <div className="absolute left-4">
                        <div className="w-48 text-center text-3xl">
                            {/* <Link href={`/`}>
                                <Image src={`/logo.webp`} alt="Company Logo" width={2000} height={2000} />
                            </Link> */}
                            <Link href={`/`}>
                                HAFSTAFF
                            </Link>
                        </div>
                    </div>
                    <div>
                        <NavigationMenu>
                            <NavigationMenuList>
                                {
                                    links.map((link) => (
                                        <NavigationMenuItem key={link.name}>
                                            <Link href={`${link.href}`} className={navigationMenuTriggerStyle()}>
                                                {link.name}
                                            </Link>
                                        </NavigationMenuItem>
                                    ))
                                }
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    <div className="absolute right-4">
                        {loadTheme && <Button className="px-2" variant="outline" onClick={toggleDarkMode}>
                            {!darkMode ? <Sun /> : <Moon />}
                        </Button>}
                    </div>
                </div>
            </div>
        </>
    );
}
