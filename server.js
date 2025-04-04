const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/screenshot", async (req, res) => {
    const { url } = req.body;

    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });
        const screenshot = await page.screenshot({ fullPage: true, encoding: "base64" });
        await browser.close();

        res.json({ screenshot });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to capture screenshot" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));