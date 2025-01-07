import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";

import { router } from "@inertiajs/react";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/Components/ui/alert-dialog"

interface EventSettingProps {
    event: string;
    setEvent: (event: string) => void;
    eventLink: string;
    setEventLink: (eventLink: string) => void;
    eventSave: () => void;
}


export default function EventSetting({event, setEvent, eventLink, setEventLink, eventSave} : EventSettingProps) {
    const handleDelete = () => {
        router.delete(route('deleteEvent'), {
            preserveScroll: true,
            onSuccess: () => {
                setEvent("");
                setEventLink("");
                toast.success("Settings deleted", {
                    description: "Event setting has been deleted successfully",
                });
            },
            onError: (errors : any) => {
                toast.error("Failed to delete settings", {
                    description: "An error occurred : " + Object.values(errors)[0],
                });
            }
        });
    }

    return (
        <>
            <span className="w-full">
                <Label>Event</Label>
                <Input
                    type="text"
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                />
            </span>
            <span className="w-full">
                <Label>Link</Label>
                <Input
                    type="text"
                    value={eventLink}
                    onChange={(e) => setEventLink(e.target.value)}
                />
            </span>
            <span className="self-end flex gap-2">
                <AlertDialog>
                    <AlertDialogTrigger>
                        <Button className='px-4 py-2 text-sm text-[var(--app-color)] bg-gray-100 rounded-md hover:bg-gray-200 transition-color'>
                            Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete event settings
                                and remove data from servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className='px-0' onClick={handleDelete}>
                                <Button className='bg-red-500 hover:bg-red-600 w-full px-2 py-1 text-sm rounded'>
                                    Continue
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <Button onClick={eventSave} className="px-4 py-2 text-sm text-[var(--app-color)] bg-gray-100 rounded-md hover:bg-gray-200 transition-color">
                    Save
                </Button>
            </span>
        </>
    );
}
