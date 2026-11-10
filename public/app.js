document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('requirementForm');
    const statusMsg = document.getElementById('statusMsg');
    const deploymentsList = document.getElementById('deploymentsList');


    
    async function fetchDeployments() {
        try {
            const response = await fetch('/api/contracts');
            const contracts = await response.json();

            if (contracts.length === 0) {
                deploymentsList.innerHTML = '<p>No active deployments found.</p>';
                return;
            }

            deploymentsList.innerHTML = contracts.map(contract => `
                <div class="deployment-card">
                    <h3>${contract.clientName} (${contract.facilityType})</h3>
                    <p><strong>Service:</strong> ${contract.serviceType}</p>
                    <p><strong>Staff Deployed:</strong> ${contract.staffCount} workers</p>
                    <p><strong>Duration:</strong> ${contract.durationDays} Days</p>
                    <p><strong>Today's Attendance:</strong> ${contract.attendanceRate || '100%'}</p>
                    <span class="task-badge">Daily Task: ${contract.dailyTaskStatus || 'In Progress'}</span>
                </div>
            `).join('');
        } catch (err) {
            deploymentsList.innerHTML = '<p style="color:red;">Error loading active deployment logs.</p>';
        }
    }