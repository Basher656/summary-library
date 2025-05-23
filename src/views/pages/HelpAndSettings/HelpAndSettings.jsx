import styles from './HelpAndSettings.module.css';
import { useState, useEffect } from 'react';
import { updateProfile, updatePassword, onAuthStateChanged, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../../../firebase';

const faqs = [
    { question: 'How do I search for summaries?', answer: 'You can search by course name, keyword, or file type using the search bar.' },
    { question: 'How do I upload a new summary?', answer: 'Navigate to the Upload page, fill out the form, and click Submit.' },
    { question: 'What file formats are supported?', answer: 'We currently support PDF, DOCX, and TXT files (max 10MB).' },
    { question: 'How long does the review process take?', answer: 'Most summaries are reviewed within 1-3 business days.' },
    { question: 'Can I edit or delete my uploaded summaries?', answer: 'Yes, go to your dashboard and click on the summary to edit or remove it.' },
];

const HelpAndSettings = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setName(currentUser?.displayName || '');
        });
        return () => unsubscribe();
    }, []);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleUpdate = async () => {
        try {
            if (user) {
                if (name && name !== user.displayName) {
                    await updateProfile(user, { displayName: name });
                }
                if (password) {
                    if (!currentPassword) {
                        setMessage('Please enter your current password to update.');
                        return;
                    }
                    const credential = EmailAuthProvider.credential(user.email, currentPassword);
                    await reauthenticateWithCredential(user, credential);
                    await updatePassword(user, password);
                }
                setMessage('Account updated successfully.');
                setTimeout(() => {
                    setMessage('');
                    setShowSettings(false);
                }, 1500);
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Help & Settings</h1>

            <div className={styles.tabs}>
                <button className={styles.tab} onClick={() => setShowSettings(true)}>Account Settings</button>
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

            {showSettings && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.settingsTitle}>Update Your Account</h2>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Display Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="currentPassword">Current Password</label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">New Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <button onClick={handleUpdate} className={styles.updateBtn}>Update</button>
                            <button onClick={() => setShowSettings(false)} className={styles.cancelBtn}>Cancel</button>
                        </div>
                        {message && <p className={styles.message}>{message}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HelpAndSettings;
