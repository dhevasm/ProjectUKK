import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useRef, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import CarouselSetting from "./Partials/CarouselSetting";
import FooterSetting from "./Partials/FooterSetting";
import ColorSetting from "./Partials/ColorSetting";
import EventSetting from "./Partials/EventSetting";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { toast } from "sonner";
import { settings } from "@/types";

interface SettingsProps {
    settings: settings[];
}

interface FooterData {
    description: string;
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
}

export default function Settings({ settings }: SettingsProps) {
    const [defaultColor, setDefaultColor] = useState("#3b82f6");
    const [color, setColor] = useState(import.meta.env.VITE_APP_COLOR || "#3b82f6");
    const [event, setEvent] = useState( "");
    const [eventLink, setEventLink] = useState("");
    const [webName, setWebName] = useState(import.meta.env.VITE_APP_NAME || 'Laravel');
    const [webIcon, setWebIcon] = useState<File | null>(null);

    useEffect(() => {
        settings.forEach((setting) => {
            if (setting.key === "web_event") {
                setEvent(setting.value);
            }
            if (setting.key === "web_event_link") {
                setEventLink(setting.value);
            }
        });
    }, [])


    const eventPrefiew = useRef<HTMLDivElement>(null);

    const handleColorChange = (e: any) => {
        setColor(e.target.value);
        eventPrefiew.current?.style.setProperty(
            "background-color",
            e.target.value
        );
    };

    const setDefault = () => {
        setColor(defaultColor);
        eventPrefiew.current?.style.setProperty("background-color", defaultColor);
    };

    useEffect(() => {
        eventPrefiew.current?.style.setProperty("background-color", color);
    },[])

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setWebIcon(file);
    };

    const generalSave = () => {
        router.post(route("setting.store"), {
            "web_name" : webName,
            "web_icon" : webIcon,
        },{
            onSuccess: () => {
                toast.success("Settings saved", {
                    description: "General settings has been saved successfully",
                });
            },
            onError: (errors) => {
                toast.error("Failed to save settings", {
                    description: "An error occurred : " + Object.values(errors)[0],
                });
            }
        });
    }

    const colorSave = () => {
        router.post(route("setting.store"), {
            "web_color" : color,
        },{
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Settings saved", {
                    description: "Color setting has been saved successfully",
                });
            },
            onError: (errors) => {
                toast.error("Failed to save settings", {
                    description: "An error occurred : " + Object.values(errors)[0],
                });
            }
        });
    }

    const eventSave = () => {
        router.post(route("setting.store"), {
            "web_event" : event,
            "web_event_link" : eventLink,
        },{
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Settings saved", {
                    description: "Event setting has been saved successfully",
                });
            },
            onError: (errors) => {
                toast.error("Failed to save settings", {
                    description: "An error occurred : " + Object.values(errors)[0],
                });
            }
        });
    }

    const footerSave = (data: FooterData) => {
        router.post(route("footerSetting"), {
            "web_footer_desc" : data.description,
            "web_fb_link" : data.facebook,
            "web_ig_link" : data.instagram,
            "web_tw_link" : data.twitter,
            "web_ln_link" : data.linkedin,
        },{
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Settings saved", {
                    description: "Footer setting has been saved successfully",
                });
            },
            onError: (errors) => {
                toast.error("Failed to save settings", {
                    description: "An error occurred : " + Object.values(errors)[0],
                });
            }
        });
    }

    const carouselSave = (data: File[]) => {
        router.post(route("carouselSetting"), {
            "carousel_image" : data[0],
        },{
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Settings saved", {
                    description: "Carousel setting has been saved successfully",
                });
            },
            onError: (errors) => {
                toast.error("Failed to save settings", {
                    description: "An error occurred : " + Object.values(errors)[0],
                });
            }
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Settings
                </h2>
            }
        >
            <Head title="Settings" />
            <div className="py-12 space-y-3">
                <div className="flex flex-col md:flex-row gap-2 w-full px-4 sm:px-6 lg:px-8">
                    <div className="w-full ">
                        <div className="overflow-hidden bg-white dark:bg-customDark shadow-sm rounded-md sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-200">
                                <div>
                                    General Setting
                                    <hr className="py-2" />
                                </div>
                                <div className="flex flex-col md:flex-row gap-2">
                                    <span className="w-full">
                                        <Label>Web Name</Label>
                                        <Input type="text" value={webName} onChange={(e) => setWebName(e.target.value)} />
                                    </span>
                                    <span className="w-full">
                                        <Label>Web Icon (.ico)</Label>
                                        <Input  type="file" onChange={handleIconChange} />
                                    </span>
                                    <span className="self-end">
                                        <Button onClick={generalSave} className="px-4 py-2 text-sm text-[var(--app-color)] bg-gray-100 dark:bg-slate-900 rounded-md hover:bg-gray-200 hover:dark:bg-slate-950 transition-color">
                                            Save
                                        </Button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="overflow-hidden bg-white dark:bg-customDark shadow-sm rounded-md sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-200 space-y-2">
                                Theme Setting
                                <hr className="py-2" />
                                <div className="flex items-center gap-2 pb-2">
                                    <ColorSetting setColor={setColor} color={color} handleColorChange={handleColorChange} setDefault={setDefault} colorSave={colorSave} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white dark:bg-customDark shadow-sm rounded-md sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-200">
                            Header Event Setting
                            <hr className="py-2" />
                            <div className="flex flex-col md:flex-row gap-2">
                                <EventSetting eventSave={eventSave} event={event} setEvent={setEvent} eventLink={eventLink} setEventLink={setEventLink} />
                            </div>
                            <p className="mt-3">Preview</p>
                            <div
                                ref={eventPrefiew}
                                className={`text-white text-center py-2 min-h-9 text-sm`}
                            >
                                <a
                                    href={eventLink}
                                    target="_blank"
                                    className="hover:underline"
                                >
                                    {event}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white dark:bg-customDark shadow-sm rounded-md sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-200">
                            Carousel Setting
                            <hr className="py-2" />
                            <CarouselSetting
                                onImagesChange={(files) => carouselSave(files)}
                                settings={settings}
                            />
                        </div>
                    </div>
                </div>
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white dark:bg-customDark shadow-sm rounded-md sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-200">
                            Footer Setting
                            <hr className="py-2" />
                            <FooterSetting
                                onSubmit={(data) => {
                                    footerSave(data);
                                }}
                                settings={settings}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
