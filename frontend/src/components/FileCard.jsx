import { useState, useRef, useEffect } from "react";
import { FileText, MoreVertical, Share2, Trash2 } from "lucide-react";

const FileCard = ({ name, s3Url, onShare, onDelete }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-48">

            <div className="flex justify-between items-start w-full mb-3">

                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <FileText size={28} />
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
                    >
                        <MoreVertical size={20} />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg z-10 py-1">
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    if (onShare) onShare();
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                            >
                                <Share2 size={16} /> Udostępnij
                            </button>

                            <button
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    if(onDelete) onDelete();
                                }}
                            >
                                <Trash2 size={16} /> Usuń
                            </button>
                        </div>
                    )}
                </div>
            </div>


            <div className="flex-1">
                <h3
                    className="font-medium text-gray-800 text-sm line-clamp-2 break-words"
                    title={name}
                >
                    {name}
                </h3>
            </div>

            <div className="mt-4">
                <a
                    href={s3Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-center text-sm font-medium rounded-lg transition-colors"
                >
                    Otwórz
                </a>
            </div>
        </div>
    );
};

export default FileCard;