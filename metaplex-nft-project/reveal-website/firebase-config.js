// Firebase configuration for SOLalchemists
// Your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCSEuWzq5mgmulc53LOXo1iUVuLxs3iAos",
  authDomain: "sol-alchemists.firebaseapp.com",
  projectId: "sol-alchemists",
  storageBucket: "sol-alchemists.firebasestorage.app",
  messagingSenderId: "898278444",
  appId: "1:898278444:web:28f2b6b20afc0852ab5d89",
  measurementId: "G-ME4BQE7K0L"
};

// Initialize Firebase (using compat version for better browser support)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Social Login Functions
function signInWithTwitter() {
    console.log('🔮 Attempting Twitter login...');
    
    // Test if Firebase Auth is properly initialized
    if (!firebase.auth) {
        showErrorMessage('Firebase Auth not initialized. Please check Firebase configuration.');
        console.error('❌ Firebase Auth not initialized');
        return;
    }
    
    // Test if Twitter provider is available
    if (!firebase.auth.TwitterAuthProvider) {
        showErrorMessage('Twitter provider not available. Please check Firebase configuration.');
        console.error('❌ Twitter provider not available');
        return;
    }
    
    const provider = new firebase.auth.TwitterAuthProvider();
    
    // Set custom parameters for better UX
    provider.setCustomParameters({
        'force_login': 'true',
        'lang': 'en'
    });
    
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log('🔮 Twitter login successful:', result.user);
            updateUI(result.user);
            showSuccessMessage('Successfully connected with Twitter! Welcome to SOLalchemists!');
        })
        .catch((error) => {
            console.error('❌ Twitter login error:', error);
            
            // Handle specific error cases
            if (error.code === 'auth/popup-closed-by-user') {
                showErrorMessage('Login cancelled. Please try again.');
            } else if (error.code === 'auth/popup-blocked') {
                showErrorMessage('Popup blocked. Please allow popups for this site.');
            } else if (error.code === 'auth/invalid-credential') {
                showErrorMessage('Twitter OAuth not configured. Please check Firebase Console settings.');
                console.error('❌ Twitter OAuth credentials not configured in Firebase Console');
                console.error('🔧 Please go to Firebase Console → Authentication → Sign-in method → Twitter → Enable and add credentials');
            } else {
                showErrorMessage('Twitter login failed: ' + error.message);
            }
        });
}

function signInWithDiscord() {
    // Discord OAuth implementation
    const clientId = 'YOUR_DISCORD_CLIENT_ID';
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
    const scope = 'identify email';
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    
    window.location.href = discordAuthUrl;
}

function signInWithTelegram() {
    // Telegram OAuth implementation
    const botUsername = 'YOUR_TELEGRAM_BOT_USERNAME';
    const telegramAuthUrl = `https://oauth.telegram.org/auth?bot_id=${botUsername}&request_access=write&origin=${encodeURIComponent(window.location.origin)}`;
    
    window.location.href = telegramAuthUrl;
}

function signOut() {
    auth.signOut()
        .then(() => {
            console.log('🔮 User signed out');
            updateUI(null);
            showSuccessMessage('Successfully disconnected!');
        })
        .catch((error) => {
            console.error('❌ Sign out error:', error);
            showErrorMessage('Sign out failed: ' + error.message);
        });
}

function updateUI(user) {
    const loginButtons = document.querySelector('.login-buttons');
    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const connectWalletBtn = document.querySelector('.cta-button');
    const transmutationBtn = document.querySelector('.cta-button.secondary');

    if (user) {
        // User is signed in
        if (loginButtons) loginButtons.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'flex';
            userAvatar.src = user.photoURL || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMwMGZmNDEiLz4KPC9zdmc+';
            userName.textContent = user.displayName || user.email || 'SOLalchemist';
        }
        
        // Show social rewards system
        const socialRewards = document.getElementById('social-rewards');
        if (socialRewards) {
            socialRewards.style.display = 'block';
        }
        
        // Update first button to "CONNECT WALLET" (for Solana wallet connection)
        if (connectWalletBtn) {
            connectWalletBtn.innerHTML = '<i class="fas fa-plug"></i> CONNECT WALLET';
            connectWalletBtn.onclick = connectWallet;
            connectWalletBtn.disabled = false;
            connectWalletBtn.style.background = 'linear-gradient(45deg, #00ff41, #008000)';
        }
        
        // Update second button to "BEGIN TRANSMUTATION" (for final action)
        if (transmutationBtn) {
            transmutationBtn.innerHTML = '<i class="fas fa-magic"></i> BEGIN TRANSMUTATION';
            transmutationBtn.onclick = beginTransmutation;
            transmutationBtn.disabled = false;
        }
    } else {
        // User is signed out
        if (loginButtons) loginButtons.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
        
        // Hide social rewards system
        const socialRewards = document.getElementById('social-rewards');
        if (socialRewards) {
            socialRewards.style.display = 'none';
        }
        
        // Reset first button to "CONNECT WALLET"
        if (connectWalletBtn) {
            connectWalletBtn.innerHTML = '<i class="fas fa-plug"></i> CONNECT WALLET';
            connectWalletBtn.onclick = connectWallet;
            connectWalletBtn.disabled = false;
        }
        
        // Reset second button to "BEGIN TRANSMUTATION" but disabled
        if (transmutationBtn) {
            transmutationBtn.innerHTML = '<i class="fas fa-magic"></i> BEGIN TRANSMUTATION';
            transmutationBtn.onclick = beginTransmutation;
            transmutationBtn.disabled = true;
        }
    }
}

