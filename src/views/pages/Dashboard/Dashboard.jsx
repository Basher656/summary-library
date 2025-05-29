import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import MonthlyActivityChart from "../../components/MonthlyActivityChart";
import SummaryCategoriesChart from "../../components/SummaryCategoriesChart";

import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        downloads: 0,
        uploads: 0,
        users: 0,
        summaries: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            const summariesSnap = await getDocs(collection(db, "summaries"));
            const usersSnap = await getDocs(collection(db, "users"));
            const downloadsSnap = await getDocs(collection(db, "downloads"));

            const summaries = summariesSnap.docs.map(doc => doc.data());
            const thisMonth = new Date().getMonth();

            const uploadsThisMonth = summaries.filter(s => {
                const createdAt = s.createdAt?.toDate?.();
                return createdAt?.getMonth() === thisMonth;
            }).length;

            setStats({
                downloads: downloadsSnap.size,
                uploads: uploadsThisMonth,
                users: usersSnap.size,
                summaries: summaries.length
            });
        };

        fetchStats();
    }, []);

    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.title}>Dashboard</h1>

            <div className={styles.cardsRow}>
                {["Downloads", "Uploads", "Users", "Summaries"].map((label, i) => (
                    <div key={label} className={styles.card}>
                        <div className={styles.cardTitle}>{label}</div>
                        <div className={styles.cardValue}>
                            {stats[label.toLowerCase()]}
                        </div>
                    </div>
                ))}
            </div>

            <h2 className={styles.sectionTitle}>Analytics</h2>
            <div className={styles.analyticsSection}>
                <div className={styles.chartBox}>
                    <h3>Monthly Activity</h3>
                    <MonthlyActivityChart />
                </div>
                <div className={styles.chartBox}>
                    <h3>Summary Categories</h3>
                    <SummaryCategoriesChart />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
