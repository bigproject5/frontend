import React, { useState } from "react";
import './signup.css'

export function Signup() {
    const [adminCode, setAdminCode] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isIdChecked, setIsIdChecked] = useState(false);

    const handleIdCheck = () => {
        if (!userId.trim()) {
            setError("아이디를 입력해주세요.");
            return;
        }
        // In a real application, you would make an API call to check for the user ID.
        // For this example, we'll simulate it.
        const existingUserIds = ["admin", "user"];
        if (existingUserIds.includes(userId)) {
            setError("이미 사용중인 아이디입니다.");
            setIsIdChecked(false);
        } else {
            setError("");
            alert("사용 가능한 아이디입니다.");
            setIsIdChecked(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (
            !adminCode.trim() ||
            !employeeId.trim() ||
            !userId.trim() ||
            !name.trim() ||
            !email.trim() ||
            !phone.trim() ||
            !address.trim() ||
            !password.trim() ||
            !confirmPassword.trim()
        ) {
            setError("모든 항목을 입력해주세요.");
            return;
        }
        if (!isIdChecked) {
            setError("아이디 중복 확인을 해주세요.");
            return;
        }
        if (password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        setSuccess("회원가입이 완료되었습니다!");
    };

    return (
        <div className="body">
            <div className="signup-container">
                <h2>회원가입</h2>
                <form className="signup-container-input" onSubmit={handleSubmit}>
                    <div className="signup-input-group">
                        <label>관리자 코드</label>
                        <input
                            type="text"
                            value={adminCode}
                            onChange={(e) => setAdminCode(e.target.value)}
                            className="signup-input"
                            placeholder="관리자 코드를 입력하세요."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>사번</label>
                        <input
                            type="text"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            className="signup-input"
                            placeholder="사번을 입력하세요."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>아이디</label>
                        <div className="signup-id-row">
                            <input
                                type="text"
                                value={userId}
                                onChange={(e) => { setUserId(e.target.value); setIsIdChecked(false); }}
                                className="signup-input"
                                placeholder="아이디를 입력하세요."
                                disabled={isIdChecked}
                            />
                            <button type="button" className="id-check-btn" onClick={handleIdCheck} disabled={isIdChecked}>중복확인</button>
                        </div>
                    </div>

                    <div className="signup-input-group">
                        <label>이름</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="signup-input"
                            placeholder="이름을 입력하세요."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>이메일</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="signup-input"
                            placeholder="이메일을 입력하세요."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>연락처</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="signup-input"
                            placeholder="연락처를 입력하세요."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>주소</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="signup-input"
                            placeholder="주소를 입력하세요."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                    <button type="submit" className="signup-button" disabled={!isIdChecked}>
                        회원가입
                    </button>
                    {error && <div className="login-error-message">{error}</div>}
                    {success && <div className="login-success-message">{success}</div>}
                </form>
            </div>
        </div>
    );
}

export default Signup;
