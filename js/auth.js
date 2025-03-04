// auth.js - Authentication utilities for NotTheFee

import { firebaseConfig } from './config.js';

// Initialize Firebase if not already initialized
if (!window.firebase || !window.firebase.apps.length) {
    // Load Firebase scripts dynamically if not already loaded
    const loadFirebaseScripts = async () => {
        if (!window.firebase) {
            // Load Firebase App
            const appScript = document.createElement('script');
            appScript.src = 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js';
            document.head.appendChild(appScript);
            
            // Wait for app script to load
            await new Promise(resolve => appScript.onload = resolve);
            
            // Load Firebase Auth
            const authScript = document.createElement('script');
            authScript.src = 'https://www.gstatic.com/firebasejs/9.6.0/firebase-auth-compat.js';
            document.head.appendChild(authScript);
            
            // Wait for auth script to load
            await new Promise(resolve => authScript.onload = resolve);
        }
        
        // Initialize Firebase
        if (!window.firebase.apps.length) {
            window.firebase.initializeApp(firebaseConfig);
        }
    };
    
    loadFirebaseScripts();
} else {
    // Firebase is already loaded, just initialize if needed
    if (!window.firebase.apps.length) {
        window.firebase.initializeApp(firebaseConfig);
    }
}

// Check if user is authenticated
export const isAuthenticated = () => {
    // First check localStorage for user data
    const userData = localStorage.getItem('user');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            return user && user.email && user.email.endsWith('@4pillarfunding.com');
        } catch (e) {
            console.error('Error parsing user data:', e);
            return false;
        }
    }
    return false;
};

// Get current user data
export const getCurrentUser = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
        try {
            return JSON.parse(userData);
        } catch (e) {
            console.error('Error parsing user data:', e);
            return null;
        }
    }
    return null;
};

// Sign out the current user
export const signOut = () => {
    localStorage.removeItem('user');
    if (window.firebase && window.firebase.auth) {
        window.firebase.auth().signOut()
            .then(() => {
                console.log('User signed out');
                window.location.href = '/auth.html';
            })
            .catch(error => {
                console.error('Error signing out:', error);
            });
    } else {
        window.location.href = '/auth.html';
    }
};

// Protect a page - redirect to auth if not authenticated
export const protectPage = () => {
    if (!isAuthenticated()) {
        console.log('User not authenticated, redirecting to login');
        window.location.href = '/auth.html';
        return false;
    }
    return true;
};

// Add user info to the page (typically in the navigation)
export const addUserInfo = () => {
    const user = getCurrentUser();
    if (user) {
        // Create user info element if it doesn't exist
        let userInfoEl = document.getElementById('user-info');
        if (!userInfoEl) {
            userInfoEl = document.createElement('div');
            userInfoEl.id = 'user-info';
            userInfoEl.className = 'user-info';
            
            // Add to navigation if it exists
            const nav = document.querySelector('.site-navigation');
            if (nav) {
                nav.appendChild(userInfoEl);
            } else {
                document.body.appendChild(userInfoEl);
            }
        }
        
        // Update user info content
        userInfoEl.innerHTML = `
            <div class="user-profile">
                ${user.photoURL ? `<img src="${user.photoURL}" alt="${user.displayName}" class="user-avatar">` : ''}
                <span class="user-name">${user.displayName}</span>
            </div>
            <button id="sign-out-btn" class="sign-out-btn">Sign Out</button>
        `;
        
        // Add sign out event listener
        document.getElementById('sign-out-btn').addEventListener('click', signOut);
        
        // Add styles for user info
        if (!document.getElementById('user-info-styles')) {
            const style = document.createElement('style');
            style.id = 'user-info-styles';
            style.textContent = `
                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .user-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    object-fit: cover;
                }
                
                .user-name {
                    color: var(--text, #f5f5f7);
                    font-weight: 500;
                }
                
                .sign-out-btn {
                    background: linear-gradient(90deg, #ff7e00, #83c341);
                    color: #000;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                
                .sign-out-btn:hover {
                    transform: scale(1.05);
                }
                
                @media (max-width: 768px) {
                    .user-info {
                        margin-top: 10px;
                        width: 100%;
                        justify-content: center;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}; 