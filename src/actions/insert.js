// Insert data into DB

const { stringify } = require("../parser");
const { generate } = require("randomstring");

module.exports = (db, cache) => {
    return (query = {
        id: "",
        body: {}
    }) => {
        // ID specified, or random string as ID
        const insertableID = query.id || generate(16);

        // Return a promise
        return new Promise((resolve, reject) => {
            // Stringify body
            const stringifiedBody = stringify(query.body);

            // Put item in DB
            db.put(insertableID, stringifiedBody, (err) => {
                if (err) return reject(err);
                else {
                    // Add to cache
                    cache.set(insertableID, stringifiedBody);

                    return resolve({
                        success: true,
                        id: insertableID
                    });
                }
            });
        });
    }
}