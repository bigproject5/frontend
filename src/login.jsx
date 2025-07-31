import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import './login.css'
import { admin_login_api, worker_login_api } from "./api";

export function Login() {
    const [role, setRole] = useState("admin");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        "loginId": "",
        "password": ""
    })

    async function handleLogin(formData) {
        let data;
        if (role === "admin") {
            data = await admin_login_api(formData);
        }
        else if (role === "worker") {
            data = await worker_login_api(formData);
        }

        if (data.token) {
            sessionStorage.setItem('accessToken', data.token);
        }
        else {
            alert("로그인 실패")
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.loginId.trim() || !formData.password.trim()) {
            alert("아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }
        try {
            let response;
            if (role === "admin") {
                handleAdminLogin(formData)
            }
            else if (role === "worker") {
                handleWorkerLogin(formData)
            }
            console.log(response);
        }
        catch (error) {
            console.error("로그인 중 오류 발생", error)
            alert("로그인 오류 발생")
        }

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSignup = (e) => {
        e.preventDefault();
        navigate("/signup")
    }

    return (
        <div className="login-body">
            <div className="login-container">
                <h2>로그인</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-role-btn-group">
                        <button
                            type="button"
                            className={`login-role-btn${role === "admin" ? " selected" : ""}`}
                            onClick={() => setRole("admin")}
                        >
                            관리자
                        </button>
                        <button
                            type="button"
                            className={`login-role-btn${role === "worker" ? " selected" : ""}`}
                            onClick={() => setRole("worker")}
                        >
                            작업자
                        </button>
                    </div>
                    <div className="login-input-group">
                        <label>
                            아이디
                            <input
                                type="text"
                                name="loginId"
                                value={formData.loginId}
                                onChange={handleChange}
                                required
                                className="login-input"
                                placeholder="아이디를 입력하세요."
                            />
                        </label>
                    </div>
                    <div className="login-input-group">
                        <label>
                            비밀번호
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                // required
                                className="login-input"
                                placeholder="비밀번호를 입력하세요."
                            />
                        </label>
                    </div>
                    <button type="submit" className="login-button">
                        로그인
                    </button>
                </form>

                <div className="signup-link">
                    {role === "admin" ? (
                        <button className="login-signup-btn" onClick={handleSignup}>회원가입</button>
                    ) : null}
                </div>

            </div>
            <div className="footer">
                © 2025 Hyundai Motor Company. All rights reserved.
            </div>
        </div>
    );
}