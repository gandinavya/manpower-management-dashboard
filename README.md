# Manpower Management Dashboard

A web application for **Mayfair Security & Cleaning Solutions**, a manpower provider for hospitals and shopping malls. Clients submit staff requirements, and the Admin manages attendance and posts daily work reports.

**GitHub:** https://github.com/gandinavya/manpower-management-dashboard

## Team Members

| Name | Roll No |
|------|---------|
| Navya | B25CS018 |
| Reshmitha | B25CS040 |
| Snigdha | B25CS052 |

## Features

- Login with two roles: **Admin** and **Client**
- **Sign up page** where a new client can create an account
- **Client:** submit a manpower requirement (facility type, service, staff count, duration), view own deployments, attendance and daily reports
- **Admin:** view all contracts, update daily attendance, post daily work reports
- Dashboard counters (active contracts, staff deployed, present today)
- Search contracts by client, facility or service
- Attendance progress bar for each contract
- About section on the client page with company details and emergency contact

## Technologies Used

HTML, CSS, JavaScript (front end), Node.js and Express (back end). Data is kept in memory, so no database setup is needed.

## Folder Structure

```
manpower-dashboard/
├── server.js
├── package.json
├── README.md
└── public/
    ├── login.html, login.js
    ├── signup.html, signup.js
    ├── auth.js
    ├── index.html, app.js      (Client page)
    ├── admin.html, admin.js    (Admin page)
    └── styles.css
```

## How to Run

1. Install **Node.js** (version 18 or later) from https://nodejs.org
2. Open a terminal in the project folder (the one containing `server.js`)
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   node server.js
   ```
5. Open **http://localhost:3000** in your browser (do not open the HTML files by double-clicking)

To stop the server, press `Ctrl + C` in the terminal.

## Demo Accounts

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Client | apollo | apollo123 |
| Client | surya | surya123 |

## How to Use

1. Log in as **apollo** and submit a new requirement using the form. It appears under Active Deployments.
2. Log out and log in as **admin**. Update attendance and post a daily report for a contract.
3. Log in again as **apollo** to see the updated attendance and the new report.
4. To try a new client, click **Sign up here** on the login page, create an account, then log in with it.
