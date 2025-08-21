import React, { useEffect, useState } from "react";
import './signup.css'
import { useNavigate } from "react-router-dom"
import {checkAdminLoginId, Signup_api} from "../../api/phm_api.jsx";
import {GoogleReCaptchaProvider, useGoogleReCaptcha} from "react-google-recaptcha-v3";
import PolicyModal from "./PrivacyModal.jsx";
import PasswordValidationPopup from "./PasswordValidationPopup.jsx";

function SignupForm() {
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [isIdChecked, setIsIdChecked] = useState(false);
    const [lastCheckedId, setLastCheckedId] = useState('');
    const [showPasswordPopup, setShowPasswordPopup] = useState(false);
    const [formData, setFormData] = useState({
        "adminCode": "",
        "employeeNumber": "",
        "loginId": "",
        "name": "",
        "email": "",
        "phoneNumber": "",
        "address": "",
        "password": "",
    });
    const [isAgreementChecked, setIsAgreementChecked] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalAgreements, setModalAgreements] = useState({
        terms: false,
        privacy: false,
        marketing: false
    });
    const navigate = useNavigate();

    const handlePrev = () => {
        navigate("/admin-login")
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordFocus = () => {
        setShowPasswordPopup(true);
    };

    const handlePasswordBlur = () => {
        // 약간의 지연을 주어 사용자가 팝업을 볼 수 있도록 함
        setTimeout(() => {
            setShowPasswordPopup(false);
        }, 200);
    };

    const handleIdCheck = async () => {
        const loginId = formData.loginId.trim();
        if (!loginId) {
            setError("아이디를 입력해주세요.");
            return;
        }
        if(loginId.includes(' ')){
            setError("아이디에 공백이 포함되어 있습니다.")
            return;
        }
        if(loginId.length < 8 || loginId.length > 20){
            setError("아이디는 8자리 이상 20자리 이하여야 합니다.");
            return;
        }
        if (/[^a-zA-Z0-9]/.test(formData.loginId.trim())) {
            setError('아이디는 영문과 숫자로만 입력해야합니다.');
            return;
        }
        try {
            const data = await checkAdminLoginId(loginId);
            if (!data.available) {
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
            formData.password === confirmPassword &&
            isAgreementChecked
        );
    };

    const isButtonEnabled = isFormComplete() && isIdChecked;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const passwordRegex = /^(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;
        const loginIdRegex = /^[A-Za-z0-9]{8,20}$/;
        const phoneRegex = /^\d+$/;
        const nameRegex = /^[가-힣a-zA-Z\s]{2,20}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const lowercaseRegex = /(?=.*[a-z])/;
        const uppercaseRegex = /(?=.*[A-Z])/;
        const numberRegex = /(?=.*[0-9])/;

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

        if (!nameRegex.test(formData.name.trim())) {
            setError("이름은 2-20자의 한글 또는 영문만 입력 가능합니다.");
            return;
        }
        if (!loginIdRegex.test(formData.loginId)) {
            setError("아이디는 8-20자리의 영문과 숫자로 구성되어야 합니다.");
            return;
        }
        if (!isIdChecked) {
            setError("아이디 중복 확인을 해주세요.");
            return;
        }
        if (formData.loginId !== lastCheckedId) {
            setError("아이디를 변경했습니다. 중복 확인을 다시 해주세요.");
            return;
        }
        if (!emailRegex.test(formData.email)) {
            setError('올바른 이메일 형식을 입력해주세요.');
            return;
        }
        if (!phoneRegex.test(formData.phoneNumber)) {
            setError("전화번호는 숫자만 입력해주세요.");
            return;
        }
        if (!passwordRegex.test(formData.password)) {
            setError("비밀번호는 8자리 이상 대문자, 특수문자를 포함해야 합니다.");
            return;
        }
        if (formData.password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (!lowercaseRegex.test(formData.password)) {
            setError("비밀번호는 소문자를 포함해야 합니다.");
            return;
        }
        if (!uppercaseRegex.test(formData.password)) {
            setError("비밀번호는 대문자를 포함해야 합니다.");
            return;
        }
        if (!numberRegex.test(formData.password)) {
            setError("비밀번호는 숫자를 포함해야 합니다.");
            return;
        }
        if (formData.address.trim().length < 10) {
            setError("주소를 10자 이상 입력해주세요.");
            return;
        }
        if (!executeRecaptcha) {
            console.log("reCAPTCHA 실행 함수가 준비되지 않았습니다.");
            alert("reCaptcha 오류");
            return;
        }
        const token = await executeRecaptcha("signup");

        try {
            const response = await Signup_api(formData, token);
            console.log(response);
            if (response.status < 200 || response.status >= 300) {
                if (response.validationErrors) {
                    const messages = Object.entries(response.validationErrors)
                        .map(([field, msg]) => {
                            switch(field) {
                                case "password":
                                    return "비밀번호는 8자리 이상에 특수문자가 포함되어야 합니다.";
                                case "loginId":
                                    return "아이디는 8자리 이상이어야 합니다";
                                default:
                                    return `${field}: ${msg}`;
                            }
                        })
                        .join("\n");
                    alert("회원가입 실패:\n" + messages);
                } else {
                    alert("회원가입 실패: " + (response || "알 수 없는 오류"));
                }
                return;
            }
        }
        catch (err) {
            alert("회원가입 실패", err);
            return;
        }

        alert("회원가입 성공");
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
                            placeholder="관리자 코드를 입력하세요"
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
                            placeholder="사번을 입력하세요"
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
                                placeholder="아이디는 8자리 이상 20자리 이하여야 합니다"
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
                            placeholder="이름을 입력하세요"
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
                            placeholder="이메일을 입력하세요"
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
                            placeholder="연락처를 입력하세요(숫자만)"
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
                            placeholder="주소를 입력하세요"
                        />
                    </div>
                    <div className="signup-input-group password-input-group">
                        <label>비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onFocus={handlePasswordFocus}
                            onBlur={handlePasswordBlur}
                            className="signup-input"
                            placeholder="특수문자, 영문 대문자를 포함한 영문과 숫자 8자리 이상이어야 합니다"
                        />
                        <PasswordValidationPopup
                            password={formData.password}
                            isVisible={showPasswordPopup}
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>비밀번호 재입력</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="signup-input"
                            placeholder="비밀번호 재입력"
                        />
                    </div>
                    <label>
                        <input
                            type="checkbox"
                            checked={isAgreementChecked}
                            onChange={() => setShowModal(true)}
                        />
                        개인정보 활용 동의 (필수)
                    </label>

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
                <PolicyModal
                    visible={showModal}
                    agreements={modalAgreements}
                    setAgreements={setModalAgreements}
                    onClose={(confirmed) => {
                        setShowModal(false);
                        if (confirmed) setIsAgreementChecked(true);
                    }}
                />
            </div>
        </div>
    );
}

export default function Signup() {
    return (
        <GoogleReCaptchaProvider reCaptchaKey="6LexfqQrAAAAAB74EWP7GNCePpS60kzv2a9tWXif">
            <SignupForm />
        </GoogleReCaptchaProvider>
    );
}