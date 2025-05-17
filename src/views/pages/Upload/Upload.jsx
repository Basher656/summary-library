import styles from "./Upload.module.css";

const Upload = () => {
    return (
        <div className={styles.uploadPage}>
            <h1 className={styles.title}>Upload a New Summary</h1>
            <p className={styles.subtitle}>
                Share your knowledge by uploading a document summary to help others learn
            </p>

            <form className={styles.uploadForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        placeholder="Enter a descriptive title for your summary"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="course">Course</label>
                    <select id="course">
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
                    ></textarea>
                </div>

                <div className={styles.formGroup}>
                    <label>Upload File</label>
                    <div className={styles.uploadBox}>
                        <span className={styles.uploadIcon}>📤</span>
                        <p>Drag & drop your file here or click to browse</p>
                        <small>Supports PDF, DOCX, or TXT (max 10MB)</small>
                    </div>
                </div>

                <button type="submit" className={styles.submitBtn}>
                    Upload
                </button>
            </form>
        </div>
    );
};

export default Upload;
