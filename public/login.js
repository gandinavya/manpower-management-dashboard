document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const msg = document.getElementById('loginMsg');

    const existing = getSession();
    if (existing.token) {
        window.location.href = existing.role === 'admin' ? 'admin.html' : 'index.html';
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const body = {
            username: document.getElementById('username').value.trim(),
            password: document.getElementById('password').value
        };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await response.json();

            if (!response.ok) {
                msg.style.color = 'red';
                msg.textContent = data.error || 'Login failed.';
                return;
            }

            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('role', data.role);
            sessionStorage.setItem('name', data.name);

            window.location.href = data.role === 'admin' ? 'admin.html' : 'index.html';
        } catch (err) {
            msg.style.color = 'red';
            msg.textContent = 'Unable to connect to server.';
        }
    });
});