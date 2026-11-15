function getSession() {
    return {
        token: sessionStorage.getItem('token'),
        role: sessionStorage.getItem('role'),
        name: sessionStorage.getItem('name')
    };
}

function requireRole(role) {
    const s = getSession();
    if (!s.token || s.role !== role) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

async function authFetch(url, options = {}) {
    const s = getSession();
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + s.token,
            ...(options.headers || {})
        }
    });
    if (response.status === 401) {
        logout();
    }
    return response;
}

function esc(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}