export function searchStudents(query, data) {
    if (!query) return [];
    const lowercasedQuery = query.toLowerCase();
    return data.filter(student =>
        student["رقم الجلوس"].toString().includes(lowercasedQuery) ||
        student["الاسم"].toLowerCase().includes(lowercasedQuery)
    );
}
