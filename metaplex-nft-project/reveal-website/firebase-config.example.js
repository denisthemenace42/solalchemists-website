// Example Firebase Configuration
// Copy this file to firebase-config.js and add your actual keys

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Social login functions
function signInWithTwitter() {
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
        document.querySelector('.social-login-container').style.display = 'none';
        document.querySelector('.user-profile').style.display = 'flex';
        document.querySelector('.user-name').textContent = user.displayName || 'Alchemist';
        document.querySelector('.user-avatar').src = user.photoURL || 'images/default-avatar.png';
        
        // Show social rewards system
        const socialRewards = document.getElementById('social-rewards');
        if (socialRewards) {
            socialRewards.style.display = 'block';
        }
    } else {
        // User is signed out
        document.querySelector('.social-login-container').style.display = 'flex';
        document.querySelector('.user-profile').style.display = 'none';
        
        // Hide social rewards system
        const socialRewards = document.getElementById('social-rewards');
        if (socialRewards) {
            socialRewards.style.display = 'none';
        }
    }
}

// Listen for auth state changes
firebase.auth().onAuthStateChanged(updateUI);
