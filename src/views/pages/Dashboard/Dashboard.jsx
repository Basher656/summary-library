import styles from './Dashboard.module.css';

const Dashboard = () => {
    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.title}>Dashboard</h1>

            <div className={styles.cardsRow}>
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Downloads</div>
                    <div className={styles.cardValue}>1,234</div>
                    <div className={styles.cardChange}>↑12% This month</div>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Uploads</div>
                    <div className={styles.cardValue}>45</div>
                    <div className={styles.cardChange}>↑8% This month</div>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Users</div>
                    <div className={styles.cardValue}>726</div>
                    <div className={styles.cardChange}>↑5% Total active users</div>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Summaries</div>
                    <div className={styles.cardValue}>312</div>
                    <div className={styles.cardChange}>↑15% Total approved summaries</div>
                </div>
            </div>

            <h2 className={styles.sectionTitle}>Analytics</h2>
            <div className={styles.analyticsSection}>
                <div className={styles.chartBox}>
                    <h3>Monthly Activity</h3>
                    <img
                        src="https://i.imgur.com/xX1fG3M.png"
                        alt="Monthly Activity Graph"
                        className={styles.graphImage}
                    />
                </div>
                <div className={styles.chartBox}>
                    <h3>Summary Categories</h3>
                    <img
                        src="https://i.imgur.com/MlSXYal.png"
                        alt="Summary Categories Bar"
                        className={styles.graphImage}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
