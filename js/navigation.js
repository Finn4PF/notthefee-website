document.addEventListener('DOMContentLoaded', function() {
    // Create navigation element
    const nav = document.createElement('nav');
    nav.className = 'site-navigation';
    
    // Get current page path
    const currentPath = window.location.pathname;
    
    // Define navigation items
    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/calendar', label: 'Calendar' },
        { path: '/auth', label: 'Staff Login' }
    ];
    
    // Create navigation HTML
    const navHTML = `
        <div class="nav-logo">NotTheFee</div>
        <ul class="nav-links">
            ${navItems.map(item => `
                <li class="${currentPath === item.path || 
                           (currentPath === '/index.html' && item.path === '/') ? 
                           'active' : ''}">
                    <a href="${item.path}">${item.label}</a>
                </li>
            `).join('')}
        </ul>
    `;
    
    nav.innerHTML = navHTML;
    
    // Add navigation to the page
    const body = document.body;
    body.insertBefore(nav, body.firstChild);
    
    // Add navigation styles
    const style = document.createElement('style');
    style.textContent = `
        .site-navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background-color: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .nav-logo {
            font-size: 24px;
            font-weight: bold;
            background: linear-gradient(90deg, #ff7e00, #83c341);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .nav-links {
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
            gap: 20px;
        }
        
        .nav-links a {
            color: #f5f5f7;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
        }
        
        .nav-links a:hover {
            color: #83c341;
        }
        
        .nav-links li.active a {
            color: #ff7e00;
        }
        
        @media (max-width: 768px) {
            .site-navigation {
                flex-direction: column;
                gap: 10px;
            }
        }
    `;
    
    document.head.appendChild(style);
}); 