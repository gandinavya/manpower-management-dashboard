const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public', { index: 'login.html' }));

const users = [
    { username: 'admin',  password: 'admin123',  role: 'admin',  name: 'Admin' },
    { username: 'apollo', password: 'apollo123', role: 'client', name: 'Apollo Hospital' },
    { username: 'surya',  password: 'surya123',  role: 'client', name: 'Surya Mall' }
];

const sessions = {};

const now = () => new Date().toLocaleString();

let nextId = 3;
const contracts = [
    {
        id: 1,
        owner: 'apollo',
        clientName: 'Apollo Hospital',
        facilityType: 'Hospital',
        serviceType: 'Both (Security & Housecleaning)',
        staffCount: 20,
        durationDays: 30,
        present: 19,
        reports: [{ date: now(), text: 'Sanitization & Entry Gate Security Cleared' }]
    },
    {
        id: 2,
        owner: 'surya',
        clientName: 'Surya Mall',
        facilityType: 'Shopping Mall',
        serviceType: 'Security Personnel',
        staffCount: 15,
        durationDays: 60,
        present: 15,
        reports: [{ date: now(), text: 'Floor Patrolling & Parking Management Active' }]
    }
];

function toView(c) {
    const latest = c.reports[c.reports.length - 1];
    return {
        ...c,
        attendanceRate: `${c.present}/${c.staffCount} Present`,
        dailyTaskStatus: latest ? latest.text : 'Initial Staff Deployed & Tasks Scheduled'
    };
}

function auth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.replace('Bearer ', '');
    const user = sessions[token];
    if (!user) return res.status(401).json({ error: 'Please log in.' });
    req.user = user;
    next();
}

function onlyRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ error: 'Access denied.' });
        }
        next();
    };
}

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Wrong username or password.' });
    }

    const token = crypto.randomBytes(16).toString('hex');
    sessions[token] = user;
    res.json({ token, role: user.role, name: user.name });
});

app.post('/api/signup', (req, res) => {
    const name = (req.body.name || '').trim();
    const username = (req.body.username || '').trim();
    const password = req.body.password || '';

    if (!name || name.length > 60) {
        return res.status(400).json({ error: 'Enter your organization name.' });
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        return res.status(400).json({ error: 'Username must be 3 to 20 letters, numbers or underscores.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        return res.status(409).json({ error: 'That username is already taken.' });
    }

    users.push({ username, password, role: 'client', name });
    res.status(201).json({ message: 'Account created. You can log in now.' });
});

app.get('/api/contracts', auth, (req, res) => {
    const list = req.user.role === 'admin'
        ? contracts
        : contracts.filter(c => c.owner === req.user.username);
    res.json(list.map(toView));
});

app.post('/api/contracts', auth, onlyRole('client'), (req, res) => {
    const { clientName, facilityType, serviceType, staffCount, durationDays } = req.body;

    if (!clientName || !Number.isInteger(staffCount) || staffCount < 1 ||
        !Number.isInteger(durationDays) || durationDays < 1) {
        return res.status(400).json({ error: 'Missing or invalid fields.' });
    }

    const newContract = {
        id: nextId++,
        owner: req.user.username,
        clientName,
        facilityType,
        serviceType,
        staffCount,
        durationDays,
        present: staffCount,
        reports: []
    };

    contracts.push(newContract);
    res.status(201).json({ message: 'Requirement processed successfully', contract: toView(newContract) });
});

app.put('/api/contracts/:id/attendance', auth, onlyRole('admin'), (req, res) => {
    const contract = contracts.find(c => c.id === Number(req.params.id));
    if (!contract) return res.status(404).json({ error: 'Contract not found.' });

    const present = req.body.present;
    if (!Number.isInteger(present) || present < 0 || present > contract.staffCount) {
        return res.status(400).json({ error: `Present must be between 0 and ${contract.staffCount}.` });
    }

    contract.present = present;
    res.json(toView(contract));
});

app.post('/api/contracts/:id/reports', auth, onlyRole('admin'), (req, res) => {
    const contract = contracts.find(c => c.id === Number(req.params.id));
    if (!contract) return res.status(404).json({ error: 'Contract not found.' });

    const text = (req.body.text || '').trim();
    if (!text) return res.status(400).json({ error: 'Report cannot be empty.' });

    contract.reports.push({ date: now(), text });
    res.status(201).json(toView(contract));
});

app.listen(PORT, () => {
    console.log(`Manpower Portal Server running on http://localhost:${PORT}`);
});