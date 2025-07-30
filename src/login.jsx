import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import './login.css'


export function Login() {
    const [role, setRole] = useState("admin");
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!loginId.trim() || !password.trim()) {
            alert("아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }
        //로그인 로직
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
                                type="loginId"
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                                // required
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

            <div>
                © 2025 Hyundai Motor Company. All rights reserved.
            </div>

        </div>
    );
}