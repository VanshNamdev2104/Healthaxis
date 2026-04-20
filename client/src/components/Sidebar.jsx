import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SidebarContext = createContext();

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used inside SidebarProvider");
    }
    return context;
};

export const SidebarProvider = ({
    children,
    open: openProp,
    setOpen: setOpenProp,
    animate = true,
}) => {
    const [openState, setOpenState] = useState(false);

    const open = openProp !== undefined ? openProp : openState;
    const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

    return (
        <SidebarContext.Provider value={{ open, setOpen, animate }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const Sidebar = ({ children, open, setOpen, animate }) => {
    return (
        <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
            {children}
        </SidebarProvider>
    );
};

export const SidebarBody = (props) => {
    return (
        <>
            <DesktopSidebar {...props} />
            <MobileSidebar {...props} />
        </>
    );
};

export const DesktopSidebar = ({ className, children, ...props }) => {
    const { open, setOpen, animate } = useSidebar();

    return (
        <motion.div
            className={`h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 ${className || ""}`}
            animate={{
                width: animate ? (open ? "300px" : "60px") : "300px",
            }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const MobileSidebar = ({ className, children, ...props }) => {
    const { open, setOpen } = useSidebar();

    return (
        <>
            <div
                className="h-10 px-4 py-4 flex md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
                {...props}
            >
                <div className="flex justify-end w-full">
                    <Menu
                        className="cursor-pointer text-neutral-800 dark:text-neutral-200"
                        onClick={() => setOpen(!open)}
                    />
                </div>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ x: "-100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "-100%", opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`fixed inset-0 w-full h-full bg-white dark:bg-neutral-900 p-10 z-50 flex flex-col justify-between ${className || ""}`}
                        >
                            <div
                                className="absolute right-10 top-10 cursor-pointer"
                                onClick={() => setOpen(false)}
                            >
                                <X />
                            </div>

                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export const SidebarLink = ({ link, className, active }) => {
    const { open, animate } = useSidebar();

    return (
        <a
            href={link.href}
            onClick={(e) => {
                if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                }
            }}
            className={cn(
                "flex items-center gap-2 py-2 px-2 rounded-lg transition-all duration-200 group/sidebar",
                active
                    ? "bg-gradient-to-r from-indigo-500/20 to-cyan-500/10 border border-indigo-500/20 text-white"
                    : "hover:bg-white/5 text-neutral-700 dark:text-neutral-200",
                className
            )}
        >
            <span className={cn(
                "flex-shrink-0 transition-colors",
                active && "[&>svg]:text-indigo-400"
            )}>
                {link.icon}
            </span>

            <motion.span
                animate={{
                    display: animate
                        ? open
                            ? "inline-block"
                            : "none"
                        : "inline-block",
                    opacity: animate
                        ? open
                            ? 1
                            : 0
                        : 1,
                }}
                className={cn(
                    "text-sm transition group-hover/sidebar:translate-x-1 whitespace-nowrap",
                    active
                        ? "text-white font-semibold"
                        : "text-neutral-700 dark:text-neutral-200"
                )}
            >
                {link.label}
            </motion.span>
        </a>
    );
};