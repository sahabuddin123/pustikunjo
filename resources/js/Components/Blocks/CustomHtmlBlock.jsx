import React from 'react';

export default function CustomHtmlBlock({ data = {} }) {
    if (!data.html) return null;

    return (
        <section className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: data.html }}
                />
            </div>
        </section>
    );
}
