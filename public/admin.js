document.addEventListener('DOMContentLoaded', () => {
    if (!requireRole('admin')) return;

    const list = document.getElementById('contractsList');
    const searchBox = document.getElementById('searchBox');
    const adminMsg = document.getElementById('adminMsg');
    let contracts = [];

    document.getElementById('welcome').textContent = 'Logged in as ' + getSession().name;
    document.getElementById('logoutBtn').addEventListener('click', logout);

    function showMsg(text, ok) {
        adminMsg.style.color = ok ? 'green' : 'red';
        adminMsg.textContent = text;
    }

    async function loadContracts() {
        try {
            const response = await authFetch('/api/contracts');
            if (!response.ok) throw new Error('Server error');
            contracts = await response.json();
            renderStats();
            renderList();
        } catch (err) {
            list.innerHTML = '<p style="color:red;">Error loading contracts.</p>';
        }
    }

    function renderStats() {
        document.getElementById('statContracts').textContent = contracts.length;
        document.getElementById('statStaff').textContent =
            contracts.reduce((sum, c) => sum + c.staffCount, 0);
        document.getElementById('statPresent').textContent =
            contracts.reduce((sum, c) => sum + c.present, 0);
    }

    function renderList() {
        const term = searchBox.value.trim().toLowerCase();
        const shown = contracts.filter(c =>
            (c.clientName + ' ' + c.facilityType + ' ' + c.serviceType).toLowerCase().includes(term)
        );

        if (shown.length === 0) {
            list.innerHTML = '<p>No contracts match your search.</p>';
            return;
        }

        list.innerHTML = shown.map(c => {
            const pct = Math.round((c.present / c.staffCount) * 100);
            const recent = c.reports.slice(-3).reverse();
            const reportsHtml = recent.length === 0
                ? '<p class="muted">No daily reports yet.</p>'
                : '<ul class="report-list">' + recent.map(r =>
                    `<li><span class="report-date">${esc(r.date)}</span> ${esc(r.text)}</li>`
                ).join('') + '</ul>';

            return `
            <div class="deployment-card">
                <h3>${esc(c.clientName)} (${esc(c.facilityType)})</h3>
                <p><strong>Service:</strong> ${esc(c.serviceType)}</p>
                <p><strong>Staff:</strong> ${c.staffCount} workers for ${c.durationDays} days</p>
                <p><strong>Attendance:</strong> ${esc(c.attendanceRate)} (${pct}%)</p>
                <div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>

                <div class="action-row">
                    <label for="att-${c.id}">Staff present today</label>
                    <input type="number" id="att-${c.id}" min="0" max="${c.staffCount}" value="${c.present}">
                    <button type="button" class="btn-small" data-action="attendance" data-id="${c.id}">Update attendance</button>
                </div>

                <div class="action-row">
                    <label for="rep-${c.id}">Daily work report</label>
                    <textarea id="rep-${c.id}" rows="2" placeholder="e.g. Ward cleaning completed, gate security on duty"></textarea>
                    <button type="button" class="btn-small" data-action="report" data-id="${c.id}">Post report</button>
                </div>

                <h4>Recent daily reports</h4>
                ${reportsHtml}
            </div>`;
        }).join('');
    }

    async function saveAttendance(id) {
        const value = Number(document.getElementById('att-' + id).value);
        const response = await authFetch(`/api/contracts/${id}/attendance`, {
            method: 'PUT',
            body: JSON.stringify({ present: value })
        });
        const data = await response.json();
        if (response.ok) {
            showMsg('Attendance updated.', true);
            loadContracts();
        } else {
            showMsg(data.error || 'Could not update attendance.', false);
        }
    }

    async function postReport(id) {
        const text = document.getElementById('rep-' + id).value;
        const response = await authFetch(`/api/contracts/${id}/reports`, {
            method: 'POST',
            body: JSON.stringify({ text })
        });
        const data = await response.json();
        if (response.ok) {
            showMsg('Daily report posted.', true);
            loadContracts();
        } else {
            showMsg(data.error || 'Could not post report.', false);
        }
    }

    list.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const id = Number(btn.dataset.id);
        if (btn.dataset.action === 'attendance') saveAttendance(id);
        if (btn.dataset.action === 'report') postReport(id);
    });

    searchBox.addEventListener('input', renderList);

    loadContracts();
});