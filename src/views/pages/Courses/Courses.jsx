import { useEffect, useState } from "react";
import styles from "./Courses.module.css";
import { Download } from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebase"; // ודא נתיב נכון

const Courses = () => {
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummaries = async () => {
            try {
                const q = query(collection(db, "summaries"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSummaries(data);
            } catch (error) {
                console.error("Error fetching summaries:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummaries();
    }, []);

    return (
        <div className={styles.coursePage}>
            <div className={styles.banner}>
                <div className={styles.bannerText}>
                    <h1>Introduction to Computer Science</h1>
                    <p>Learn the fundamentals of algorithms and programming principles in an accessible and practical way.</p>
                </div>
            </div>

            <section className={styles.content}>
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
                                    <span className={styles.badge}>{summary.format}</span>
                                </h3>
                                <p>{summary.description}</p>
                                <small>
                                    Added:{" "}
                                    {summary.createdAt?.toDate().toLocaleDateString() || "Unknown"}
                                </small>
                            </div>
                            <a
                                href={summary.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.downloadBtn}
                            >
                                <Download size={16} /> Download
                            </a>
                        </div>
                    ))
                )}
            </section>
        </div>
    );
};

export default Courses;
