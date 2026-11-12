import { createContext, useContext, useEffect, useState, useCallback} from "react";
import {X} from "lucide-react";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
    const [popups, setPopups] = useState([]);

    const addPopup = useCallback(
        (message, type= "success") => {
            const id = Date.now();

            setPopups((prev) => [...prev, { id, message, type }]);

            setTimeout(() => {
                removePopup(id);
            }, 3000)
        },
        [],
    );

    const removePopup = useCallback(
        (id) => {
            setPopups((prev) => prev.filter((popup) => popup.id !== id));
        },
        [],
    );

    return (
        <PopupContext.Provider value={{ addPopup }}>
            {children}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
                {popups.map((popup) => (
                    <div
                        key={popup.id}
                        className={`flex items-center justify-between w-72 p-4 rounded-xl shadow-lg text-white pointer-events-auto transition-all animate-fade-in-up ${
                            popup.type === 'success' ? 'bg-green-600' :
                                popup.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
                        }`}
                    >
                        <span className="font-medium text-sm">{popup.message}</span>
                        <button
                            onClick={() => removePopup(popup.id)}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </PopupContext.Provider>
    );
}

export const usePopup = () => useContext(PopupContext);