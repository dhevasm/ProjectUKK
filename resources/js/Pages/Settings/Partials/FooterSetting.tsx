import { useEffect } from "react";
import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { settings } from "@/types";

interface FooterData {
    description: string;
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
}

interface FooterSettingsProps {
    onSubmit: (data: FooterData) => void;
    settings: settings[];
}

const FooterSetting: React.FC<FooterSettingsProps> = ({
    onSubmit,
    settings,
}) => {
    const [data, setData] = React.useState<FooterData>({
        description: "",
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
    });

    useEffect(() => {
        settings.forEach((setting) => {
            if (setting.key === "web_footer_desc") {
                setData((prev) => ({ ...prev, description: setting.value }));
            }
            if (setting.key === "web_fb_link") {
                setData((prev) => ({ ...prev, facebook: setting.value }));
            }
            if (setting.key === "web_ig_link") {
                setData((prev) => ({ ...prev, instagram: setting.value }));
            }
            if (setting.key === "web_tw_link") {
                setData((prev) => ({ ...prev, twitter: setting.value }));
            }
            if (setting.key === "web_ln_link") {
                setData((prev) => ({ ...prev, linkedin: setting.value }));
            }
        });
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={data.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Enter footer description"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook URL</Label>
                    <Input
                        id="facebook"
                        name="facebook"
                        type="url"
                        value={data.facebook}
                        onChange={handleChange}
                        placeholder="https://facebook.com/..."
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram URL</Label>
                    <Input
                        id="instagram"
                        name="instagram"
                        type="url"
                        value={data.instagram}
                        onChange={handleChange}
                        placeholder="https://instagram.com/..."
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter URL</Label>
                    <Input
                        id="twitter"
                        name="twitter"
                        type="url"
                        value={data.twitter}
                        onChange={handleChange}
                        placeholder="https://twitter.com/..."
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                        id="linkedin"
                        name="linkedin"
                        type="url"
                        value={data.linkedin}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/..."
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-[var(--app-color)] rounded-lg hover:bg-[var(--app-hover-color)]"
            >
                Save Changes
            </button>
        </form>
    );
};

export default FooterSetting;
