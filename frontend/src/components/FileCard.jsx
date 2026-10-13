
const FileCard = (props) => {
    const {name, s3Key, tags, owner} = props;

    return(
        <div className="fileCard flex flex-col bg-amber-100 w-50 h-40 mx-auto">
            <div className="fileName w-100 h-20">{name}</div>
            <div className="fileKey w-100 h-40">{s3Key}</div>
            <ul className="fileTags w-100 h-40">
                {tags.map((tag) => (
                    <li key={tag.name}>{tag.name}</li>
                ))}
            </ul>
            <div>Created by: {owner}</div>
        </div>
    )
}


export default FileCard;