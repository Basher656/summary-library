import styles from "./Courses.module.css";
import { Download } from "lucide-react";

const summaries = [
    {
        id: 1,
        title: "Algorithms and Data Structures",
        format: "PDF",
        description: "Comprehensive overview of common algorithms and data structures with implementation examples.",
        date: "April 10, 2023"
    },
    {
        id: 2,
        title: "Introduction to Programming",
        format: "DOCX",
        description: "Basic programming concepts, syntax, and control structures using Python examples.",
        date: "March 25, 2023"
    },
    {
        id: 3,
        title: "Computer Architecture",
        format: "PDF",
        description: "Overview of computer hardware components, memory systems, and processor architecture.",
        date: "February 18, 2023"
    }
];

const Courses = () => {
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

                {summaries.map((summary) => (
                    <div key={summary.id} className={styles.card}>
                        <div className={styles.text}>
                            <h3>
                                {summary.title}{" "}
                                <span className={styles.badge}>{summary.format}</span>
                            </h3>
                            <p>{summary.description}</p>
                            <small>Added: {summary.date}</small>
                        </div>
                        <button className={styles.downloadBtn}>
                            <Download size={16} /> Download
                        </button>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Courses;
