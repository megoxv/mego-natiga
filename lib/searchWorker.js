self.onmessage = function (e) {
    const { query, index } = e.data;

    const results = [];
    if (index.bySeatNumber[query]) {
        results.push(index.bySeatNumber[query]);
    } else {
        for (const name in index.byName) {
            if (name.includes(query)) {
                results.push(index.byName[name]);
            }
        }
    }

    self.postMessage(results);
};
