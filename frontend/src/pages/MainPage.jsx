import FileCard from "../components/FileCard.jsx";
import { useEffect, useState } from "react";
import Button from "../components/Button.jsx";
import AddFileModal from "../components/AddFileModal.jsx";
import {useNavigate} from "react-router-dom";
import ShareModal from "../components/ShareModal.jsx";
import {usePopup} from "../context/PopupContext.jsx";

const MainPage = ({setIsAuthenticated}) => {
    const [files, setFiles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [type, setType] = useState("all");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sharingFile, setSharingFile] = useState(null);
    const navigate = useNavigate();

    const {addPopup} = usePopup();

    const fetchFiles = async (type) => {
        try {
            setIsLoading(true);
            let endpoint = "/files";
            switch (type) {
                case "all":
                    endpoint = "/files";
                    break;
                case "mine":
                    endpoint = "/myFiles";
                    break;
                case "shared":
                    endpoint = "/sharedFiles";
                    break;
            }
            const response = await fetch(`http://localhost:8080/api${endpoint}`, {
                method: "GET",
                credentials: 'include'
            });

            if (!response.ok) {
                console.error(response.statusText);
            }

            const data = await response.json();
            const files = data["files"] || [];

            setFiles(files);
            setIsLoading(false);
        } catch (err) {
            console.error(err);
            setIsLoading(false);
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
                addPopup("Pomyślnie wylogowano.", "success");
                navigate("/login");
            }
        } catch (err) {
            addPopup("Błąd podczas wylogowania.", "error");
            console.error("Logout failed:", err);
        }
    }

    const shareFile = async (file) => {
        try{
            setIsShareModalOpen(true);
            setSharingFile(file);
            const res = await fetch("http://localhost:8080/api/users", {
                method: "GET",
                credentials: 'include'
            })

            if (!res.ok) {
                console.error(res.statusText);
            }
            const data = await res.json();
            setUsers(data["users"]);
            console.log(data["users"]);
        }catch(err) {
            console.error(err);
        }
    }

    const removeFile = async (file) => {
        try{
            const res = await fetch("http://localhost:8080/api/removeFile/", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    s3_key: file.s3_key,
                })
            })

            if (!res.ok) {
                console.error(res.statusText);
                addPopup("Wystąpił błąd podczas usuwania pliku.", "error")
                return;
            }

            fetchFiles(type);
            addPopup("Pomyślnie usunięto plik.", "success");
        }catch(err) {
            console.error(err);
        }
    }


    useEffect(() => {
        fetchFiles(type);
    }, [type]);

    return (
        <div className="flex h-screen w-full bg-gray-50 font-sans">

            <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-wide">Galahad</h1>
                </div>
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-2">
                        <li>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                    type === "all"
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                                onClick={() => setType("all")}
                            >
                                Wszystkie pliki
                            </button>
                        </li>
                        <li>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                    type === "shared"
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                                onClick={() => setType("shared")}
                            >
                                Udostępnione dla mnie
                            </button>
                        </li>
                        <li>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                    type === "mine"
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                                onClick={() => setType("mine")}
                            >
                                Moje
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
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin">
                            </div>
                        </div>
                    ): files.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Brak plików do wyświetlenia.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                            {files.map((file) => (
                                <FileCard
                                    key={file.s3_key}
                                    name={file.name}
                                    s3Url={file.s3_url}
                                    onShare={() => shareFile(file)}
                                    onDelete={() => removeFile(file)}
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
            <ShareModal onClose={() => setIsShareModalOpen(false)}
                        isOpen={isShareModalOpen}
                        onSubmitShare={async (users) => {
                            try{
                                const users_id = users.map((user) => user.id);
                                console.log("users id:" + users_id);
                                console.log("file id: " + sharingFile.id);
                                const res = await fetch("http://localhost:8080/api/shareFile/", {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        "content-type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        "users_id": users_id,
                                        "file_id": sharingFile.id
                                    }),
                                })
                            }catch(err){
                                console.log(err);
                            }finally {
                                setSharingFile(null);
                            }
                        }}
                        onSearchChange={(val) => {
                            if (val.trim().length === 0) {
                                setSearchResults([]);
                            } else {
                                setSearchResults(users.filter(u =>
                                    u.username.toLowerCase().includes(val.toLowerCase())
                                ));
                            }
                        }}
                        searchResults={searchResults}
                        file={sharingFile}
            >
            </ShareModal>
        </div>
    );
};

export default MainPage;