function showSuccessMessage(message) {
    // Create a centered success message display
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <h5 style="color: #00ff41; margin-bottom: 15px;">
                <i class="fas fa-check-circle"></i> Success
            </h5>
            <p style="color: #00ff41; margin-bottom: 15px;">${message}</p>
            <button onclick="this.parentElement.parentElement.remove()" style="background: #00ff41; color: #000; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-family: 'Press Start 2P', cursive; font-size: 0.6rem;">
                Close
            </button>
        </div>
    `;
    
    // Add styles for the success message
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.95);
        border: 3px solid #00ff41;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 0 30px rgba(0, 255, 65, 0.5);
        z-index: 10000;
        max-width: 400px;
        text-align: center;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (successDiv.parentElement) {
            successDiv.remove();
        }
    }, 5000);
}

function showErrorMessage(message) {
    // Use the centered error display instead of toast
    const errorDiv = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    if (errorDiv && errorText) {
        errorText.textContent = message;
        errorDiv.style.display = 'block';
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 8000);
    } else {
        // Fallback to console if error div not found
        console.error('Error:', message);
    }
}

function beginTransmutation() {
    // This function will be called when user is logged in and clicks "BEGIN TRANSMUTATION"
    console.log('🔮 Beginning transmutation process...');
    
    if (firebase.auth().currentUser) {
        // Check if wallet is connected (currentPublicKey should be set by connectWallet function)
        if (typeof currentPublicKey !== 'undefined' && currentPublicKey) {
            showSuccessMessage('Transmutation initiated! Welcome to the mystical realm.');
            
            // Store user info in sessionStorage for the reveal page
            const user = firebase.auth().currentUser;
            sessionStorage.setItem('solalchemists_user', JSON.stringify({
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                walletAddress: currentPublicKey,
                walletType: currentWallet ? currentWallet.wallet : 'Unknown'
            }));
            
            // Redirect to reveal page after a short delay
            setTimeout(() => {
                window.location.href = 'real-nft-reveal.html';
            }, 2000);
            
        } else {
            showErrorMessage('Please connect your Solana wallet first!');
        }
    } else {
        showErrorMessage('Please connect with social media first!');
    }
}

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
    console.log('🔮 Auth state changed:', user ? 'User logged in' : 'User logged out');
    updateUI(user);
});

// Test Firebase configuration
function testFirebaseConfig() {
    console.log('🔮 Testing Firebase configuration...');
    console.log('Firebase config:', firebaseConfig);
    console.log('Firebase auth available:', !!firebase.auth);
    console.log('Twitter provider available:', !!firebase.auth.TwitterAuthProvider);
    
    // Test if we can create a Twitter provider
    try {
        const provider = new firebase.auth.TwitterAuthProvider();
        console.log('✅ Twitter provider created successfully');
        
        // Test provider methods
        console.log('Provider methods available:', Object.getOwnPropertyNames(provider));
        
        // Set custom parameters as per Firebase docs
        provider.setCustomParameters({
            'force_login': 'true',
            'lang': 'en'
        });
        console.log('✅ Custom parameters set successfully');
        
    } catch (error) {
        console.error('❌ Failed to create Twitter provider:', error);
    }
    
    // Check auth domain
    console.log('🔍 Auth domain:', firebaseConfig.authDomain);
    console.log('🔍 Expected auth domain: sol-alchemists.firebaseapp.com');
    
    if (firebaseConfig.authDomain !== 'sol-alchemists.firebaseapp.com') {
        console.warn('⚠️ Auth domain might not match expected value');
    }
}



// Run configuration test on page load
document.addEventListener('DOMContentLoaded', () => {
    testFirebaseConfig();
    checkOAuthCallback();
});

// Check for OAuth callback parameters
function checkOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const provider = urlParams.get('provider');
    
    if (code && provider) {
        // Handle OAuth callback
        console.log('🔮 OAuth callback received for:', provider);
        showSuccessMessage(`Successfully connected with ${provider}!`);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}
