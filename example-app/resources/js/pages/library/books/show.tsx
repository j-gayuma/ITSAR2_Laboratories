import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Tag, BookOpen, Heart, Pencil, Trash2 } from 'lucide-react';
import LibraryLayout from '@/layouts/library-layout';
import type { Book } from '@/types/library';

type BookShowProps = {
    book: Book;
    isCurrentlyBorrowed: boolean;
    userHasBorrowed: boolean;
    isFavorited: boolean;
};

export default function BookShow({ book, isCurrentlyBorrowed, userHasBorrowed, isFavorited }: BookShowProps) {
    const handleBorrow = () => {
        router.post(`/library/borrow/${book.id}`);
    };

    const handleToggleFavorite = () => {
        router.post(`/library/favorites/${book.id}`, {}, { preserveScroll: true });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this book?')) {
            router.delete(`/library/books/${book.id}`);
        }
    };

    const placeholderColor = 'bg-amber-100';

    return (
        <LibraryLayout title={book.title}>
            {/* Back Button */}
            <Link
                href="/library"
                className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Discover
            </Link>

            <div className="flex flex-col gap-10 lg:flex-row">
                {/* Book Cover */}
                <div className="flex-shrink-0">
                    <div className={`h-80 w-56 overflow-hidden rounded-xl shadow-xl ${!book.cover_image ? placeholderColor : ''}`}>
                        {book.cover_image ? (
                            <img
                                src={`/storage/${book.cover_image}`}
                                alt={book.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                                <BookOpen className="mb-3 h-12 w-12 text-gray-500" />
                                <p className="text-base font-bold text-gray-700">{book.title}</p>
                                <p className="mt-2 text-sm text-gray-500">{book.author}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Book Details */}
                <div className="flex-1">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">{book.title}</h1>
                    <p className="mb-6 text-lg text-gray-600">by {book.author}</p>

                    <div className="mb-6 flex flex-wrap gap-4">
                        {book.category && (
                            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
                                <Tag className="h-4 w-4" />
                                {book.category.name}
                            </div>
                        )}
                        {book.published_at && (
                            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
                                <Calendar className="h-4 w-4" />
                                Published: {new Date(book.published_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                        )}
                        <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm shadow-sm ${
                            book.is_available
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}>
                            {book.is_available ? 'Available' : 'Borrowed'}
                        </div>
                    </div>

                    {/* Description */}
                    {book.description && (
                        <div className="mb-8">
                            <h3 className="mb-3 text-lg font-semibold text-gray-900">Description</h3>
                            <p className="leading-relaxed text-gray-600">{book.description}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4">
                        {userHasBorrowed ? (
                            <p className="rounded-full bg-amber-100 px-6 py-3 text-sm font-semibold text-amber-700">
                                You are currently borrowing this book
                            </p>
                        ) : book.is_available ? (
                            <button
                                onClick={handleBorrow}
                                className="rounded-full bg-[#4a6741] px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3d5636]"
                            >
                                Borrow this Book
                            </button>
                        ) : (
                            <p className="rounded-full bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-500">
                                Currently unavailable
                            </p>
                        )}

                        <button
                            onClick={handleToggleFavorite}
                            className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-sm transition-colors ${
                                isFavorited
                                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                            {isFavorited ? 'Favorited' : 'Add to Favorites'}
                        </button>

                        <Link
                            href={`/library/books/${book.id}/edit`}
                            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-600 shadow-sm transition-colors hover:bg-gray-100"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Link>

                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </LibraryLayout>
    );
}
