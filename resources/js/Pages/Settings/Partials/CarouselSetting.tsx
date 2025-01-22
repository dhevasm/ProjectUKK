import React, { useState, ChangeEvent, useEffect } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { settings } from "@/types";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";

interface CarouselSettingProps {
    onImagesChange?: (files: File[]) => void;
    settings: settings[];
}

interface CarouselLink {
    key: string;
    value: string;
  }

const CarouselSetting: React.FC<CarouselSettingProps> = ({
    onImagesChange,
    settings,
}) => {
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [link, setLink] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [carouselLink, setCarouselLink] = useState<CarouselLink[]>([]);

    useEffect(() => {
        settings.forEach((setting) => {
            if (setting.key.includes("carousel_image")) {
                setPreviews((prevPreviews) => {
                    if (!prevPreviews.includes(setting.value)) {
                        return [...prevPreviews, setting.value];
                    }
                    return prevPreviews;
                });
            }
            if (setting.key.includes("carousel_link")) {
                setCarouselLink((prevLinks) => {
                  const key = setting.key.split("_").pop() as string;
                  const value = setting.value as string;
                  if (!prevLinks.some((link) => link.key === key)) {
                    return [...prevLinks, { key, value }];
                  }
                  return prevLinks;
                });
              }
        });
    }, []);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        setImages(files);

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);

        onImagesChange?.(files);
    };

    const deleteCarousel = (name : string) => {
        router.delete(route("deleteCarousel", "carousel_image_" + name.split("/").pop()?.split(".")[0]), {
            preserveScroll: true,
            onSuccess: () => {
                setPreviews(previews.filter((preview) => preview !== name));
                toast.success("carousel deleted", {
                    description: "caraousel has been deleted successfully",
                });
            },
            onError: (errors : any) => {
                toast.error("Failed to delete carousel", {
                    description: "An error occurred : " + Object.values(errors)[0],
                });
            }
        });
    }



    const handleLinkClick = (preview: any) => {
        setSelectedImage(preview);
        if(carouselLink.some((link) => link.key === preview.split("/").pop()?.split(".")[0])){
            setLink(carouselLink.find((link) => link.key === preview.split("/").pop()?.split(".")[0])?.value as string);
        }else{
            setLink('');
        }
        setOpen(true);
    };

    const handleSubmit = () => {
        router.post(route("setCarouselLink"), {
            'carousel_name' : selectedImage,
            'carousel_link' : link
        },{
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Link added", {
                    description: "Link has been added successfully",
                });
            },
            onError: (errors : any) => {
                toast.error("Failed to add link", {
                    description: "An error occurred : " + Object.values(errors)[0],
                });
            }
        });
        setOpen(false);
        setLink('');
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-customDark">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                                Click to upload
                            </span>{" "}
                        </p>
                        <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                        </p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </label>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                        <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute hidden group-hover:flex items-center space-x-2 top-2 right-2">
                            <button
                                type="button"
                                onClick={() => deleteCarousel(preview)}
                                className="w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center"
                            >
                                ×
                            </button>
                            <button
                                type="button"
                                onClick={() => handleLinkClick(preview)}
                                className="w-6 h-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center justify-center"
                            >
                                🔗
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Link to Image</DialogTitle>
                    </DialogHeader>
                    <Input
                        type="url"
                        placeholder="Enter image link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                    <DialogFooter>
                        <Button variant={"theme"} onClick={handleSubmit}>Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CarouselSetting;
