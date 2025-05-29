import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";

export default function SummaryCategoriesChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchSummaries = async () => {
            const snap = await getDocs(collection(db, "summaries"));
            const summaries = snap.docs.map(doc => doc.data());

            const byCourse = summaries.reduce((acc, s) => {
                const course = s.course || "Unknown";
                acc[course] = (acc[course] || 0) + 1;
                return acc;
            }, {});

            const result = Object.entries(byCourse).map(([category, count]) => ({ category, count }));
            setData(result);
        };
        fetchSummaries();
    }, []);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <XAxis dataKey="category" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    );
}
