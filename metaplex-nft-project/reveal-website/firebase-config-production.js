// 🔮 SOLalchemists Firebase Configuration - PRODUCTION
// Update this file with your custom domain after deployment

const firebaseConfig = {
  apiKey: "AIzaSyCSEuWzq5mgmulc53LOXo1iUVuLxs3iAos",
  authDomain: "sol-alchemists.firebaseapp.com",
  projectId: "sol-alchemists",
  storageBucket: "sol-alchemists.firebasestorage.app",
  messagingSenderId: "898278444",
  appId: "1:898278444:web:28f2b6b20afc0852ab5d89",
  measurementId: "G-ME4BQE7K0L"
};

// 🔧 IMPORTANT: After deploying to Vercel with custom domain:
// 1. Go to Firebase Console → Authentication → Settings
// 2. Add your custom domain to "Authorized domains"
// 3. Update Twitter OAuth callback URLs if needed

console.log('🔮 Firebase config loaded for production');
console.log('🌐 Remember to add your custom domain to Firebase Console');

export { firebaseConfig };
