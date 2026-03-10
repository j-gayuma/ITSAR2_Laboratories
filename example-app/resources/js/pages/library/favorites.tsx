import { Link, router } from '@inertiajs/react';
import { Heart, BookOpen } from 'lucide-react';
import LibraryLayout from '@/layouts/library-layout';
import type { Book, PaginatedData } from '@/types/library';

type FavoritesProps = {
    favorites: PaginatedData<Book>;
};

const placeholderColors = [
    'bg-amber-100',
    'bg-emerald-100',
    'bg-sky-100',
    'bg-rose-100',
    'bg-violet-100',
    'bg-orange-100',
];

export default function Favorites({ favorites }: FavoritesProps) {
    const handleRemoveFavorite = (bookId: number) => {
        router.post(`/library/favorites/${bookId}`, {}, { preserveScroll: true });
    };

    return (
        <LibraryLayout title="Favorites">
            <h1 className="mb-8 text-4xl font-bold text-gray-900">
                <span className="flex items-center gap-3">
                    <Heart className="h-9 w-9 text-red-500 fill-red-500" />
                    My Favorites
                </span>
            </h1>

            {favorites.data.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {favorites.data.map((book, index) => {
                        const coverColor = placeholderColors[index % placeholderColors.length];

                        return (
                            <div
                                key={book.id}
                                className="flex gap-4 rounded-xl bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
                            >
                                <Link
                                    href={`/library/books/${book.id}`}
                                    className="flex-shrink-0"
                                >
                                    <div className={`h-28 w-20 overflow-hidden rounded-lg ${!book.cover_image ? coverColor : ''}`}>
                                        {book.cover_image ? (
                                            <img
                                                src={`/storage/${book.cover_image}`}
                                                alt={book.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center p-2 text-center">
                                                <p className="text-xs font-bold text-gray-700">
                                                    {book.title}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                                <div className="flex flex-1 flex-col justify-between">
                                    <div>
                                        <Link
                                            href={`/library/books/${book.id}`}
                                            className="text-sm font-semibold text-gray-800 hover:underline"
                                        >
                                            {book.title}
                                        </Link>
                                        <p className="text-xs text-gray-500">{book.author}</p>
                                        {book.category && (
                                            <p className="mt-1 text-xs text-gray-400">
                                                {book.category.name}
                                            </p>
                                        )}
                                        <div className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${
                                            book.is_available
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {book.is_available ? 'Available' : 'Borrowed'}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveFavorite(book.id)}
                                        className="mt-2 flex items-center gap-1 self-start rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                                    >
                                        <Heart className="h-3 w-3 fill-red-500" />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 shadow-sm">
                    <Heart className="mb-4 h-16 w-16 text-gray-300" />
                    <h3 className="mb-2 text-lg font-semibold text-gray-600">
                        No favorites yet
                    </h3>
                    <p className="mb-6 text-sm text-gray-400">
                        Start exploring and add books to your favorites!
                    </p>
                    <Link
                        href="/library"
                        className="rounded-full bg-[#4a6741] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3d5636]"
                    >
                        Discover Books
                    </Link>
                </div>
            )}

            {/* Pagination */}
            {favorites.last_page > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                    {favorites.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            className={`rounded-lg px-3 py-2 text-sm ${
                                link.active
                                    ? 'bg-[#4a6741] text-white'
                                    : link.url
                                      ? 'bg-white text-gray-600 hover:bg-gray-100'
                                      : 'cursor-not-allowed bg-gray-50 text-gray-300'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </LibraryLayout>
    );
}
