import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Link } from 'react-router-dom';
import { auth, db } from "../../firebase";
import styles from "./Navbar.module.css";
import UserMenu from "./UserMenu";

function Navbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    const userData = userDoc.exists() ? userDoc.data() : {};
                    setUser({ ...currentUser, role: userData.role || "user" });
                } catch (error) {
                    console.error("Failed to fetch user role:", error);
                    setUser({ ...currentUser, role: "user" }); 
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <nav className={styles.navbar}>
            <div className={styles.leftMenu}>
                <ul className={styles.menuList}>
                    <li><Link className={styles.link} to="/">Home</Link></li>

                    {user && (
                        <>
                            <li><Link className={styles.link} to="/courses">Courses</Link></li>
                            <li><Link className={styles.link} to="/upload">Upload</Link></li>

                            {user.role === "admin" && (
                                <>
                                    <li><Link className={styles.link} to="/dashboard">Dashboard</Link></li>
                                    <li><Link className={styles.link} to="/admin">Admin</Link></li>
                                </>
                            )}

                            <li><Link className={styles.link} to="/help">Help & Settings</Link></li>
                        </>
                    )}
                </ul>
            </div>

            <div className={styles.rightMenu}>
                <ul className={styles.authList}>
                    <UserMenu />
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
