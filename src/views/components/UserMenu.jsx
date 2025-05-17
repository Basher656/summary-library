import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import styles from "./UserMenu.module.css";

function UserMenu() {
    const [user, setUser] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        setShowConfirm(false);
        navigate("/");
    };

    if (!user) {
        return (
            <>
                <li><Link className={styles.authLink} to="/login">Login</Link></li>
                <li><Link className={styles.authLink} to="/register">Register</Link></li>
            </>
        );
    }

    return (
        <>
            <li className={styles.username}>Hi, {user.displayName?.split(" ")[0] || "User"}</li>
            <li>
                <button className={styles.logoutBtn} onClick={() => setShowConfirm(true)}>
                    Logout
                </button>
            </li>

            {showConfirm && (
                <div className={styles.confirmOverlay}>
                    <div className={styles.confirmBox}>
                        <p>Are you sure you want to logout?</p>
                        <div className={styles.confirmActions}>
                            <button onClick={handleLogout} className={styles.confirmYes}>Yes</button>
                            <button onClick={() => setShowConfirm(false)} className={styles.confirmCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserMenu;
