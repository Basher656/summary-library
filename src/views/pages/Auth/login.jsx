import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const [userName, setUserName] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const displayName = userCredential.user.displayName || "User";
            setUserName(displayName.split(" ")[0]);

            setError("");
            setShowErrorModal(false);
            setShowWelcomeModal(true);

            setTimeout(() => {
                setShowWelcomeModal(false);
                navigate("/");
            }, 3000);

        } catch (err) {
            setError("Please try again");
            setShowErrorModal(true);
        }
    };

    return (
        <div className={styles.loginWrapper}>
            <form className={styles.form} onSubmit={handleLogin}>
                <h2>Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>

            {showErrorModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.errorTitle}>Login Failed</h3>
                        <p>{error}</p>
                        <button
                            className={styles.closeBtn}
                            onClick={() => setShowErrorModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showWelcomeModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.successTitle}>WELCOME BACK</h3>
                        <p>{userName} 👋</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
