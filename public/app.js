document.addEventListener('DOMContentLoaded', () => {
    if (!requireRole('client')) return;

    const form = document.getElementById('requirementForm');
    const statusMsg = document.getElementById('statusMsg');
    const deploymentsList = document.getElementById('deploymentsList');

    document.getElementById('welcome').textContent = 'Logged in as ' + getSession().name;
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('clientName').value = getSession().name;

    async function fetchDeployments() {
        try {
            const response = await authFetch('/api/contracts');
            if (!response.ok) throw new Error('Server error');
            const contracts = await response.json();

            if (contracts.length === 0) {
                deploymentsList.innerHTML = '<p>No active deployments yet. Submit a requirement above.</p>';
                return;
            }

            deploymentsList.innerHTML = contracts.map(contract => {
                const recent = contract.reports.slice(-3).reverse();
                const reportsHtml = recent.length === 0
                    ? '<p class="muted">No daily reports yet.</p>'
                    : '<ul class="report-list">' + recent.map(r =>
                        `<li><span class="report-date">${esc(r.date)}</span> ${esc(r.text)}</li>`
                    ).join('') + '</ul>';

                return `
                <div class="deployment-card">
                    <h3>${esc(contract.clientName)} (${esc(contract.facilityType)})</h3>
                    <p><strong>Service:</strong> ${esc(contract.serviceType)}</p>
                    <p><strong>Staff Deployed:</strong> ${contract.staffCount} workers</p>
                    <p><strong>Duration:</strong> ${contract.durationDays} Days</p>
                    <p><strong>Today's Attendance:</strong> ${esc(contract.attendanceRate)}</p>
                    <span class="task-badge">Daily Task: ${esc(contract.dailyTaskStatus)}</span>
                    <h4>Recent daily reports</h4>
                    ${reportsHtml}
                </div>`;
            }).join('');
        } catch (err) {
            deploymentsList.innerHTML = '<p style="color:red;">Error loading active deployment logs.</p>';
        }
    }

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
            const response = await authFetch('/api/contracts', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                statusMsg.style.color = 'green';
                statusMsg.textContent = 'Requirement submitted successfully!';
                form.reset();
                document.getElementById('clientName').value = getSession().name;
                fetchDeployments();
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