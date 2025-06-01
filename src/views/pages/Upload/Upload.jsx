import { useState } from "react";
import styles from "./Upload.module.css";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../../firebase";

const Upload = () => {
    const [title, setTitle] = useState("");
    const [course, setCourse] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !course || !description) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            const currentUser = auth.currentUser;

            await addDoc(collection(db, "summaries"), {
                title,
                course,
                description,
                uploader: currentUser?.email || "unknown",
                createdAt: serverTimestamp()
            });

            setTitle("");
            setCourse("");
            setDescription("");
            setError("");
            setSuccess(true);

            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError("Upload failed: " + err.message);
        }
    };

    return (
        <div className={styles.uploadPage}>
            <h1 className={styles.title}>Write a New Summary</h1>
            <form className={styles.uploadForm} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="course">Course</label>
                    <select
                        id="course"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        required
                    >
                        <option value="">Select a course</option>
                        <option value="cs">Computer Science</option>
                        <option value="eco">Economics</option>
                        <option value="web">Web Development</option>
                        <option value="psy">Psychology</option>
                    </select>

                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description">Summary Text</label>
                    <textarea
                        id="description"
                        rows={8}
                        placeholder="Write your summary here..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>Summary saved!</p>}

                <button type="submit" className={styles.submitBtn}>Submit Summary</button>
            </form>
        </div>
    );
};

export default Upload;
