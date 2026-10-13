import {useEffect, useState} from "react";

const addFilePage = () => {
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    const fetchTags = async () => {
        try{
            const response = await fetch("http://localhost:8080/api/tagList", {
                method: "GET"
            })

            const data = await response.json();
            console.log(data)
            setTags(data)
        }catch(err){
            console.error(err)
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const file = formData.get("file")
        console.log(file)

        try{
            await fetch("http://localhost:8080/api/addFile/", {
                method: "POST",
                body: formData,
            })
        }catch(err){
            console.error(err)
        }

    }

    useEffect(() => {
       fetchTags();
    }, [])

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Upload File</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Document
                    </label>
                    <input
                        type="file"
                        name="file"
                        className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2.5 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100
                    cursor-pointer focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Assign Tags
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {tags.map((tag) => (
                            <label
                                key={tag.id}
                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    value={tag.id}
                                    onChange={() => {

                                    }}
                                    className="w-4 h-4 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                                />
                                <span className="text-sm font-medium text-gray-700">
                            {tag.name}
                        </span>
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                >
                    Add File
                </button>
            </form>
        </div>
    );
}

export default addFilePage;