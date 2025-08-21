import './signup.css'


export default function PasswordValidationPopup({ password, isVisible }) {
    const rules = [
        {
            id: 'length',
            text: '최소 8자 이상',
            isValid: password.length >= 8
        },
        {
            id: 'lowercase',
            text: '소문자 포함',
            isValid: /(?=.*[a-z])/.test(password)
        },
        {
            id: 'uppercase',
            text: '대문자 포함',
            isValid: /(?=.*[A-Z])/.test(password)
        },
        {
            id: 'number',
            text: '숫자 포함',
            isValid: /(?=.*[0-9])/.test(password)
        },
        {
            id: 'special',
            text: '특수문자 포함 (!@#$%^&*()-_=+{};:,<.>)',
            isValid: /(?=.*[!@#$%^&*()\-_=+{};:,<.>])/.test(password)
        }
    ];

    if (!isVisible) return null;

    return (
        <div className="password-popup">
            <div className="password-popup-content">
                <h4>비밀번호 요구사항</h4>
                <ul className="password-rules">
                    {rules.map(rule => (
                        <li key={rule.id} className={`password-rule ${rule.isValid ? 'valid' : 'invalid'}`}>
                            <span className={`rule-icon ${rule.isValid ? 'check' : 'cross'}`}>
                                {rule.isValid ? '✓' : '✗'}
                            </span>
                            {rule.text}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}