import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import LibraryLayout from '@/layouts/library-layout';
import type { Book, Category } from '@/types/library';

type BookEditProps = {
    book: Book;
    categories: Category[];
};

export default function BookEdit({ book, categories }: BookEditProps) {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        author: string;
        description: string;
        cover_image: File | null;
        published_at: string;
        category_id: string;
    }>({
        title: book.title,
        author: book.author,
        description: book.description || '',
        cover_image: null,
        published_at: book.published_at ? book.published_at.split('T')[0] : '',
        category_id: String(book.category_id),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/library/books/${book.id}`, {
            forceFormData: true,
        });
    };

    return (
        <LibraryLayout title={`Edit: ${book.title}`}>
            <Link
                href={`/library/books/${book.id}`}
                className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Book
            </Link>

            <h1 className="mb-8 text-3xl font-bold text-gray-900">Edit Book</h1>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                {/* Title */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-[#4a6741] focus:outline-none focus:ring-1 focus:ring-[#4a6741]"
                        placeholder="Enter the book title"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                </div>

                {/* Author */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Author *
                    </label>
                    <input
                        type="text"
                        value={data.author}
                        onChange={(e) => setData('author', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-[#4a6741] focus:outline-none focus:ring-1 focus:ring-[#4a6741]"
                        placeholder="Enter the author's name"
                    />
                    {errors.author && <p className="mt-1 text-sm text-red-500">{errors.author}</p>}
                </div>

                {/* Category */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Category *
                    </label>
                    <select
                        value={data.category_id}
                        onChange={(e) => setData('category_id', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-[#4a6741] focus:outline-none focus:ring-1 focus:ring-[#4a6741]"
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={5}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-[#4a6741] focus:outline-none focus:ring-1 focus:ring-[#4a6741]"
                        placeholder="Write a description about the book"
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                </div>

                {/* Cover Image */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Cover Image
                    </label>
                    {book.cover_image && (
                        <div className="mb-3">
                            <img
                                src={`/storage/${book.cover_image}`}
                                alt={book.title}
                                className="h-32 w-24 rounded-lg object-cover shadow-sm"
                            />
                            <p className="mt-1 text-xs text-gray-400">Current cover. Upload a new one to replace it.</p>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('cover_image', e.target.files?.[0] || null)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm file:mr-4 file:rounded-full file:border-0 file:bg-[#4a6741] file:px-4 file:py-1 file:text-sm file:font-semibold file:text-white hover:file:bg-[#3d5636]"
                    />
                    {errors.cover_image && <p className="mt-1 text-sm text-red-500">{errors.cover_image}</p>}
                </div>

                {/* Published Date */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Published Date
                    </label>
                    <input
                        type="date"
                        value={data.published_at}
                        onChange={(e) => setData('published_at', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-[#4a6741] focus:outline-none focus:ring-1 focus:ring-[#4a6741]"
                    />
                    {errors.published_at && <p className="mt-1 text-sm text-red-500">{errors.published_at}</p>}
                </div>

                {/* Submit */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-full bg-[#4a6741] px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3d5636] disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Save Changes'}
                    </button>
                    <Link
                        href={`/library/books/${book.id}`}
                        className="px-4 py-3 text-sm text-gray-500 hover:text-gray-700"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </LibraryLayout>
    );
}
