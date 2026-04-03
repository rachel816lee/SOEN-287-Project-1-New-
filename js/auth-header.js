// auth-header.js - Universal authentication header
// Add this script to any page that needs user info and logout button

async function loadUserInfo() {
    try {
        const response = await fetch('/api/session');
        const data = await response.json();
        
        if (data.loggedIn && data.user) {
            // Find or create user info container
            let userInfoDiv = document.getElementById('global-user-info');
            
            if (!userInfoDiv) {
                userInfoDiv = document.createElement('div');
                userInfoDiv.id = 'global-user-info';
                userInfoDiv.className = 'global-user-info';
                
                // Find header to append to
                const header = document.querySelector('header');
                if (header) {
                    header.style.position = 'relative';
                    header.appendChild(userInfoDiv);
                } else {
                    document.body.insertBefore(userInfoDiv, document.body.firstChild);
                }
            }
            
            // Update content
            userInfoDiv.innerHTML = `
                <span class="user-name">${escapeHtml(data.user.username)}</span>
                <a href="#" id="global-logout-btn" class="logout-btn">Logout</a>
            `;
            
            // Add logout event
            const logoutBtn = document.getElementById('global-logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    await fetch('/api/logout', { method: 'POST' });
                    window.location.href = '../../index.html';
                });
            }
        }
    } catch (error) {
        console.error('Error loading user info:', error);
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Auto-run when page loads
document.addEventListener('DOMContentLoaded', loadUserInfo);