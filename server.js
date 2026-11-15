const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

let contracts = [
    {
        id: 1,
        clientName: "Apollo Hospital",
        facilityType: "Hospital",
        serviceType: "Both (Security & Housecleaning)",
        staffCount: 20,
        durationDays: 30,
        attendanceRate: "19/20 Present",
        dailyTaskStatus: "Sanitization & Entry Gate Security Cleared"
    },
    {
        id: 2,
        clientName: "Surya Mall",
        facilityType: "Shopping Mall",
        serviceType: "Security Personnel",
        staffCount: 15,
        durationDays: 60,
        attendanceRate: "15/15 Present",
        dailyTaskStatus: "Floor Patrolling & Parking Management Active"
 }
];
app.get('/api/contracts', (req, res) => {
    res.status(200).json(contracts);
});
app.post('/api/contracts', (req, res) => {
    const { clientName, facilityType, serviceType, staffCount, durationDays } = req.body;

    if (!clientName || !staffCount || !durationDays) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    const newContract = {
        id: contracts.length + 1,
        clientName,
        facilityType,
        serviceType,
        staffCount,
        durationDays,
        attendanceRate: `${staffCount}/${staffCount} Present`,
        dailyTaskStatus: "Initial Staff Deployed & Tasks Scheduled"
    };

    contracts.push(newContract);
    res.status(201).json({ message: "Requirement processed successfully", contract: newContract });
});


app.listen(PORT, () => {
    console.log(`Manpower Portal Server running on http://localhost:${PORT}`);
});