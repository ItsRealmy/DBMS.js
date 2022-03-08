module.exports = {
    stringify: (body = {}) => {
        let itemArr = [];

        for (let key in body) {
            // Replace all "&" with "_as", "=" with "_eq", and "_" with "_us"
            const escapedKey = key.replaceAll("&", "_as").replaceAll("=", "_eq").replaceAll("_", "_us");
            const escapedValue = body[key].replaceAll("&", "_as").replaceAll("=", "_eq").replaceAll("_", "_us");

            itemArr.push(`${escapedKey}=${escapedValue}`);
        }

        return itemArr.join("&");
    },

    parse: (string = "") => {
        const body = {};
        // Split full body into items
        const splitString = string.split("&");

        for (let i in splitString) {
            // Split item into key/value
            const splitItem = splitString[i].split("=");

            // Parse key and value
            const parsedKey = splitItem[0].replaceAll("_as", "&").replaceAll("_eq", "=").replaceAll("_us", "_");
            const parsedValue = splitItem[1].replaceAll("_as", "&").replaceAll("_eq", "=").replaceAll("_us", "_");

            // Add to body object
            body[parsedKey] = parsedValue;
        }

        return body;
    },

    singleItem: (key = "", value = "") => {
        const escapedKey = key.replaceAll("&", "_as").replaceAll("=", "_eq").replaceAll("_", "_us");
        const escapedValue = value.replaceAll("&", "_as").replaceAll("=", "_eq").replaceAll("_", "_us");

        return `${escapedKey}=${escapedValue}`;
    }
}