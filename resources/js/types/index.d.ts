export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    is_admin?: boolean;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    products_count?: number;
}

export interface Product {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string;
    short_description: string | null;
    price: string;
    is_free: boolean;
    type: 'software' | 'hardware';
    download_url: string | null;
    version: string | null;
    images: string[] | null;
    thumbnail: string | null;
    model_3d_url: string | null;
    features: string[] | null;
    system_requirements: Record<string, string> | null;
    stock: number;
    is_active: boolean;
    is_featured: boolean;
    category?: Category;
    created_at: string;
    updated_at: string;
}

export interface CartItem {
    product_id: number;
    name: string;
    price: string;
    thumbnail: string | null;
    quantity: number;
    type: string;
}

export interface Order {
    id: number;
    order_number: string;
    total: string;
    status: string;
    items: OrderItem[];
    created_at: string;
}

export interface OrderItem {
    id: number;
    product_id: number;
    quantity: number;
    price: string;
    product: Product;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    path: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null;
    };
    cart: Record<string, CartItem>;
    flash: {
        success: string | null;
        error: string | null;
    };
};
