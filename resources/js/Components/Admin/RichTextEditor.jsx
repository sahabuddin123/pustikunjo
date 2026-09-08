import React, { useState, useRef, useEffect } from 'react';
import MediaPickerModal from '@/Components/Admin/MediaPickerModal';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Link as LinkIcon,
    Image as ImageIcon,
    Table,
    Code,
    Undo,
    Redo,
    Heading1,
    Heading2,
    Heading3,
    Quote,
    Minus,
    RemoveFormatting,
    Maximize2,
    Minimize2,
    Eye,
    Palette,
    Check,
    X,
    FolderOpen
} from 'lucide-react';

export default function RichTextEditor({
    value = '',
    onChange,
    placeholder = 'এখানে আপনার পেজের কনটেন্ট লিখুন...',
    minHeight = '400px'
}) {
    const editorRef = useRef(null);
    const [isSourceMode, setIsSourceMode] = useState(false);
    const [htmlSource, setHtmlSource] = useState(value || '');
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    // Modal states
    const [linkModalOpen, setLinkModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [linkNewTab, setLinkNewTab] = useState(true);

    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

    const [tableModalOpen, setTableModalOpen] = useState(false);
    const [tableRows, setTableRows] = useState(3);
    const [tableCols, setTableCols] = useState(3);

    const [colorPickerOpen, setColorPickerOpen] = useState(false);
    const [colorMode, setColorMode] = useState('textColor'); // 'textColor' | 'bgColor'

    // Saved range for restoring selection when modal closes
    const savedRangeRef = useRef(null);

    const saveSelection = () => {
        if (window.getSelection) {
            const sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                savedRangeRef.current = sel.getRangeAt(0);
            }
        }
    };

    const restoreSelection = () => {
        if (savedRangeRef.current && window.getSelection) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(savedRangeRef.current);
        }
    };

    // Keep editor innerHTML in sync with value on initial load or external update
    useEffect(() => {
        if (editorRef.current && !isSourceMode) {
            if (editorRef.current.innerHTML !== value) {
                editorRef.current.innerHTML = value || '';
            }
        }
        setHtmlSource(value || '');
    }, [value, isSourceMode]);

    const handleContentChange = () => {
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            setHtmlSource(html);
            if (onChange) {
                onChange(html);
            }
        }
    };

    const handleSourceChange = (e) => {
        const val = e.target.value;
        setHtmlSource(val);
        if (onChange) {
            onChange(val);
        }
    };

    const toggleSourceMode = () => {
        if (isSourceMode) {
            // switching back to visual
            setIsSourceMode(false);
        } else {
            // switching to code view
            setIsSourceMode(true);
        }
    };

    const execCmd = (command, value = null) => {
        if (isSourceMode) return;
        editorRef.current?.focus();
        document.execCommand(command, false, value);
        handleContentChange();
    };

    // Format Block (headings, paragraph, blockquote)
    const handleFormatBlock = (tag) => {
        if (isSourceMode) return;
        execCmd('formatBlock', tag);
    };

    // Link insertion
    const openLinkDialog = () => {
        saveSelection();
        const sel = window.getSelection();
        setLinkText(sel ? sel.toString() : '');
        setLinkUrl('');
        setLinkModalOpen(true);
    };

    const insertLink = (e) => {
        e.preventDefault();
        setLinkModalOpen(false);
        restoreSelection();
        if (!linkUrl) return;

        editorRef.current?.focus();
        const cleanUrl = linkUrl.startsWith('http') || linkUrl.startsWith('/') ? linkUrl : `https://${linkUrl}`;
        const targetAttr = linkNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
        const textToDisplay = linkText.trim() || cleanUrl;
        
        document.execCommand('insertHTML', false, `<a href="${cleanUrl}"${targetAttr} class="text-emerald-700 underline font-semibold hover:text-emerald-900">${textToDisplay}</a>`);
        handleContentChange();
    };

    // Image insertion
    const openImageDialog = () => {
        saveSelection();
        setImageUrl('');
        setImageAlt('');
        setImageModalOpen(true);
    };

    const insertImageFromUrl = (e) => {
        e.preventDefault();
        setImageModalOpen(false);
        restoreSelection();
        if (!imageUrl) return;

        editorRef.current?.focus();
        const imgHtml = `<figure class="my-4 text-center"><img src="${imageUrl}" alt="${imageAlt || 'ছবি'}" class="max-w-full h-auto rounded-2xl shadow-xs mx-auto border border-gray-100" />${imageAlt ? `<figcaption class="text-xs text-gray-500 mt-1">${imageAlt}</figcaption>` : ''}</figure><p><br></p>`;
        document.execCommand('insertHTML', false, imgHtml);
        handleContentChange();
    };

    const handleMediaLibrarySelect = (mediaItem) => {
        setMediaPickerOpen(false);
        setImageModalOpen(false);
        restoreSelection();
        if (!mediaItem?.url) return;

        editorRef.current?.focus();
        const imgHtml = `<figure class="my-4 text-center"><img src="${mediaItem.url}" alt="${mediaItem.filename || 'ছবি'}" class="max-w-full h-auto rounded-2xl shadow-xs mx-auto border border-gray-100" /></figure><p><br></p>`;
        document.execCommand('insertHTML', false, imgHtml);
        handleContentChange();
    };

    // Table insertion
    const insertTable = (e) => {
        e.preventDefault();
        setTableModalOpen(false);
        restoreSelection();

        let tableHtml = `<div class="overflow-x-auto my-6"><table class="w-full text-left text-sm border-collapse border border-gray-200 rounded-xl overflow-hidden shadow-2xs">`;
        tableHtml += `<thead class="bg-[#0B3E25] text-white"><tr>`;
        for (let c = 1; c <= tableCols; c++) {
            tableHtml += `<th class="p-3 border border-emerald-900 font-bold">হেডার ${c}</th>`;
        }
        tableHtml += `</tr></thead><tbody class="divide-y divide-gray-100 bg-white">`;
        for (let r = 1; r <= tableRows; r++) {
            tableHtml += `<tr class="${r % 2 === 0 ? 'bg-gray-50/60' : ''}">`;
            for (let c = 1; c <= tableCols; c++) {
                tableHtml += `<td class="p-3 border border-gray-200">তথ্য ${r}-${c}</td>`;
            }
            tableHtml += `</tr>`;
        }
        tableHtml += `</tbody></table></div><p><br></p>`;

        editorRef.current?.focus();
        document.execCommand('insertHTML', false, tableHtml);
        handleContentChange();
    };

    // Color picker
    const applyColor = (colorHex) => {
        setColorPickerOpen(false);
        restoreSelection();
        if (colorMode === 'textColor') {
            execCmd('foreColor', colorHex);
        } else {
            execCmd('hiliteColor', colorHex);
        }
    };

    const colors = [
        '#000000', '#374151', '#4B5563', '#9CA3AF',
        '#0B3E25', '#047857', '#10B981', '#A7F3D0',
        '#1E3A8A', '#2563EB', '#60A5FA', '#DBEAFE',
        '#7C2D12', '#DC2626', '#F87171', '#FEE2E2',
        '#D97706', '#F59E0B', '#FDE68A', '#FEF3C7',
        '#581C87', '#7C3AED', '#C4B5FD', '#F3E8FF'
    ];

    return (
        <div className={`rich-text-editor bg-white rounded-2xl border border-gray-300 shadow-2xs transition-all ${
            isFullscreen ? 'fixed inset-4 z-50 flex flex-col shadow-2xl border-emerald-600 ring-4 ring-emerald-500/20' : 'relative'
        }`}>
            
            {/* CKEditor Top Toolbar */}
            <div className="bg-[#F8FAF9] p-2.5 border-b border-gray-200 rounded-t-2xl flex flex-wrap items-center gap-1 text-gray-700 select-none">
                
                {/* Undo / Redo */}
                <div className="flex items-center border-r border-gray-300 pr-1.5 mr-1 space-x-0.5">
                    <button
                        type="button"
                        onClick={() => execCmd('undo')}
                        title="Undo (Ctrl+Z)"
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 disabled:opacity-30 cursor-pointer"
                    >
                        <Undo className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => execCmd('redo')}
                        title="Redo (Ctrl+Y)"
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 disabled:opacity-30 cursor-pointer"
                    >
                        <Redo className="w-4 h-4" />
                    </button>
                </div>

                {/* Heading / Style Selector */}
                <div className="flex items-center border-r border-gray-300 pr-1.5 mr-1">
                    <select
                        onChange={(e) => handleFormatBlock(e.target.value)}
                        defaultValue="<p>"
                        className="text-xs font-semibold py-1 px-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                    >
                        <option value="<p>">সাধারণ লেখা (Normal Paragraph)</option>
                        <option value="<h1>">শিরোনাম ১ (Heading 1)</option>
                        <option value="<h2>">শিরোনাম ২ (Heading 2)</option>
                        <option value="<h3>">শিরোনাম ৩ (Heading 3)</option>
                        <option value="<h4>">শিরোনাম ৪ (Heading 4)</option>
                        <option value="<blockquote>">উদ্ধৃতি (Blockquote)</option>
                        <option value="<pre>">কোড ব্লক (Code Block)</option>
                    </select>
                </div>

                {/* Basic Font Styles: Bold, Italic, Underline, Strike */}
                <div className="flex items-center border-r border-gray-300 pr-1.5 mr-1 space-x-0.5">
                    <button
                        type="button"
                        onClick={() => execCmd('bold')}
                        title="বোল্ড (Bold Ctrl+B)"
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 font-bold cursor-pointer"
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => execCmd('italic')}
                        title="ইটালিক (Italic Ctrl+I)"
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 italic cursor-pointer"
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => execCmd('underline')}
                        title="আন্ডারলাইন (Underline Ctrl+U)"
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 underline cursor-pointer"
                    >
                        <Underline className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => execCmd('strikeThrough')}
                        title="কেটে দেওয়া (Strikethrough)"
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 cursor-pointer"
                    >
                        <Strikethrough className="w-4 h-4" />
                    </button>
                </div>

                {/* Colors (Text & Background) */}
                <div className="relative flex items-center border-r border-gray-300 pr-1.5 mr-1">
                    <button
                        type="button"
                        onClick={() => {
                            saveSelection();
                            setColorMode('textColor');
                            setColorPickerOpen(!colorPickerOpen);
                        }}
                        title="টেক্সট কালার (Text Color)"
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-emerald-800 flex items-center gap-0.5 cursor-pointer font-bold"
                    >
                        <span>A</span>
                        <div className="w-2.5 h-1 bg-emerald-700 rounded-xs mt-2.5"></div>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            saveSelection();
                            setColorMode('bgColor');
                            setColorPickerOpen(!colorPickerOpen);
                        }}
                        title="হাইলাইট ব্যাকগ্রাউন্ড কালার (Highlight)"
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-amber-700 flex items-center gap-0.5 cursor-pointer"
                    >
                        <Palette className="w-4 h-4" />
                    </button>

                    {/* Color Palette Popover */}
                    {colorPickerOpen && (
                        <div className="absolute top-10 left-0 z-30 p-2.5 bg-white rounded-xl shadow-xl border border-gray-200 grid grid-cols-4 gap-1.5 w-44">
                            {colors.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => applyColor(c)}
                                    style={{ backgroundColor: c }}
                                    className="w-8 h-8 rounded-lg border border-gray-300/80 hover:scale-110 transition-transform cursor-pointer"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Alignments: Left, Center, Right, Justify */}
                <div className="flex items-center border-r border-gray-300 pr-1.5 mr-1 space-x-0.5">
                    <button
                        type="button"
                        onClick={() => execCmd('justifyLeft')}
                        title="বাম সারিবদ্ধ (Align Left)"
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 cursor-pointer"
                    >
                        <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => execCmd('justifyCenter')}
                        title="মাঝখানে সারিবদ্ধ (Align Center)"
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 cursor-pointer"
                    >
                        <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => execCmd('justifyRight')}
                        title="ডান সারিবদ্ধ (Align Right)"
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 cursor-pointer"
                    >
                        <AlignRight className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => execCmd('justifyFull')}
                        title="উভয় প্রান্ত সমান (Justify)"
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 cursor-pointer"
                    >
                        <AlignJustify className="w-4 h-4" />
                    </button>
                </div>

                {/* Lists: Bullet, Numbered */}
                <div className="flex items-center border-r border-gray-300 pr-1.5 mr-1 space-x-0.5">
                    <button
                        type="button"
                        onClick={() => execCmd('insertUnorderedList')}
                        title="বুলেট পয়েন্ট তালিকা (Bullet List)"
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 cursor-pointer"
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => execCmd('insertOrderedList')}
                        title="সংখ্যাতালিকা (Numbered List)"
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 cursor-pointer"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </button>
                </div>

                {/* Insert Link, Image, Table, Divider */}
                <div className="flex items-center border-r border-gray-300 pr-1.5 mr-1 space-x-0.5">
                    <button
                        type="button"
                        onClick={openLinkDialog}
                        title="লিঙ্ক যুক্ত করুন (Insert Link)"
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-emerald-800 cursor-pointer"
                    >
                        <LinkIcon className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={openImageDialog}
                        title="ছবি যুক্ত করুন (Insert Image / Media Library)"
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-emerald-800 cursor-pointer"
                    >
                        <ImageIcon className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            saveSelection();
                            setTableModalOpen(true);
                        }}
                        title="টেবিল তৈরি করুন (Insert Table)"
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-emerald-800 cursor-pointer"
                    >
                        <Table className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => execCmd('insertHorizontalRule')}
                        title="বিভাজক রেখা (Horizontal Divider)"
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 cursor-pointer"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                </div>

                {/* Remove Formatting & Clean */}
                <div className="flex items-center border-r border-gray-300 pr-1.5 mr-1 space-x-0.5">
                    <button
                        type="button"
                        onClick={() => execCmd('removeFormat')}
                        title="ফরম্যাট মুছে ফেলুন (Clear Formatting)"
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-rose-600 cursor-pointer"
                    >
                        <RemoveFormatting className="w-4 h-4" />
                    </button>
                </div>

                {/* HTML Source Mode & Fullscreen */}
                <div className="flex items-center ml-auto space-x-1">
                    <button
                        type="button"
                        onClick={toggleSourceMode}
                        title="HTML কোড দেখুন ও এডিট করুন (Source Code Mode)"
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                            isSourceMode ? 'bg-emerald-800 text-white shadow-xs' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <Code className="w-3.5 h-3.5" />
                        <span>{isSourceMode ? 'Visual Editor' : 'HTML Source'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 cursor-pointer"
                    >
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                </div>

            </div>

            {/* Editor Workspace: Visual WYSIWYG vs Raw HTML Source */}
            <div className="relative flex-1 flex flex-col overflow-hidden">
                {isSourceMode ? (
                    <textarea
                        value={htmlSource}
                        onChange={handleSourceChange}
                        placeholder="এখানে সরাসরি HTML কোড পেস্ট বা এডিট করতে পারেন..."
                        className="w-full flex-1 p-5 font-mono text-sm text-gray-800 bg-gray-900 text-emerald-300 focus:outline-none resize-none leading-relaxed"
                        style={{ minHeight }}
                    />
                ) : (
                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleContentChange}
                        onBlur={handleContentChange}
                        className="w-full flex-1 p-6 sm:p-8 text-gray-800 focus:outline-none overflow-y-auto leading-relaxed text-base space-y-4 prose prose-emerald max-w-none"
                        style={{ minHeight }}
                        data-placeholder={placeholder}
                    />
                )}
            </div>

            {/* Bottom Status / Word count */}
            <div className="p-2.5 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex items-center justify-between text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>CKEditor-style Rich Text Engine (HTML Output)</span>
                </div>
                <div>
                    মোট অক্ষর: {htmlSource.replace(/<[^>]+>/g, '').length} | শব্দ: {htmlSource.replace(/<[^>]+>/g, '').trim().split(/\s+/).filter(Boolean).length}
                </div>
            </div>

            {/* Link Modal */}
            {linkModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
                    <form onSubmit={insertLink} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-gray-200">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                <LinkIcon className="w-4 h-4 text-emerald-700" />
                                <span>লিঙ্ক যুক্ত করুন (Insert Link)</span>
                            </h3>
                            <button type="button" onClick={() => setLinkModalOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">লিঙ্ক ইউআরএল (URL):</label>
                            <input
                                type="text"
                                required
                                placeholder="https://example.com বা /shop"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">প্রদর্শিত লেখা (Link Text):</label>
                            <input
                                type="text"
                                placeholder="ক্লিক করুন বা বাটনের লেখা"
                                value={linkText}
                                onChange={(e) => setLinkText(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="linkNewTab"
                                checked={linkNewTab}
                                onChange={(e) => setLinkNewTab(e.target.checked)}
                                className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor="linkNewTab" className="text-xs text-gray-700 font-medium">নতুন ট্যাবে খুলুন (target="_blank")</label>
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                            <button type="button" onClick={() => setLinkModalOpen(false)} className="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-700">বাতিল</button>
                            <button type="submit" className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold">লিঙ্ক যুক্ত করুন</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Image Modal (URL or Media Library) */}
            {imageModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
                    <form onSubmit={insertImageFromUrl} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-gray-200">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-emerald-700" />
                                <span>ছবি সংযুক্ত করুন (Insert Image)</span>
                            </h3>
                            <button type="button" onClick={() => setImageModalOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        {/* Direct Media Library Button */}
                        <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 text-center space-y-2">
                            <span className="text-xs font-bold text-emerald-950 block">পুষ্টি কুঞ্জ মিডিয়া লাইব্রেরি থেকে সহজে ছবি বেছে নিন</span>
                            <button
                                type="button"
                                onClick={() => setMediaPickerOpen(true)}
                                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                            >
                                <FolderOpen className="w-4 h-4" />
                                <span>মিডিয়া লাইব্রেরি খুলুন</span>
                            </button>
                        </div>

                        <div className="relative flex items-center justify-center text-xs text-gray-400">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="px-3">অথবা সরাসরি ইমেজ লিংক দিন</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">ইমেজ ইউআরএল (Image URL):</label>
                            <input
                                type="url"
                                placeholder="https://domain.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">ছবির বর্ণনা (Alt / Caption):</label>
                            <input
                                type="text"
                                placeholder="ছবির ক্যাপশন বা বিবরণ"
                                value={imageAlt}
                                onChange={(e) => setImageAlt(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                            <button type="button" onClick={() => setImageModalOpen(false)} className="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-700">বাতিল</button>
                            <button type="submit" disabled={!imageUrl} className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold disabled:opacity-50">ছবি যুক্ত করুন</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table Modal */}
            {tableModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
                    <form onSubmit={insertTable} className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-gray-200">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                <Table className="w-4 h-4 text-emerald-700" />
                                <span>টেবিল তৈরি করুন (Insert Table)</span>
                            </h3>
                            <button type="button" onClick={() => setTableModalOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">রো সংখ্যা (Rows):</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={tableRows}
                                    onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">কলাম সংখ্যা (Cols):</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={tableCols}
                                    onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                            <button type="button" onClick={() => setTableModalOpen(false)} className="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-700">বাতিল</button>
                            <button type="submit" className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold">টেবিল যোগ করুন</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Media Library Picker Modal Integration */}
            <MediaPickerModal
                isOpen={mediaPickerOpen}
                onClose={() => setMediaPickerOpen(false)}
                onSelect={handleMediaLibrarySelect}
            />

        </div>
    );
}
