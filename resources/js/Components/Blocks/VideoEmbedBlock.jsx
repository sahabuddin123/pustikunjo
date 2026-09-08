import React from 'react';

export default function VideoEmbedBlock({ data = {} }) {
    const rawUrl = data.url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    
    // Parse YouTube embed if applicable
    let embedUrl = rawUrl;
    if (rawUrl.includes('youtube.com/watch?v=')) {
        const videoId = rawUrl.split('v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (rawUrl.includes('youtu.be/')) {
        const videoId = rawUrl.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    return (
        <section className="py-12 sm:py-16 bg-[#F8FAF8]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {data.heading && (
                    <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                            {data.heading}
                        </h2>
                    </div>
                )}

                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-black">
                    <iframe
                        src={embedUrl}
                        title={data.heading || 'Video'}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>
        </section>
    );
}
