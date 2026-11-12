import FileCard from "../components/FileCard.jsx";
import { useEffect, useState } from "react";
import Button from "../components/Button.jsx";
import AddFileModal from "../components/AddFileModal.jsx";
import {useNavigate} from "react-router-dom";

const MainPage = ({setIsAuthenticated}) => {
    const [files, setFiles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchFiles = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/files', {
                method: "GET",
                credentials: 'include'
            });

            if (!response.ok) {
                console.error(response.statusText);
            }

            const data = await response.json();
            const files = data["files"] || [];

            setFiles(files);
        } catch (err) {
            console.error(err);
        }
    };

    const logout = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/logout/", {
                method: "POST",
                credentials: "include"
            });

            if (res.ok) {
                setIsAuthenticated(false);
                navigate("/login");
            }
        } catch (err) {
            console.error("Logout failed:", err);
        }
    }

    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <div className="flex h-screen w-full bg-gray-50 font-sans">

            <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-wide">Galahad</h1>
                </div>
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-2">
                        <li>
                            <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg transition-colors">
                                Wszystkie pliki
                            </button>
                        </li>
                        <li>
                            <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                Udostępnione
                            </button>
                        </li>
                        <li>
                            <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                Ostatnie
                            </button>
                        </li>
                    </ul>
                </nav>
                <div className="mx-auto mb-5">
                    <Button text="Wyloguj" color="bg-red-500" action={logout}/>
                </div>
            </aside>

            <main className="flex-1 relative flex flex-col h-full overflow-hidden">

                <header className="px-8 py-6 bg-white shadow-sm z-10">
                    <h2 className="text-xl font-semibold text-gray-800">Pliki</h2>
                </header>

                <div className="flex-1 p-8 overflow-y-auto">
                    {files.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Brak plików do wyświetlenia.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                            {files.map((file) => (
                                <FileCard
                                    key={file.s3_key}
                                    name={file.name}
                                    s3Key={file.s3_key}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="absolute bottom-8 right-8 z-20">
                    <Button
                        color="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-transform hover:scale-105"
                        text="Dodaj plik"
                        action={() => setIsModalOpen(true)}
                    />
                </div>
            </main>

            <AddFileModal onClose={() => setIsModalOpen(false)} isOpen={isModalOpen} onSubmit={fetchFiles}></AddFileModal>
        </div>
    );
};

export default MainPage;