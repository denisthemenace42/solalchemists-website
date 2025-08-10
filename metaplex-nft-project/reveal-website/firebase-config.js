// Firebase configuration for SOLalchemists production
// This file initializes Firebase and sets up Twitter authentication.
// Values default to production credentials but can be overridden with
// environment variables when building the site.

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyCSEuWzq5mgmulc53LOXo1iUVuLxs3iAos",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "sol-alchemists.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "sol-alchemists",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "sol-alchemists.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "898278444",
  appId: process.env.FIREBASE_APP_ID || "1:898278444:web:28f2b6b20afc0852ab5d89",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-ME4BQE7K0L"
};

// Initialize Firebase if the SDK is available
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
}

// Sign in with Twitter using Firebase Authentication
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
      if (typeof showErrorMessage === 'function') {
        showErrorMessage('Twitter login failed: ' + error.message);
      }
    });
}

// Update the UI whenever authentication state changes
function updateUI(user) {
  if (user) {
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

    const socialRewards = document.getElementById('social-rewards');
    if (socialRewards) {
      socialRewards.style.display = 'block';
    }
  } else {
    const socialLoginContainer = document.querySelector('.social-login-container');
    const userProfile = document.querySelector('.user-profile');

    if (socialLoginContainer) socialLoginContainer.style.display = 'flex';
    if (userProfile) userProfile.style.display = 'none';

    const socialRewards = document.getElementById('social-rewards');
    if (socialRewards) {
      socialRewards.style.display = 'none';
    }
  }
}

// Listen for auth state changes and update the interface accordingly
if (typeof firebase !== 'undefined') {
  firebase.auth().onAuthStateChanged(updateUI);
}

// Expose the sign-in function globally for button handlers
window.signInWithTwitter = signInWithTwitter;
