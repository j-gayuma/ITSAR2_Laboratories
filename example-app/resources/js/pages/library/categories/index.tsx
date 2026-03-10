import { Link } from '@inertiajs/react';
import LibraryLayout from '@/layouts/library-layout';
import type { Category } from '@/types/library';

type CategoriesIndexProps = {
    categories: Category[];
};

const categoryColors = [
    'bg-purple-100',
    'bg-blue-100',
    'bg-green-100',
    'bg-yellow-100',
    'bg-red-100',
    'bg-pink-100',
    'bg-indigo-100',
    'bg-teal-100',
];

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    return (
        <LibraryLayout title="Categories">
            <h1 className="mb-8 text-4xl font-bold text-gray-900">Categories</h1>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {categories.map((category, index) => (
                    <Link
                        key={category.id}
                        href={`/library/categories/${category.id}`}
                        className="group"
                    >
                        <div className={`flex flex-col items-center gap-4 rounded-2xl p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 ${categoryColors[index % categoryColors.length]}`}>
                            <span className="text-4xl">{category.icon || '📚'}</span>
                            <h3 className="text-center text-sm font-semibold text-gray-800">
                                {category.name}
                            </h3>
                            {category.books_count !== undefined && (
                                <span className="text-xs text-gray-500">
                                    {category.books_count} {category.books_count === 1 ? 'book' : 'books'}
                                </span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </LibraryLayout>
    );
}
