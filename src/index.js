const fs = require("fs");
const path = require("path");
const rocks = require("level-rocksdb");
const LRU = require("lru-cache");

// Create DB folder
if (!fs.existsSync("./db")) fs.mkdirSync("./db");

module.exports = (dbName = "", dbPath = null) => {
    const db = rocks(path.join(dbPath || "./db", dbName));

    const cache = new LRU({
        max: 50000,
        maxSize: 10240,
        sizeCalculation: (body, id) => {
            const buffer = Buffer.from(body);
            return Buffer.byteLength(buffer);
        }
    });

    return {
        insert: require("./actions/insert")(db, cache),
        select: require("./actions/select")(db, cache)
    }
}