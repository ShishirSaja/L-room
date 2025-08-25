const pdf = require('pdf-parse');

async function processPdf(buffer) {
    const data = await pdf(buffer);
    return data.text;
}

module.exports = { processPdf };