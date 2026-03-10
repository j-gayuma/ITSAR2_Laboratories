export type Category = {
    id: number;
    name: string;
    icon: string | null;
    books_count?: number;
    created_at: string;
    updated_at: string;
};

export type Book = {
    id: number;
    title: string;
    author: string;
    description: string | null;
    cover_image: string | null;
    published_at: string | null;
    category_id: number;
    is_available: boolean;
    is_favorited?: boolean;
    category?: Category;
    created_at: string;
    updated_at: string;
};

export type Borrow = {
    id: number;
    user_id: number;
    book_id: number;
    borrowed_at: string;
    due_at: string | null;
    returned_at: string | null;
    book?: Book;
    created_at: string;
    updated_at: string;
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};
