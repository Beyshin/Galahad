import {useState} from "react";
import Button from "../components/Button.jsx";
import {useNavigate, useNavigation} from "react-router-dom";
import {usePopup} from "../context/PopupContext.jsx";


export default function LoginPage({setIsAuthenticated}) {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const {addPopup} = usePopup();

    const login = async () => {
        try{
            console.log("login");

            const res = await fetch("http://localhost:8080/api/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            })

            if(res.ok){
                console.log("Successfully logged in");
                setIsAuthenticated(true);
                addPopup("Pomyślnie zalogowano", "success");
                navigate("/home");
            }else {
                addPopup("Błędny login lub hasło", "error");
                console.log(res.status + " " + res.statusText);
            }
        }catch(err){
            console.log(err);
        }
    }

    return (
        <main className="flex flex-col items-center justify-center h-full p-12">
            <h1 className="text-5xl font-bold p-12">Galahad</h1>
            <div className="flex flex-col items-center justify-center h-full gap-2">
                <div className="flex flex-col justify-center h-full gap-3">
                    <label  htmlFor="username">Login: </label>
                    <input className="border-gray-400 border-2 p-2 rounded-xl" id="username" type="text" onChange={(e) => setUsername(e.target.value)} />
                    <label htmlFor="password">Hasło: </label>
                    <input className="border-gray-400 border-2 p-2 rounded-xl" id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button action={login} color={"bg-blue-400"} text="Zaloguj"></Button>
            </div>
        </main>
    )

}