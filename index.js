"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
// Import body-parser
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
// Example route for handling POST request
app.post('/api/data', (req, res) => {
    console.log(req.body); // Assuming req.body is now parsed correctly
    res.send('Data received');
});
// Your other endpoints...
const PORT = process.env.PORT || 8080;
// Example of ping endpoint
app.get('/ping', (req, res) => {
    res.json({ success: true, message: 'Ping successful' });
});
// Example of submit endpoint
app.post('/submit', (req, res) => {
    const { name, email, phone, githubLink, stopwatchTime } = req.body;
    // Save submission to JSON file (db.json)
    const submission = { name, email, phone, githubLink, stopwatchTime };
    const dbPath = path_1.default.join(__dirname, 'db.json');
    let submissions = [];
    if (fs_1.default.existsSync(dbPath)) {
        const data = fs_1.default.readFileSync(dbPath, 'utf-8');
        submissions = JSON.parse(data);
    }
    submissions.push(submission);
    fs_1.default.writeFileSync(dbPath, JSON.stringify(submissions, null, 2));
    res.json({ success: true, message: 'Form submission saved successfully' });
});
// Example of read endpoint
app.get('/read', (req, res) => {
    const { index } = req.query;
    const dbPath = path_1.default.join(__dirname, 'db.json');
    if (!index || isNaN(parseInt(index))) {
        return res.status(400).json({ success: false, message: 'Invalid index parameter' });
    }
    let submissions = [];
    if (fs_1.default.existsSync(dbPath)) {
        const data = fs_1.default.readFileSync(dbPath, 'utf-8');
        submissions = JSON.parse(data);
    }
    const idx = parseInt(index);
    if (idx < 0 || idx >= submissions.length) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    res.json({ success: true, data: submissions[idx] });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:8080`);
});
