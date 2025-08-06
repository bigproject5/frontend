import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/authSlice';
import './login.css'
import { admin_login_api, worker_login_api } from "../../api/phm_api.jsx";

function Login() {
    const [role, setRole] = useState("admin");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        "loginId": "",
        "password": ""
    })

    async function handleLogin(formData) {
        sessionStorage.removeItem('accessToken');

        let data;
        if (role === "admin") {
            data = await admin_login_api(formData);
        }
        else if (role === "worker") {
            data = await worker_login_api(formData);
        }
        console.log(data)
        if (data.token) {
            sessionStorage.setItem('accessToken', data.token);
            dispatch(loginSuccess({ user: data.user, role: data.user.role.toLowerCase() })); // Redux 스토어에 저장

            console.log("리덕트 저장 완료")
            const role_ = data.user.role;
            console.log(role_);
            if (role_ === "ADMIN") {
                navigate("/admin/dashboard"); // 관리자 대시보드로 이동
            } else if (role_ === "WORKER") {
                navigate("/worker/main"); // 작업자 메인 페이지로 이동
            }
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
               response = handleLogin(formData)
            }
            else if (role === "worker") {
               response = handleLogin(formData)
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

export default Login;
