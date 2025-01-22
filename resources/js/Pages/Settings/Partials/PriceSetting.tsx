import { useEffect, useState } from "react"
import { Label } from "@/Components/ui/label"
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { router } from "@inertiajs/react"
import { toast } from "sonner"
import { settings } from "@/types"

export default function PriceSetting({settings} : {settings: settings[]}) {

    const [data, setData] = useState({
        productionPrice: 0,
        deliveryPrice: 0,
        tax: 0
    });

     useEffect(() => {
        settings.forEach((setting) => {
            if (setting.key === "production_price") {
                setData((prev) => ({ ...prev, productionPrice: parseInt(setting.value) }));
            }
            if (setting.key === "delivery_price") {
                setData((prev) => ({ ...prev, deliveryPrice: parseInt(setting.value) }));
            }
            if (setting.key === "tax") {
                setData((prev) => ({ ...prev, tax: parseInt(setting.value) }));
            }

        });
    }, []);

    const handleChange = (e: any) => {
        if(e.target.value < 0) {
            return;
        }
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }


    useEffect(() => {
        if(data.tax > 100) {
            setData({
                ...data,
                tax: 100
            });
        }
    }, [data.tax])

    const handleSubmit = () => {
        router.post(route('priceSetting'), {
            production_price: data.productionPrice,
            delivery_price : data.deliveryPrice,
            tax: data.tax
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Settings saved", {
                    description: "Price setting has been saved successfully",
                });
            },
            onError: (errors : any) => {
                toast.error("Failed to save settings", {
                    description: "An error occurred : " + Object.values(errors)[0],
                });
            }
        });
    }

  return (
    <>
          <span className="w-full">
                <Label>{"Production Price (Rp) "}</Label>
                <Input type="number" name="productionPrice" value={data.productionPrice} onChange={handleChange}/>
            </span>
          <span className="w-full">
                <Label>{"Delivery Price (Rp)"}</Label>
                <Input type="number" name="deliveryPrice" value={data.deliveryPrice} onChange={handleChange}/>
            </span>
          <span className="w-full">
                <Label>{"Tax (%)"}</Label>
                <Input type="number" name="tax" value={data.tax} onChange={handleChange}/>
            </span>
        <Button onClick={handleSubmit} className="px-4 py-2 text-sm text-[var(--app-color)] bg-gray-100 dark:bg-slate-900 hover:dark:bg-slate-950 rounded-md hover:bg-gray-200 transition-color">
            Save
        </Button>
    </>
  )
}
