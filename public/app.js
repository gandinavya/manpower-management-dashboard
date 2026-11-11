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

    // Handle new requirement form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            clientName: document.getElementById('clientName').value,
            facilityType: document.getElementById('facilityType').value,
            serviceType: document.getElementById('serviceType').value,
            staffCount: Number(document.getElementById('staffCount').value),
            durationDays: Number(document.getElementById('durationDays').value)
        };

        try {
            const response = await fetch('/api/contracts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                statusMsg.style.color = 'green';
                statusMsg.textContent = 'Requirement submitted successfully! Staff allocated.';
                form.reset();
                fetchDeployments(); // Refresh deployment cards
            } else {
                statusMsg.style.color = 'red';
                statusMsg.textContent = result.error || 'Failed to submit requirement.';
            }
        } catch (err) {
            statusMsg.style.color = 'red';
            statusMsg.textContent = 'Unable to connect to server.';
        }
    });


    fetchDeployments();
    });