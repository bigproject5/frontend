import React, { useEffect, useState } from "react";
import './signup.css'
import { useNavigate } from "react-router-dom"
import { Signup_api } from "../phm_api.jsx";

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
            setError("���̵� �Է����ּ���.");
            return;
        }

        try {
            let data = false;
            if (loginId == "admin") data = true;
            if (data.exists) {
                setError("�̹� ��� ���� ���̵��Դϴ�.");
                setIsIdChecked(false);
            } else {
                setError("");
                alert("��� ������ ���̵��Դϴ�.");
                setIsIdChecked(true);
                setLastCheckedId(loginId);
            }
        } catch (err) {
            console.error(err);
            setError("�ߺ� Ȯ�� �� ������ �߻��߽��ϴ�.");
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
            setError("��� �׸��� �Է����ּ���.");
            return;
        }
        if (!isIdChecked) {
            setError("���̵� �ߺ� Ȯ���� ���ּ���.");
            return;
        }
        if (formData.password !== confirmPassword) {
            setError("��й�ȣ�� ��ġ���� �ʽ��ϴ�.");
            return;
        }

        try {
            const response = Signup_api(formData);
        }
        catch (err) {
            alert("ȸ������ ����")
            return;
        }



        alert("ȸ������ ����")
        handlePrev();
    };

    return (
        <div className="signup-body">
            <div className="signup-container">
                <h2>ȸ������</h2>
                <form className="signup-container-input">
                    <div className="signup-input-group">
                        <label>������ �ڵ�</label>
                        <input
                            type="text"
                            name="adminCode"
                            value={formData.adminCode}
                            onChange={handleChange}
                            className="signup-input"
                            placeholder="������ �ڵ带 �Է��ϼ���."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>���</label>
                        <input
                            type="text"
                            value={formData.employeeNumber}
                            name="employeeNumber"
                            onChange={handleChange}
                            className="signup-input"
                            placeholder="����� �Է��ϼ���."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>���̵�</label>
                        <div className="signup-id-row">
                            <input
                                type="text"
                                name="loginId"
                                value={formData.loginId}
                                onChange={handleChange}
                                className="signup-input"
                                placeholder="���̵� �Է��ϼ���."
                                disabled={isIdChecked && !formData.loginId.trim()}
                            />
                            <button
                                type="button"
                                className="id-check-btn"
                                onClick={handleIdCheck}
                                disabled={isIdChecked || !formData.loginId.trim()}

                            >�ߺ�Ȯ��</button>
                        </div>
                    </div>

                    <div className="signup-input-group">
                        <label>�̸�</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="signup-input"
                            placeholder="�̸��� �Է��ϼ���."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>�̸���</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="signup-input"
                            placeholder="�̸����� �Է��ϼ���."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>����ó</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="signup-input"
                            placeholder="����ó�� �Է��ϼ���."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>�ּ�</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="signup-input"
                            placeholder="�ּҸ� �Է��ϼ���."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>��й�ȣ</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="signup-input"
                            placeholder="��й�ȣ�� �Է��ϼ���."
                        />
                    </div>
                    <div className="signup-input-group">
                        <label>��й�ȣ ���Է�</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="signup-input"
                            placeholder="��й�ȣ�� �ٽ� �Է��ϼ���."
                        />
                    </div>
                    <div>
                        <button type="button" className="prev-button" onClick={handlePrev}>����</button>
                        <button
                            type="submit"
                            className={`signup-button ${isButtonEnabled ? "enabled" : "disabled"}`}
                            onClick={handleSubmit}
                            disabled={!isButtonEnabled}
                        >
                            ȸ������
                        </button>
                    </div>

                    {error && <div className="login-error-message">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default Signup;