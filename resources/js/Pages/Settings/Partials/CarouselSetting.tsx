import React, { useState, ChangeEvent, useEffect } from "react";
import { router } from "@inertiajs/react";

import { toast } from "sonner";

import { Upload } from "lucide-react";

interface settings {
    key: string;
    value: string;
    type: string;
}

interface CarouselSettingProps {
    onImagesChange?: (files: File[]) => void;
    settings: settings[];
}

const CarouselSetting: React.FC<CarouselSettingProps> = ({
    onImagesChange,
    settings,
}) => {
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

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
        });
    }, []);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        setImages([...images, ...files]);

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);

        onImagesChange?.([...images, ...files]);
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

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                                Click to upload
                            </span>{" "}
                            or drag and drop
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
                        <button
                            type="button"
                            onClick={() => deleteCarousel(preview)}
                            className="absolute hidden group-hover:flex items-center justify-center top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarouselSetting;
