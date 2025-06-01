import { useEffect, useState } from "react";
import styles from "./Admin.module.css";
import { FileText, Check, X, Eye } from "lucide-react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const AdminPanel = () => {
    const [summaries, setSummaries] = useState([]);
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const [view, setView] = useState("summaries");

    const fetchSummaries = async () => {
        try {
            const snapshot = await getDocs(collection(db, "summaries"));
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                status: doc.data().status || "Pending"
            }));
            setSummaries(data);
        } catch (err) {
            console.error("Error fetching summaries:", err);
        }
    };

    const fetchUsers = async () => {
        try {
            const snapshot = await getDocs(collection(db, "users"));
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const handleApprove = async (id) => {
        await updateDoc(doc(db, "summaries", id), { status: "Approved" });
        fetchSummaries();
    };

    const handleReject = async (id) => {
        await updateDoc(doc(db, "summaries", id), { status: "Rejected" });
        fetchSummaries();
    };

    const handleView = (summary) => {
        alert(`📄 ${summary.title}\n\nDescription:\n${summary.description || "No description"}`);
    };

    const handleResetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            alert(`Password reset email sent to ${email}`);
        } catch (error) {
            console.error("Reset failed:", error);
            alert("Failed to send password reset email");
        }
    };

    const filteredSummaries = filter
        ? summaries.filter((s) => (s.status || "").toLowerCase() === filter.toLowerCase())
        : summaries;

    useEffect(() => {
        fetchSummaries();
        fetchUsers();
    }, []);

    return (
        <div className={styles.adminContainer}>
            <aside className={styles.sidebar}>
                <h2>Admin Panel</h2>
                <nav className={styles.navButtons}>
                    <button
                        onClick={() => setView("summaries")}
                        className={view === "summaries" ? styles.activeBtn : ""}
                    >
                        Summaries
                    </button>
                    <button
                        onClick={() => setView("users")}
                        className={view === "users" ? styles.activeBtn : ""}
                    >
                        Users
                    </button>
                </nav>
            </aside>

            <main className={styles.mainContent}>
                {view === "summaries" && (
                    <>
                        <h2 className={styles.pageTitle}>Summary Management</h2>
                        <p className={styles.pageSubtitle}>
                            Review, approve, reject, or preview summaries submitted by users.
                        </p>

                        <div className={styles.filterBar}>
                            <label htmlFor="statusFilter">Filter by status: </label>
                            <select
                                id="statusFilter"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        <table className={styles.summaryTable}>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Date</th>
                                    <th>Course</th>
                                    <th>Uploader</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSummaries.map((summary, index) => (
                                    <tr key={index}>
                                        <td className={styles.titleCell}>
                                            <FileText size={16} className={styles.icon} />
                                            {summary.title}
                                        </td>
                                        <td>
                                            {summary.createdAt?.toDate?.().toLocaleDateString() || "N/A"}
                                        </td>
                                        <td>{summary.course}</td>
                                        <td>{summary.uploader || "admin"}</td>
                                        <td>
                                            <span className={`${styles.status} ${styles[summary.status.toLowerCase()]}`}>
                                                {summary.status}
                                            </span>
                                        </td>
                                        <td className={styles.actions}>
                                            <Eye className={styles.actionIcon} onClick={() => handleView(summary)} />
                                            <Check className={styles.actionIcon} onClick={() => handleApprove(summary.id)} />
                                            <X className={styles.actionIcon} onClick={() => handleReject(summary.id)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {view === "users" && (
                    <>
                        <h2 className={styles.pageTitle}>User Management</h2>
                        <p className={styles.pageSubtitle}>Total users: {users.length}</p>

                        <table className={styles.summaryTable}>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.email}</td>
                                        <td>{user.role || "user"}</td>
                                        <td>
                                            <button
                                                className={styles.resetBtn}
                                                onClick={() => handleResetPassword(user.email)}
                                            >
                                                Reset Password
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </main>
        </div>
    );
};

export default AdminPanel;