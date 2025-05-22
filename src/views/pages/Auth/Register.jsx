import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import styles from "./Register.module.css";
import { send } from "emailjs-com";

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            await updateProfile(userCredential.user, {
                displayName: `${firstName} ${lastName}`,
            });

            await setDoc(doc(db, "users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                firstName: firstName,
                lastName: lastName,
                email: email,
                role: "user",
                createdAt: new Date()
            });

            await send(
                "service_u04zfpu",
                "template_el096aq",
                {
                    firstname: firstName,
                    lastname: lastName,
                    email: email
                },
                "uwE-GnPfC4QlEobEp"
            );

            setShowModal(true);

            setTimeout(() => {
                setShowModal(false);
                navigate("/");
            }, 3000);

        } catch (err) {
            setError("Registration failed: " + err.message);
        }
    };

    return (
        <>
            <form className={styles.form} onSubmit={handleRegister}>
                <h2>Register</h2>

                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />

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

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit">Register</button>

                {error && <p className={styles.error}>{error}</p>}
            </form>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Registration Successful!</h3>
                        <p>A confirmation email has been sent to your inbox.</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default Register;
