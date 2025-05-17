import styles from "./Admin.module.css";
import { FileText, Check, X, Clock } from "lucide-react";

const summaries = [
    {
        title: "Machine Learning Fundamentals",
        date: "2023-04-10",
        course: "Computer Science",
        uploader: "alex.johnson@example.com",
        status: "Pending",
    },
    {
        title: "Introduction to Economics",
        date: "2023-04-09",
        course: "Economics",
        uploader: "sarah.brown@example.com",
        status: "Approved",
    },
    {
        title: "Web Development Frameworks",
        date: "2023-04-08",
        course: "Web Development",
        uploader: "mark.wilson@example.com",
        status: "Rejected",
    },
    {
        title: "Psychology of Decision Making",
        date: "2023-04-07",
        course: "Psychology",
        uploader: "jennifer.lee@example.com",
        status: "Pending",
    },
    {
        title: "Advanced Calculus",
        date: "2023-04-06",
        course: "Mathematics",
        uploader: "david.smith@example.com",
        status: "Pending",
    },
];

const AdminPanel = () => {
    return (
        <div className={styles.adminContainer}>
            <aside className={styles.sidebar}>
                <h2>Admin Panel</h2>
                <nav>
                    <ul>
                        <li>Overview</li>
                        <li>Summaries</li>
                        <li>Users</li>
                        <li>Analytics</li>
                        <li>Settings</li>
                        <li>Help</li>
                    </ul>
                </nav>
            </aside>

            <main className={styles.mainContent}>
                <h2 className={styles.pageTitle}>Summary Management</h2>
                <p className={styles.pageSubtitle}>
                    Review, approve, or reject summary submissions
                </p>

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
                        {summaries.map((summary, index) => (
                            <tr key={index}>
                                <td className={styles.titleCell}>
                                    <FileText size={16} className={styles.icon} />
                                    {summary.title}
                                </td>
                                <td>{summary.date}</td>
                                <td>{summary.course}</td>
                                <td>{summary.uploader}</td>
                                <td>
                                    <span
                                        className={`${styles.status} ${styles[summary.status.toLowerCase()]
                                            }`}
                                    >
                                        {summary.status}
                                    </span>
                                </td>
                                <td className={styles.actions}>
                                    <Check className={styles.actionIcon} />
                                    <X className={styles.actionIcon} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
};

export default AdminPanel;
