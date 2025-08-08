// Example Firebase Configuration - USE ENVIRONMENT VARIABLES
// Copy this file to firebase-config.js and add your actual keys
// NEVER commit the real firebase-config.js file to version control

// Get configuration from environment variables (recommended)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: process.env.FIREBASE_APP_ID || "YOUR_APP_ID",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
}

// Social login functions
function signInWithTwitter() {
    if (typeof firebase === 'undefined') {
        console.error('Firebase not loaded');
        return;
    }
    
    const provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            console.log('Twitter login successful');
            updateUI(result.user);
        })
        .catch((error) => {
            console.error('Twitter login error:', error);
            showErrorMessage('Twitter login failed: ' + error.message);
        });
}

// Update UI based on authentication state
function updateUI(user) {
    if (user) {
        // User is signed in
        const socialLoginContainer = document.querySelector('.social-login-container');
        const userProfile = document.querySelector('.user-profile');
        
        if (socialLoginContainer) socialLoginContainer.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'flex';
            const userName = userProfile.querySelector('#userName');
            const userAvatar = userProfile.querySelector('#userAvatar');
            if (userName) userName.textContent = user.displayName || 'Alchemist';
            if (userAvatar) userAvatar.src = user.photoURL || 'images/default-avatar.png';
        }
        
        // Show social rewards system
        const socialRewards = document.getElementById('social-rewards');
        if (socialRewards) {
            socialRewards.style.display = 'block';
        }
    } else {
        // User is signed out
        const socialLoginContainer = document.querySelector('.social-login-container');
        const userProfile = document.querySelector('.user-profile');
        
        if (socialLoginContainer) socialLoginContainer.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
        
        // Hide social rewards system
        const socialRewards = document.getElementById('social-rewards');
        if (socialRewards) {
            socialRewards.style.display = 'none';
        }
    }
}

// Listen for auth state changes
if (typeof firebase !== 'undefined') {
    firebase.auth().onAuthStateChanged(updateUI);
}
