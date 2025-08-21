import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/authSlice';
import './login.css'
import { admin_login_api, dev_login_api } from "../../api/phm_api.jsx";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        "loginId": "",
        "password": ""
    });

    const [rememberMe, setRememberMe] = useState(false);

    // 컴포넌트 마운트 시 저장된 아이디 불러오기
    useEffect(() => {
        const savedLoginId = localStorage.getItem('rememberedLoginId');
        const wasRemembered = localStorage.getItem('rememberMe') === 'true';

        if (savedLoginId && wasRemembered) {
            setFormData(prev => ({
                ...prev,
                loginId: savedLoginId
            }));
            setRememberMe(true);
        }
    }, []);

    async function handleLogin(formData) {
        sessionStorage.removeItem('accessToken');

        const data = await admin_login_api(formData);

        console.log(data)
        if (data.token) {
            sessionStorage.setItem('accessToken', data.token);
            dispatch(loginSuccess({ user: data.user, role: data.user.role, taskType: data.user.taskType.toUpperCase()}));

            console.log("리덕트 저장 완료")

            // 아이디 저장 처리
            if (rememberMe) {
                localStorage.setItem('rememberedLoginId', formData.loginId);
                localStorage.setItem('rememberMe', 'true');
            } else {
                // 체크 해제 시 저장된 정보 삭제
                localStorage.removeItem('rememberedLoginId');
                localStorage.removeItem('rememberMe');
            }

            const role_ = data.user.role;
            console.log(role_);

            navigate("/admin/dashboard"); // 관리자 대시보드로 이동

        }
        else {
            alert("로그인 실패")
        }
    }

    const handleDevLogin = async () => {
        try {
            const data = await dev_login_api();
            if (data.token) {
                sessionStorage.setItem('accessToken', data.token);
                dispatch(loginSuccess({ user: data.user, role: data.user.role }));
                alert('DEV token acquired and user role set to DEV.');
                navigate('/dev');
            } else {
                alert('Failed to get DEV token.');
            }
        } catch (error) {
            console.error('Error during DEV login:', error);
            alert('An error occurred during DEV login.');
        }
    };

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

    const handleRememberChange = (e) => {
        setRememberMe(e.target.checked);
    };

    const handleSignup = (e) => {
        e.preventDefault();
        navigate("/signup")
    }

    return (
        <div className="login-wrapper">
            <video autoPlay muted loop id="background-video">
                <source src="/src/assets/터널_속_현대차_주행_영상_생성.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="login-body">
                <div className="login-container">
                    <div className="login-header">
                        <h2 style={{
                            margin: "10px"
                        }}>관리자 로그인</h2>
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
                                    placeholder="관리자 아이디를 입력하세요"
                                    autoComplete="username"
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
                                    autoComplete="current-password"
                                />
                            </label>
                        </div>

                        {/* 아이디 저장 체크박스 */}
                        <div className="remember-me-container">
                            <label className="remember-me-label">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={handleRememberChange}
                                    className="remember-me-checkbox"
                                />
                                <span className="checkmark"></span>
                                아이디 저장
                            </label>
                        </div>

                        <button type="submit" className="login-button">
                            관리자 로그인
                        </button>
                    </form>

                    <div className="signup-link">
                        <button className="login-signup-btn" onClick={handleSignup}>
                            관리자 계정 등록
                        </button>
                    </div>
                </div>

                {/* 개발용 버튼  */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                }}>
                    <button
                        type="button"
                        className="login-role-btn"
                        onClick={handleDevLogin}
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '10px 15px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        DEV Login
                    </button>
                    <Link to="/dev" style={{
                        backgroundColor: '#008CBA',
                        color: 'white',
                        padding: '10px 15px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        textAlign: 'center',
                    }}>
                        /dev
                    </Link>
                </div>

                <div className="footer">
                    © 2025 Hyundai Motor Company. All rights reserved.
                </div>
            </div>
        </div>
    );
}

export default Login;