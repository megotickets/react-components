import { useState } from "react";
import { useWeb3Context } from "./web3-context";
import EyeIcon from "./icons/EyeIcon";
import EyeOffIcon from "./icons/EyeOffIcon";
import { MegoButton, useLanguage } from "@megotickets/core"; 



const LoginSection = () => {
    const { loginWithEmail } = useWeb3Context();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        loginWithEmail(email, password);
    };

    const { t } = useLanguage();

    return (
        <>
            <h5 className="mego-login-text mego-font-medium" style={{ marginTop: '10px' }}>
                {t("loginTitle", "wallet")}
            </h5>
            <form
                onSubmit={handleLogin}
                className="mego-form"
            >

                <input
                    className="mego-input"
                    id="email"
                    placeholder={t("emailPlaceholder", "wallet")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    required
                    title="Insert a valid email"
                />

                <div style={{ position: 'relative', width: '100%' }}>
                    <input
                        className="mego-input"
                        id="password"
                        placeholder={t("passwordPlaceholder", "wallet")}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title={t("passwordError", "wallet")}
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '40%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer'
                        }}
                    >
                        {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </span>
                </div>

                <MegoButton
                    className="chooseType-btn"
                    type="submit"
                    style={{ maxWidth: 200 }}
                >
                    <p className="mego-font-medium font-satoshi">{t("login", "wallet")}</p>
                </MegoButton>
            </form>
        </>
    );
};

export default LoginSection;