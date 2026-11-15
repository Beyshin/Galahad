import { useState, useEffect } from "react";
import { X, Search, User } from "lucide-react";
import Button from "./Button.jsx";

const ShareModal = ({
                            isOpen,
                            onClose,
                            file,
                            searchResults,
                            onSearchChange,
                            onSubmitShare
                        }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm("");
            setSelectedUsers([]);
            onSearchChange("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSearchInput = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
        onSearchChange(val);
    };

    const handleSelectUser = (user) => {
        if (!selectedUsers.some(u => u.id === user.id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
        setSearchTerm("");
        onSearchChange("");
    };

    const handleRemoveUser = (userId) => {
        setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
    };

    const handleSubmit = async () => {
        if (selectedUsers.length === 0) return;
        setIsSubmitting(true);

        await onSubmitShare(selectedUsers);

        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative flex flex-col max-h-[90vh]">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold text-gray-800 mb-2">Udostępnij plik</h2>
                <p className="text-sm text-gray-500 mb-6 truncate">
                    {file?.name || "Wybrany plik"}
                </p>

                {selectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 max-h-32 overflow-y-auto">
                        {selectedUsers.map(user => (
                            <div
                                key={user.id}
                                className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium"
                            >
                                <span>{user.username}</span>
                                <button
                                    onClick={() => handleRemoveUser(user.id)}
                                    className="text-blue-400 hover:text-blue-800 focus:outline-none"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Szukaj użytkownika..."
                        value={searchTerm}
                        onChange={handleSearchInput}
                    />

                    {searchResults && searchResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {searchResults.map(user => (
                                <button
                                    key={user.id}
                                    onClick={() => handleSelectUser(user)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0"
                                >
                                    <div className="bg-gray-100 p-1.5 rounded-full">
                                        <User size={16} className="text-gray-500" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{user.username}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-auto">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    >
                        Anuluj
                    </button>
                    <Button
                        color={`text-white ${selectedUsers.length === 0 || isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        text={isSubmitting ? "Zapisywanie..." : "Udostępnij"}
                        action={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default ShareModal;