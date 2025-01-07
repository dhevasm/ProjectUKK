import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { toast } from "sonner";

interface ColorSettingProps {
    color: string;
    setColor: (color: string) => void;
    handleColorChange: (e: any) => void;
    setDefault: () => void;
    colorSave : () => void;
}


export default function ColorSetting({color, handleColorChange, setDefault, setColor, colorSave} : ColorSettingProps) {

    const copyToClipboard = () => {
        navigator.clipboard.writeText(color);
        toast.success("Copied to clipboard", {
            description: "Color copied to clipboard",
        });
    };

    return (
        <>
            <Input
                type="color"
                value={color}
                onChange={handleColorChange}
                className="w-12 h-12 p-1 rounded cursor-pointer"
            />
            <div className="flex-1">
                <Input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <Button
                onClick={setDefault}
                className="px-4 py-2 text-sm text-[var(--app-color)] bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
                Default
            </Button>
            <Button
                onClick={copyToClipboard}
                className="px-4 py-2 text-sm text-[var(--app-color)] bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
                Copy
            </Button>
            <Button
                onClick={colorSave}
                className="px-4 py-2 text-sm text-[var(--app-color)] bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
                Save
            </Button>
        </>
    );
}
