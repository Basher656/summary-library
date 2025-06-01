import { useEffect, useState } from "react";
import styles from "./Courses.module.css";
import { Download } from "lucide-react";
import {
    collection, getDocs, query, orderBy, doc, deleteDoc, getDoc, addDoc, serverTimestamp
} from "firebase/firestore";
import { db, auth } from "../../../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import jsPDF from "jspdf";
import alefFont from "../../../hebrew-Font";

const Courses = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const initialCourse = searchParams.get("course") || "";

    const [selectedCourse, setSelectedCourse] = useState(initialCourse);
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const handleDownloadTextAsPDF = (title, description, summaryId) => {
        logDownload(summaryId);

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        const isHebrew = (text) => /[\u0590-\u05FF]/.test(text);

        doc.addFileToVFS("Alef-Regular.ttf", alefFont);
        doc.addFont("Alef-Regular.ttf", "Alef", "normal");
        doc.setFont("Alef");

        const titleIsHebrew = isHebrew(title);
        const finalTitle = titleIsHebrew ? title.split('').reverse().join('') : title;
        const titleX = titleIsHebrew ? 200 : 20;
        const titleAlign = titleIsHebrew ? "right" : "left";

        doc.setFontSize(18);
        doc.text(finalTitle, titleX, 25, { align: titleAlign });

        doc.setLineWidth(0.3);
        doc.line(20, 30, 190, 30);

        doc.setFontSize(13);
        const lines = description.split('\n').map(line => {
            const splitLines = doc.splitTextToSize(line, 160);
            return splitLines.map(l =>
                isHebrew(l) ? l.split('').reverse().join('') : l
            );
        }).flat();

        let y = 40;
        for (let line of lines) {
            const isHeb = isHebrew(line);
            const x = isHeb ? 200 : 20;
            const align = isHeb ? "right" : "left";

            doc.text(line, x, y, { align });
            y += 8;

            if (y > 280) {
                doc.addPage();
                doc.setFont("Alef");
                doc.setFontSize(13);
                y = 30;
            }
        }

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

    const logDownload = async (summaryId) => {
        try {
            await addDoc(collection(db, "downloads"), {
                summaryId,
                timestamp: serverTimestamp()
            });
        } catch (error) {
            console.error("Failed to log download:", error);
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

                let filtered = selectedCourse
                    ? data.filter((s) => s.course === selectedCourse)
                    : data;

                if (!isAdmin) {
                    filtered = filtered.filter((s) => s.status === "Approved");
                }

                setSummaries(filtered);
            } catch (error) {
                console.error("Error fetching summaries:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummaries();
    }, [selectedCourse, isAdmin]);

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
                                {isAdmin && (
                                    <div>
                                        <small>Status: {summary.status || "Pending"}</small>
                                    </div>
                                )}
                            </div>

                            {summary.url ? (
                                <a
                                    href={summary.url}
                                    download={`${summary.title}.pdf`}
                                    className={styles.downloadBtn}
                                    onClick={() => logDownload(summary.id)}
                                >
                                    <Download size={16} /> Download PDF
                                </a>
                            ) : (
                                <button
                                    className={styles.downloadBtn}
                                    onClick={() =>
                                        handleDownloadTextAsPDF(
                                            summary.title,
                                            summary.description,
                                            summary.id
                                        )
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
