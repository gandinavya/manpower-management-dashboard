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
