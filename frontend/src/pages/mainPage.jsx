import FileCard from "../components/FileCard.jsx";
import {useEffect, useState} from "react";


const mainPage = () => {
    const [files, setFiles] = useState([])

    const fetchFiles = async () => {
        try{
            const response = await fetch('http://localhost:8080/api/files')

            if(!response.ok){
                console.error(response.statusText)
            }

            const data = await response.json();
            const files = data["files"];

            setFiles(files);
            console.log(files)
        }catch(err){
            console.error(err)
        }
    }


    useEffect(() => {
        fetchFiles().then(() => console.log('Sucessfully fetched files from server!'));
    }, [])

    return (
        <>
            Galahad
            <div className="filesContainer flex flex-row h-full">
                {files.map((file) => (
                    <FileCard name={file.name} s3Key={file.s3_key} tags={file.tags} owner={file.created_by}> </FileCard>
                ))}
            </div>
        </>
    )
}

export default mainPage;