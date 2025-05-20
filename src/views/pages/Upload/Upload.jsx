import { useState } from "react";
import styles from "./Upload.module.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../../../firebase"; 

const Upload = () => {
    const [title, setTitle] = useState("");
    const [course, setCourse] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!title || !course || !file) {
            setError("Please fill in all required fields and choose a file.");
            return;
        }

        try {
            const fileRef = ref(storage, `summaries/${file.name}`);
            await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(fileRef);

            await addDoc(collection(db, "summaries"), {
                title,
                course,
                description,
                url: downloadURL,
                format: file.name.split(".").pop().toUpperCase(),
                createdAt: serverTimestamp()
            });

            setTitle("");
            setCourse("");
            setDescription("");
            setFile(null);
            setError("");
            setSuccess(true);

            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError("Upload failed: " + err.message);
        }
    };

    return (
        <div className={styles.uploadPage}>
            <h1 className={styles.title}>Upload a New Summary</h1>
            <p className={styles.subtitle}>
                Share your knowledge by uploading a document summary to help others learn
            </p>

            <form className={styles.uploadForm} onSubmit={handleUpload}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        placeholder="Enter a descriptive title for your summary"
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
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        placeholder="Provide a brief overview of what this summary covers"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className={styles.formGroup}>
                    <label>Upload File</label>
                    <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                    />
                    <small>Supports PDF, DOCX, or TXT (max 10MB)</small>
                </div>

                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>Upload successful!</p>}

                <button type="submit" className={styles.submitBtn}>
                    Upload
                </button>
            </form>
        </div>
    );
};

export default Upload;
