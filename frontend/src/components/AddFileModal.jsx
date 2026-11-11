import {X, UploadCloud} from "lucide-react";
import {useState} from "react";
import Button from "./Button.jsx";



export default function AddFileModal({onClose, isOpen, onSubmit}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState('');


    if (!isOpen) return null;

    const handleUpload = async () => {
        try{
            setIsUploading(true);

            const formData = new FormData();
            formData.append("file", selectedFile);

            if (fileName.trim()) {
                formData.append("name", fileName.trim());
            }

            const res = await fetch("http://localhost:8080/api/addFile/", {
                method: 'POST',
                body: formData
            })

            if (res.ok) {
                if (onSubmit) onSubmit();
                onClose();
            } else {
                console.error(res.statusText);
            }
        }catch(err){
            console.error(err);
        }finally {
            setIsUploading(false);
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        if (file && !fileName) {
            setFileName(file.name);
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold text-gray-800 mb-6">Dodaj nowy plik</h2>

                <div className="mb-4">
                    <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nazwa pliku
                    </label>
                    <input
                        type="text"
                        id="fileName"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="Wpisz nazwę..."
                    />
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center mb-6 bg-gray-50">
                    <UploadCloud className="text-gray-400 mb-3" size={32} />

                    <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor="fileInput"
                        className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                    >
                        {selectedFile ? selectedFile.name : "Wybierz plik z dysku"}
                    </label>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    >
                        Anuluj
                    </button>
                    <Button
                        color={`text-white ${!selectedFile || isUploading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        text={isUploading ? "Przesyłanie..." : "Wyślij"}
                        action={handleUpload}
                    />
                </div>
            </div>
        </div>
    );

}