
export default function Button(props) {
    const {color, text, action} = props;


    return (
        <div className={`p-4 ${color} text-white w-30 rounded-lg flex items-center justify-center cursor-pointer font-bold`} onClick={action}>
            <div>
                {text}
            </div>
        </div>
    )
}