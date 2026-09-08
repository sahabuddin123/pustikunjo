import React from 'react';

export default function RichTextBlock({ data }) {
    const content = data.content || '';

    if (!content) return null;

    return (
        <section className="py-10 sm:py-14 bg-white border-b border-gray-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-emerald prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </section>
    );
}
