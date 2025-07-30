import React, { useEffect, useState } from "react";
import './signup.css'
import { useNavigate } from "react-router-dom"

export function Signup() {
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const [isIdChecked, setIsIdChecked] = useState(false);
    const [lastCheckedId, setLastCheckedId] = useState('');
    const [formData, setFormData] = useState({
        "adminCode": "",
        "employeeNumber": "",
        "loginId": "",
        "name": "",
        "email": "",
        "phoneNumber": "",
        "address": "",
        "password": ""
    });
    const navigate = useNavigate();

    const handlePrev = () => {
        navigate("/")
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleIdCheck = () => {
        const loginId = formData.loginId.trim();
        if (!loginId) {
            setError("아이디를 입력해주세요.");
            return;
        }

        try {

            // const res = await fetch(``);
            // const data = await res.json();
            let data = false;
            if (loginId == "admin") data = true;
            if (data.exists) {
                setError("이미 사용 중인 아이디입니다.");
                setIsIdChecked(false);
            } else {
                setError("");
                alert("사용 가능한 아이디입니다.");
                setIsIdChecked(true);
                setLastCheckedId(loginId);
            }
        } catch (err) {
            console.error(err);
            setError("중복 확인 중 오류가 발생했습니다.");
        }
    };
    useEffect(() => {
        if (isIdChecked && formData.loginId !== lastCheckedId) {
            setIsIdChecked(false);
        }
    }, [formData.loginId, lastCheckedId, isIdChecked])


    const isFormComplete = () => {
        return (
            formData.adminCode.trim() &&
            formData.employeeNumber.trim() &&
            formData.loginId.trim() &&
            formData.name.trim() &&
            formData.email.trim() &&
            formData.phoneNumber.trim() &&
            formData.address.trim() &&
            formData.password.trim() &&
            confirmPassword.trim() &&
            formData.password === confirmPassword
        );
    };

    const isButtonEnabled = isFormComplete() && isIdChecked;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!formData.adminCode.trim() ||
            !formData.employeeNumber.trim() ||
            !formData.loginId.trim() ||
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.phoneNumber.trim() ||
            !formData.address.trim() ||
            !formData.password.trim() ||
            !confirmPassword.trim()
        ) {
            setError("모든 항목을 입력해주세요.");
            return;
        }
        if (!isIdChecked) {
            setError("아이디 중복 확인을 해주세요.");
            return;
        }
        if (formData.password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }
        alert("회원가입 성공")
        handlePrev();
    };

    return (
        <div className="signup-body">
            <div className="signup-container">
                <h2>회원가입</h2>
                <form className="signup-container-input">
                    <div className="signup-input-group">
                        <label>관리자 코드</label>
                        <input
                            type="text"
                            name="adminCode"
                            value={formData.adminCode}
                            onChange={handleChange}
                            className="signup-input"
                            placeholder="관리자 코드를 입력하세요."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>사번</label>
                        <input
                            type="text"
                            value={formData.employeeNumber}
                            name="employeeNumber"
                            onChange={handleChange}
                            className="signup-input"
                            placeholder="사번을 입력하세요."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>아이디</label>
                        <div className="signup-id-row">
                            <input
                                type="text"
                                name="loginId"
                                value={formData.loginId}
                                onChange={handleChange}
                                className="signup-input"
                                placeholder="아이디를 입력하세요."
                                disabled={isIdChecked && !formData.loginId.trim()}
                            />
                            <button
                                type="button"
                                className="id-check-btn"
                                onClick={handleIdCheck}
                                disabled={isIdChecked || !formData.loginId.trim()}

                            >중복확인</button>
                        </div>
                    </div>

                    <div className="signup-input-group">
                        <label>이름</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="signup-input"
                            placeholder="이름을 입력하세요."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>이메일</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="signup-input"
                            placeholder="이메일을 입력하세요."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>연락처</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="signup-input"
                            placeholder="연락처를 입력하세요."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>주소</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="signup-input"
                            placeholder="주소를 입력하세요."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="signup-input"
                            placeholder="비밀번호를 입력하세요."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>비밀번호 재입력</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="signup-input"
                            placeholder="비밀번호를 다시 입력하세요."
                        />
                    </div>
                    <div>
                        <button type="button" className="prev-button" onClick={handlePrev}>이전</button>
                        <button
                            type="submit"
                            className={`signup-button ${isButtonEnabled ? "enabled" : "disabled"}`}
                            onClick={handleSubmit}
                            disabled={!isButtonEnabled}
                        >
                            회원가입
                        </button>
                    </div>

                    {error && <div className="login-error-message">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default Signup;
