import React, {useEffect, useState} from "react";
import { useNavigate, Link } from "react-router-dom"
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/authSlice';
import './login.css'
import { workerLoginApi } from "../../api/loginApi.jsx";
import FindIdModal from './FindIdModal';
import FindPasswordModal from './FindPasswordModal';

function WorkerLogin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        "loginId": "",
        "password": ""
    })

    const [rememberMe, setRememberMe] = useState(false);
    const [showFindIdModal, setShowFindIdModal] = useState(false);
    const [showFindPasswordModal, setShowFindPasswordModal] = useState(false);

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

    const handleRememberChange = (e) => {
        setRememberMe(e.target.checked);
    };

    async function handleLogin(formData) {
        sessionStorage.removeItem('accessToken');

        const data = await workerLoginApi(formData);

        console.log(data)
        if (data.token) {
            sessionStorage.setItem('accessToken', data.token);
            dispatch(loginSuccess({ user: data.user, role: data.user.role, taskType: data.user.taskType.toUpperCase()}));

            console.log("리덕트 저장 완료")

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

    // 아이디 찾기 성공 핸들러
    const handleFindIdSuccess = (foundId) => {
        setFormData(prev => ({
            ...prev,
            loginId: foundId
        }));
        setShowFindIdModal(false);
    };

    // 비밀번호 찾기 성공 핸들러
    const handleFindPasswordSuccess = () => {
        setShowFindPasswordModal(false);
        alert("임시 비밀번호가 등록된 이메일로 발송되었습니다.");
    };

    return (
        <div className="login-wrapper">
            <video autoPlay muted loop id="background-video">
                <source src="/터널_속_현대차_주행_영상_생성.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="login-body">
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
                        
                        {/* 아이디/비밀번호 찾기 링크 */}
                        <div className="login-links">
                            <button 
                                type="button" 
                                className="link-button"
                                onClick={() => setShowFindIdModal(true)}
                            >
                                아이디 찾기
                            </button>
                            <span className="link-divider">|</span>
                            <button 
                                type="button" 
                                className="link-button"
                                onClick={() => setShowFindPasswordModal(true)}
                            >
                                비밀번호 찾기
                            </button>
                        </div>
                        
                        <button type="submit" className="login-button">
                            작업자 로그인
                        </button>
                    </form>
                </div>

                {/* 아이디 찾기 모달 */}
                {showFindIdModal && (
                    <FindIdModal
                        onClose={() => setShowFindIdModal(false)}
                        onSuccess={handleFindIdSuccess}
                    />
                )}

                {/* 비밀번호 찾기 모달 */}
                {showFindPasswordModal && (
                    <FindPasswordModal
                        onClose={() => setShowFindPasswordModal(false)}
                        onSuccess={handleFindPasswordSuccess}
                    />
                )}

                <div className="footer_text">
                    © 2025 CHECKAR
                </div>
            </div>
        </div>
    );
}

export default WorkerLogin;