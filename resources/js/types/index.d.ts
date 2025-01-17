import { Settings } from "http2";

interface Role{
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    image: string;
    phone: string;
    address: string;
    coordinates: string;
    email_verified_at?: string;
    phone_verified_at?: string;
    banned_until?: string;
    role: Role;
}

export interface settings {
    key: string;
    value: string;
    type: string;
}

export interface Category {
    id: number;
    name: string;
    image: string;
}

export interface ProductImages {
    id: number;
    product_id: number;
    url: string;
}

export interface Product {
    id: number;
    name: string;
    category: Category;
    category_id: number;
    price: number;
    min_order: number;
    sold: number;
    stock: number;
    description: string;
    visible: boolean;
    created_at: string;
    product_images: ProductImages[];
};

export  interface dataUndangan{
    id: number;
    bride_name: string;
    bride_father_name: string;
    bride_mother_name: string;
    groom_name: string;
    groom_father_name: string;
    groom_mother_name: string;
    location: string;
    akad: string;
    resepsi: string;
    note: string;
}

export interface Cart{
    id: number;
    user: User;
    product: Product;
    data_undangan: dataUndangan;
    quantity: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    settings: settings[];
    categories: Category[];
    products: Product[];
    totalCart: number;
};
