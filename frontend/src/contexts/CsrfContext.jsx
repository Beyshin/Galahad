import {createContext, useContext, useEffect, useState} from "react";

 const CsrfContext = createContext(null);

 export const CsrfProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/csrf/", {
                    method: "GET",
                    credentials: "include"
                })

                if (response.ok) {
                    const data = await response.json()
                    const token = data["csrf_token"];
                    setToken(token);
                }

            } catch (err) {
                console.log("Failed to fetch csrf token: ", err);
            }
        };

        fetchToken();
    }, [])


    return(
        <CsrfContext.Provider value={token}>
            {children}
        </CsrfContext.Provider>
    )
}

export const useCsrf = () => useContext(CsrfContext);