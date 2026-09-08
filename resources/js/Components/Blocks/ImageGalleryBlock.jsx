import React from 'react';

export default function ImageGalleryBlock({ data = {} }) {
    const images = data.images || [
        { url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80', caption: 'খাঁটি উপাদান' },
        { url: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=600&auto=format&fit=crop&q=80', caption: 'প্রাকৃতিক স্বাস্থ্য' },
        { url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80', caption: 'প্রিমিয়াম কোয়ালিটি' },
        { url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80', caption: 'শতভাগ নিরাপদ' },
    ];
    const columns = Number(data.columns) || 4;

    const colClass = {
        2: 'grid-cols-2',
        3: 'grid-cols-2 sm:grid-cols-3',
        4: 'grid-cols-2 sm:grid-cols-4',
        6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6',
    }[columns] || 'grid-cols-2 sm:grid-cols-4';

    return (
        <section className="py-12 sm:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {data.heading && (
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                            {data.heading}
                        </h2>
                    </div>
                )}

                <div className={`grid ${colClass} gap-4`}>
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className="group relative overflow-hidden rounded-2xl bg-gray-100 aspect-square shadow-2xs hover:shadow-md transition-shadow"
                        >
                            <img
                                src={typeof img === 'string' ? img : img.url}
                                alt={img.caption || `Gallery ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {img.caption && (
                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white text-xs font-semibold">
                                    {img.caption}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
