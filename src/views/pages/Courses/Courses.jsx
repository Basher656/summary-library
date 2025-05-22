import { useEffect, useState } from "react";
import styles from "./Courses.module.css";
import { Download } from "lucide-react";
import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    deleteDoc,
    getDoc
} from "firebase/firestore";
import { db, auth } from "../../../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import jsPDF from "jspdf";

const Courses = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const initialCourse = searchParams.get("course") || "";

    const [selectedCourse, setSelectedCourse] = useState(initialCourse);
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const courseNames = {
        cs: "Computer Science",
        eco: "Economics",
        web: "Web Development",
        psy: "Psychology"
    };

    const handleDownloadTextAsPDF = (title, description) => {
        const doc = new jsPDF();
        doc.setFont("Helvetica");
        doc.setFontSize(16);
        doc.text(title, 10, 20);
        doc.setFontSize(12);
        const lines = doc.splitTextToSize(description, 180);
        doc.text(lines, 10, 30);
        doc.save(`${title}.pdf`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this summary?")) return;

        try {
            await deleteDoc(doc(db, "summaries", id));
            setSummaries((prev) => prev.filter((s) => s.id !== id));
        } catch (error) {
            console.error("Error deleting summary:", error);
        }
    };

    useEffect(() => {
        const fetchSummaries = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "summaries"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const filtered = selectedCourse
                    ? data.filter((s) => s.course === selectedCourse)
                    : data;

                setSummaries(filtered);
            } catch (error) {
                console.error("Error fetching summaries:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummaries();
    }, [selectedCourse]);

    useEffect(() => {
        const checkAdmin = async (user) => {
            if (!user) return;
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setIsAdmin(userData.role === "admin");
                }
            } catch (err) {
                console.error("Error checking admin status:", err);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            checkAdmin(user);
        });

        return () => unsubscribe();
    }, []);

    const handleCourseChange = (e) => {
        const value = e.target.value;
        setSelectedCourse(value);
        navigate(`/courses${value ? `?course=${value}` : ""}`);
    };

    return (
        <div className={styles.coursePage}>
            <div className={styles.banner}>
                <div className={styles.bannerText}>
                    <h1>Courses Summaries</h1>
                    <p>Select a course to view relevant summaries</p>
                </div>
            </div>

            <section className={styles.content}>
                <div className={styles.filterBar}>
                    <label htmlFor="courseSelect">Filter by course:</label>
                    <select
                        id="courseSelect"
                        value={selectedCourse}
                        onChange={handleCourseChange}
                    >
                        <option value="">All Courses</option>
                        <option value="cs">Computer Science</option>
                        <option value="eco">Economics</option>
                        <option value="web">Web Development</option>
                        <option value="psy">Psychology</option>
                    </select>
                </div>

                <h2 className={styles.title}>Available Summaries</h2>

                {loading ? (
                    <p>Loading summaries...</p>
                ) : summaries.length === 0 ? (
                    <p>No summaries available yet.</p>
                ) : (
                    summaries.map((summary) => (
                        <div key={summary.id} className={styles.card}>
                            <div className={styles.text}>
                                <h3>
                                    {summary.title}{" "}
                                    {summary.format && (
                                        <span className={styles.badge}>{summary.format}</span>
                                    )}
                                </h3>
                                <p>{summary.description}</p>
                                <small>
                                    Added:{" "}
                                    {summary.createdAt?.toDate().toLocaleDateString() || "Unknown"}
                                </small>
                            </div>

                            {summary.url ? (
                                <a
                                    href={summary.url}
                                    download={`${summary.title}.pdf`}
                                    className={styles.downloadBtn}
                                >
                                    <Download size={16} /> Download PDF
                                </a>
                            ) : (
                                <button
                                    className={styles.downloadBtn}
                                    onClick={() =>
                                        handleDownloadTextAsPDF(summary.title, summary.description)
                                    }
                                >
                                    <Download size={16} /> Download as PDF
                                </button>
                            )}

                            {isAdmin && (
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => handleDelete(summary.id)}
                                >
                                    🗑️ Delete
                                </button>
                            )}
                        </div>
                    ))
                )}
            </section>
        </div>
    );
};

export default Courses;
