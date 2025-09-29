import { useContext, useEffect, useRef, useState } from "react";
import Base64 from "../../../shared/base64/Base64";
import AppContext from "../../features/context/AppContext";


export default function AuthModal() {
    const { setToken } = useContext(AppContext);
    const closeModalRef = useRef();
    const [formState, setFormState] = useState({
        "login": "",
        "password": ""
    });
    const [isFormValid, setFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const authenticate = () => {
        setIsLoading(true);
        setError("");
        
        const credentials = Base64.encode(`${formState.login}:${formState.password}`);
        const startTime = Date.now();
        
        fetch("https://localhost:7111/User/login", {
            method: "GET",
            headers: {
                'Authorization': 'Basic ' + credentials
            }
        })
        .then(r => {
            console.log("status:", r.status);
            console.log("LOGIN: ", formState.login +  " | PASS: ", formState.password)
            return r.json();
        })
        .then(j => {
            const elapsedTime = Date.now() - startTime;
            const minDelay = 1000;
            const remainingTime = Math.max(0, minDelay - elapsedTime);
            
            setTimeout(() => {
                if(j.status == 200) {
                    const jwt = j.data;
                    setToken(jwt);
                    const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
                    if (modal) modal.hide();
                    setFormState({ login: "", password: "" });
                }
                else {
                    console.log("Помилка автентифікації:", j.data);
                    setError(j.data || "Невірний логін або пароль");
                }
                setIsLoading(false);
            }, remainingTime);
        })
        .catch(error => {
            console.error("Помилка автентифікації:", error);
            const elapsedTime = Date.now() - startTime;
            const minDelay = 1000;
            const remainingTime = Math.max(0, minDelay - elapsedTime);
            
            setTimeout(() => {
                if (error.message.includes('401') || error.message.includes('Authorization')) {
                    console.log("Облікові дані авторизації відхилено");
                    setError("Невірний логін або пароль");
                } else {
                    console.log("Інша помилка автентифікації:", error.message);
                    setError("Помилка автентифікації");
                }
                setIsLoading(false);
            }, remainingTime);
        });
    };

    useEffect(() => {
        const modalElement = document.getElementById('authModal');
        const handleHidden = () => {
            setError("");
            setFormState({ login: "", password: "" });
            setIsLoading(false);
        };

        if (modalElement) {
            modalElement.addEventListener('hidden.bs.modal', handleHidden);
        }

        return () => {
            if (modalElement) {
                modalElement.removeEventListener('hidden.bs.modal', handleHidden);
            }
        };
    }, []);

    useEffect(() => {
        setFormValid(formState.login.length > 2 && formState.password.length > 2);
    }, [formState]);

    return <div className="modal fade" id="authModal" tabIndex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="authModalLabel">Вхід до сайту</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="user-login-addon"><i className="bi bi-key"></i></span>
                            <input  onChange={e => {
                            setFormState({...formState, login: e.target.value});
                        }}
                             value={formState.login} 
                            name="user-login" type="text" className="form-control"
                                placeholder="Логін" aria-label="Логін" aria-describedby="user-login-addon"/>
                            <div className="invalid-feedback"></div>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="user-password-addon"><i className="bi bi-lock"></i></span>
                            <input onChange={e => {
                                setFormState(state => { return {...state, password: e.target.value}; });
                            }}
                            name="user-password" type="password" className="form-control" placeholder="Пароль"
                                aria-label="Пароль" aria-describedby="user-password-addon"/>
                            <div className="invalid-feedback"></div>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <div className="flex-grow-1">
                                {error && (
                                    <div className="alert alert-danger alert-dismissible fade show mb-0 py-2" role="alert">
                                        <small>{error}</small>
                                        <button 
                                            type="button" 
                                            className="btn-close p-2" 
                                            onClick={() => setError("")}
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                )}
                            </div>
                            
                            {isLoading && (
                                <div className="ms-3">
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="visually-hidden">Завантаження...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                </div>
                <div className="modal-footer">
                    <button ref={closeModalRef} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Скасувати</button>
                    <button disabled ={!isFormValid || isLoading} onClick={authenticate} type="button" className="btn btn-dark" >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Вхід...
                            </>
                        ) : (
                            'Вхід'
                        )}
                    </button>
                </div>
            </div>
        </div>
    </div>;
}