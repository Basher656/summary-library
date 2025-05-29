import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function MonthlyActivityChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchSummaries = async () => {
            const snap = await getDocs(collection(db, "summaries"));
            const summaries = snap.docs.map(doc => doc.data());

            const monthly = summaries.reduce((acc, s) => {
                const date = s.createdAt?.toDate?.();
                if (date) {
                    const m = format(date, "MMM");
                    acc[m] = (acc[m] || 0) + 1;
                }
                return acc;
            }, {});

            const result = Object.entries(monthly).map(([month, uploads]) => ({ month, uploads }));
            setData(result);
        };
        fetchSummaries();
    }, []);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="uploads" stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
    );
}
