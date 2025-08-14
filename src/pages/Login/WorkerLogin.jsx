import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/authSlice';
import './login.css'
import { worker_login_api } from "../../api/phm_api.jsx";

function WorkerLogin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        "loginId": "",
        "password": ""
    })

    async function handleLogin(formData) {
        sessionStorage.removeItem('accessToken');

        const data = await worker_login_api(formData);

        console.log(data)
        if (data.token) {
            sessionStorage.setItem('accessToken', data.token);
            dispatch(loginSuccess({ user: data.user, role: data.user.role, taskType: data.user.taskType.toUpperCase()}));

            console.log("리덕트 저장 완료")
            const role_ = data.user.role;
            console.log(role_);

            navigate("/worker/main"); // 작업자 메인 페이지로 이동

        }
        else {
            alert("로그인 실패")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.loginId.trim() || !formData.password.trim()) {
            alert("아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }
        try {
            const response = await handleLogin(formData)
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


    return (
        <div className="login-body worker-theme">
            <div className="login-container">
                <div className="login-header">
                    <h2 style={{
                        margin: "10px"
                    }}>작업자 로그인</h2>
                    {/*<p className="login-subtitle">작업자 전용 로그인 페이지입니다</p>*/}
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
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
                                placeholder="작업자 아이디를 입력하세요"
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
                                required
                                className="login-input"
                                placeholder="비밀번호를 입력하세요"
                            />
                        </label>
                    </div>
                    <button type="submit" className="login-button">
                        작업자 로그인
                    </button>
                </form>
            </div>

            <div className="footer">
                © 2025 Hyundai Motor Company. All rights reserved.
            </div>
        </div>
    );
}

export default WorkerLogin;