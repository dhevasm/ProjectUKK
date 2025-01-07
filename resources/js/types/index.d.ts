import { Settings } from "http2";

export interface User {
    id: number;
    name: string;
    email: string;
    image: string;
    phone: string;
    address: string;
    email_verified_at?: string;
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

interface ProductImages {
    id: number;
    product_id: number;
    url: string;
}

interface Products {
    id: number;
    name: string;
    category: Category;
    price: number;
    min_order: number;
    sold: number;
    description: string;
    visible: boolean;
    created_at: string;
    product_images: ProductImages[];
};

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    settings: settings[];
    categories: Category[];
    products: Products[];
};
