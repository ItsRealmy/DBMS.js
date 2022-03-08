// Get data from DB

const { parse, singleItem } = require("../parser");

module.exports = (db, cache) => {
    return {
        // Get item by ID
        id: (id) => {
            // Return a promise
            return new Promise((resolve, reject) => {
                // Get from cache
                const cacheValue = cache.get(id);
                if (cacheValue) return resolve(parse(cacheValue));

                // Otherwise, get from store
                db.get(id, (err, value) => {
                    if (err) return reject(err);
                    // Returned parsed value
                    else return resolve(parse(value));
                });
            });
        },

        query: (query = {}) => {
            // Return a promise
            return new Promise((resolve, reject) => {
                let matchedItems = [];

                db.createReadStream()
                    .on("data", (data) => {
                        // Check all items in the query
                        for (let i in query) {
                            // Check if item matches
                            if (data.value.includes(singleItem(i, query[i]))) {
                                matchedItems.push(data.value);
                                // Add to cache
                                cache.set(data.key, data.value);
                            }
                        }
                    })
                    .on("end", () => {
                        let parsedMatchedItems = [];

                        for (let item of matchedItems) {
                            // Parse matched item
                            parsedMatchedItems.push(parse(item));
                        }

                        return resolve(parsedMatchedItems);
                    });
            });
        }
    }
}