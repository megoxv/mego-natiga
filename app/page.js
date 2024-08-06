'use client'

import { useState, useEffect } from "react";
import students from "@/data/students.json";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Create an indexed structure
const createIndex = (students) => {
    const index = {
        bySeatNumber: {},
        byName: {},
    };

    students.forEach(student => {
        index.bySeatNumber[student["رقم الجلوس"]] = student;
        index.byName[student["الاسم"]] = student;
    });

    return index;
};

const studentsIndex = createIndex(students);

export default function Home() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [noResults, setNoResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const [worker, setWorker] = useState(null);

    useEffect(() => {
        // Initialize web worker
        const newWorker = new Worker(new URL('@/lib/searchWorker.js', import.meta.url));
        setWorker(newWorker);

        return () => {
            if (worker) {
                worker.terminate();
            }
        };
    }, []);

    const handleSearch = async () => {
        if (!worker) return;

        setLoading(true);
        setError(null);
        setNoResults(false);

        worker.onmessage = function (e) {
            const searchResults = e.data;
            setResults(searchResults);
            setNoResults(searchResults.length === 0);
            setLoading(false);
        };

        worker.postMessage({ query, index: studentsIndex });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="max-w-3xl w-full px-4 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-foreground">ميجو نتيجة</h1>
                        <p className="mt-4 text-muted-foreground text-lg">ابحث بالاسم أو رقم الجلوس</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Input
                            type="text"
                            placeholder="بحث..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <Button
                            type="button"
                            onClick={handleSearch}
                            disabled={loading}
                            className="mx-3"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                    <span>انتظر من فضلك</span>
                                </div>
                            ) : (
                                <span>بحث</span>
                            )}
                        </Button>
                    </div>
                    {error && (
                        <div className="text-red-500 text-center mt-4">{error}</div>
                    )}
                    {noResults && !error && (
                        <div className="text-muted-foreground text-center mt-4">No results found</div>
                    )}
                    {results.length > 0 && (
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-medium leading-6 text-foreground">النتيجة</h2>
                            </CardHeader>
                            <CardContent className="border-t border-muted/20">
                                <dl className="divide-y divide-muted/20">
                                    {results.map((student) => (
                                        <div key={student["رقم الجلوس"]} className="bg-muted/10 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8">
                                            <dt className="text-sm font-medium text-muted-foreground">رقم الجلوس</dt>
                                            <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">{student["رقم الجلوس"]}</dd>
                                            <dt className="text-sm font-medium text-muted-foreground">الاسم</dt>
                                            <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">{student["الاسم"]}</dd>
                                            <dt className="text-sm font-medium text-muted-foreground">الدرجة</dt>
                                            <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">{student["الدرجة"]}</dd>
                                            <dt className="text-sm font-medium text-muted-foreground">المجموع</dt>
                                            <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">  {((student["الدرجة"] / 650) * 100).toFixed(2)}%</dd>
                                            <dt className="text-sm font-medium text-muted-foreground">الحالة</dt>
                                            <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">{student["student_case_desc"]}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
