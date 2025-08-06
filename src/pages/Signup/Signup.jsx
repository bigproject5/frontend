import React, {useEffect, useState} from "react";
import './signup.css'
import {useNavigate} from "react-router-dom"
import {Signup_api} from "../Api/phm_api";

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
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleIdCheck = () => {
        const loginId = formData.loginId.trim();
        if (!loginId) {
            return;
        }

        try {
            let data = false;
            if (data.exists) {
                setIsIdChecked(false);
            } else {
                setError("");
                setIsIdChecked(true);
                setLastCheckedId(loginId);
            }
        } catch (err) {
            console.error(err);
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
            return;
        }
        if (!isIdChecked) {
            return;
        }
        if (formData.password !== confirmPassword) {
            return;
        }

        try {
            const response = Signup_api(formData);
        } catch (err) {
            return;
        }


        handlePrev();
    };

    return (
        <div className="signup-body">
            <div className="signup-container">
                <form className="signup-container-input">
                    <div className="signup-input-group">
                        <input
                            type="text"
                            name="adminCode"
                            value={formData.adminCode}
                            onChange={handleChange}
                            className="signup-input"
                        />
                    </div>
                    <div className="signup-input-group">
                        <input
                            type="text"
                            value={formData.employeeNumber}
                            name="employeeNumber"
                            onChange={handleChange}
                            className="signup-input"
                        />
                    </div>
                    <div className="signup-input-group">
                        <div className="signup-id-row">
                            <input
                                type="text"
                                name="loginId"
                                value={formData.loginId}
                                onChange={handleChange}
                                className="signup-input"
                                disabled={isIdChecked && !formData.loginId.trim()}
                            />
                            <button
                                type="button"
                                className="id-check-btn"
                                onClick={handleIdCheck}
                                disabled={isIdChecked || !formData.loginId.trim()}
                            ></button>
                        </div>
                    </div>

                    <div className="signup-input-group">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="signup-input"
                        />
                    </div>
                    <div className="signup-input-group">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="signup-input"
                        />
                    </div>
                    <div className="signup-input-group">
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="signup-input"
                        />
                    </div>
                    <div className="signup-input-group">
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="signup-input"
                        />
                    </div>
                    <div className="signup-input-group">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="signup-input"
                        />
                    </div>
                    <div className="signup-input-group">
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="signup-input"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className={`signup-button ${isButtonEnabled ? "enabled" : "disabled"}`}
                            onClick={handleSubmit}
                            disabled={!isButtonEnabled}
                        >
                        </button>
                    </div>

                    {error && <div className="login-error-message">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default Signup;