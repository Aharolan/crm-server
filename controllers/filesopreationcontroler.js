
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");


const parent_dir = path.resolve(__dirname, '..')
const FILES_DIR = path.join(parent_dir, "files")

function base64ToArrayBuffer(base64) {
    return Buffer.from(base64, 'base64');
}



router.get('/read/:fileName', async (req, res) => {
    const filename = req.params.fileName;
    const encoded = encodeURIComponent(filename);
    try {
        let download_path = await fetch(`http://localhost:8081/getfile/${encoded}`)
        res.status(200).send(download_path)

    } catch {
        res.status(500).send('Unable to create download path for: ' + filename)
    }
});



module.exports = router;
