import styles from "./Home.module.css";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className={styles.homePage}>
            <section className={styles.heroSection}>
                <div className={styles.heroContainer}>
                    <div className={styles.heroText}>
                        <h2 className={styles.heroTitle}>
                            Summarize <br />
                            documents <span>with ease</span>
                        </h2>
                        <p className={styles.heroSubtitle}>
                            Access concise summaries of documents, research papers, books, and more.
                            Save time and gain insights with our comprehensive summary library.
                        </p>
                        <div className={styles.heroButtons}>
                            <Link to="/courses" className={styles.btnPrimary}>
                                Advanced Search
                            </Link>
                            <Link to="/upload" className={styles.btnSecondary}>
                                New Summary
                            </Link>
                        </div>
                    </div>

                    <div className={styles.heroImage}>
                        <img
                            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1350&q=80"
                            alt="hero"
                        />
                    </div>
                </div>
            </section>

            <section className={styles.summariesSection}>
                <div className={styles.summariesHeader}>
                    <h3 className={styles.summariesTitle}>Popular Summaries</h3>
                    <p className={styles.summariesSubtitle}>
                        Discover our most downloaded document summaries
                    </p>
                </div>

                <div className={styles.summariesGrid}>
                    {[
                        {
                            title: "Computer Science",
                            img: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=500&q=60",
                        },
                        {
                            title: "Economics",
                            img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=60",
                        },
                        {
                            title: "Web Development",
                            img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=500&q=60",
                        },
                        {
                            title: "Psychology",
                            img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=500&q=60",
                        },
                    ].map((item) => (
                        <div key={item.title} className={styles.summaryCard}>
                            <img src={item.img} alt={item.title} />
                            <div className={styles.summaryContent}>
                                <h4 className={styles.summaryTitle}>{item.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
