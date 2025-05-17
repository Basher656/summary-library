import styles from './HelpAndSettings.module.css';
import { useState } from 'react';

const faqs = [
    { question: 'How do I search for summaries?', answer: 'You can search by course name, keyword, or file type using the search bar.' },
    { question: 'How do I upload a new summary?', answer: 'Navigate to the Upload page, fill out the form, and click Submit.' },
    { question: 'What file formats are supported?', answer: 'We currently support PDF, DOCX, and TXT files (max 10MB).' },
    { question: 'How long does the review process take?', answer: 'Most summaries are reviewed within 1-3 business days.' },
    { question: 'Can I edit or delete my uploaded summaries?', answer: 'Yes, go to your dashboard and click on the summary to edit or remove it.' },
];

const HelpAndSettings = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Help & Settings</h1>

            <div className={styles.tabs}>
                <button className={`${styles.tab} ${styles.active}`}>Help Center</button>
                <button className={styles.tab}>Account Settings</button>
            </div>

            <div className={styles.faqBox}>
                <h2 className={styles.faqTitle}>Help Center</h2>
                <p className={styles.faqSubtitle}>Find answers to common questions about using the Summary Library platform</p>

                {faqs.map((faq, index) => (
                    <div key={index} className={styles.faqItem}>
                        <button className={styles.faqQuestion} onClick={() => toggleFAQ(index)}>
                            {faq.question}
                            <span className={styles.arrow}>{openIndex === index ? '▲' : '▼'}</span>
                        </button>
                        {openIndex === index && <div className={styles.faqAnswer}>{faq.answer}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HelpAndSettings;
