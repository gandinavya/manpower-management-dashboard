document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    const msg = document.getElementById('signupMsg');

    const existing = getSession();
    if (existing.token) {
        window.location.href = existing.role === 'admin' ? 'admin.html' : 'index.html';
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            msg.style.color = 'red';
            msg.textContent = 'Passwords do not match.';
            return;
        }

        const body = {
            name: document.getElementById('orgName').value.trim(),
            username: document.getElementById('username').value.trim(),
            password
        };

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await response.json();

            if (!response.ok) {
                msg.style.color = 'red';
                msg.textContent = data.error || 'Sign up failed.';
                return;
            }

            msg.style.color = 'green';
            msg.textContent = data.message + ' Taking you to the login page...';
            form.reset();
            setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        } catch (err) {
            msg.style.color = 'red';
            msg.textContent = 'Unable to connect to server.';
        }
    });
});