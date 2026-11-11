import { Folder } from "lucide-react";


const FileCard = (props) => {
    const {name, s3Key, tags, owner} = props;

    return(
        <div className="fileCard flex-col  w-50 h-40 mx-auto flex justify-center items-center border-5 border-gray-200">
            <Folder size={200}></Folder>
            <div>{name}</div>
            <div className="bg-green-400 text-white p-3 rounded-lg font-bold">
                <a href={s3Key}> Otworz </a>
            </div>
            {/*<ul className="fileTags w-100 h-40">*/}
            {/*    {tags.map((tag) => (*/}
            {/*        <li key={tag.name}>{tag.name}</li>*/}
            {/*    ))}*/}
            {/*</ul>*/}
            {/*<div>Created by: {owner}</div>*/}
        </div>
    )
}


export default FileCard;