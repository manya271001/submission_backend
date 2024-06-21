import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
 // Import body-parser
 import path from 'path';
import fs from 'fs';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Example route for handling POST request
app.post('/api/data', (req: Request, res: Response) => {
  console.log(req.body); // Assuming req.body is now parsed correctly
  res.send('Data received');
});

// Your other endpoints...

const serverName = 'MyServer';

const PORT = process.env.PORT || 8080;

// Example of ping endpoint
app.get('/ping', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Ping successful' });
});

// Example of submit endpoint
app.post('/submit', (req: Request, res: Response) => {
  const { name, email, phone, githubLink, stopwatchTime } = req.body;

  // Save submission to JSON file (db.json)
  const submission = { name, email, phone, githubLink, stopwatchTime };
  const dbPath = path.join(__dirname, 'db.json');
  let submissions: any[] = [];

  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath, 'utf-8');
    submissions = JSON.parse(data);
  }

  submissions.push(submission);
  fs.writeFileSync(dbPath, JSON.stringify(submissions, null, 2));

  res.json({ success: true, message: 'Form submission saved successfully' });
});

// Example of read endpoint
app.get('/read', (req: Request, res: Response) => {
  const { index } = req.query;
  const dbPath = path.join(__dirname, 'db.json');

  if (!index || isNaN(parseInt(index as string))) {
    return res.status(400).json({ success: false, message: 'Invalid index parameter' });
  }

  let submissions: any[] = [];

  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath, 'utf-8');
    submissions = JSON.parse(data);
  }

  const idx = parseInt(index as string);
  if (idx < 0 || idx >= submissions.length) {
    return res.status(404).json({ success: false, message: 'Submission not found' });
  }

  res.json({ success: true, data: submissions[idx] });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:8080`);
});
