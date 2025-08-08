// SOLalchemists Mystery Reveal Website
class MysteryRevealApp {
    constructor() {
        // Use devnet for testing
        this.connection = new solanaWeb3.Connection('https://api.devnet.solana.com', 'confirmed');
        // Initialize metaplex later when needed
        this.metaplex = null;
        this.wallet = null;
        this.mysteryNFTs = [];
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Wallet connection
        const connectButton = document.getElementById('connect-wallet');
        if (connectButton) {
            connectButton.addEventListener('click', () => {
                console.log('🔘 Connect wallet button clicked');
                console.log('🔄 Calling connectWallet()...');
                this.connectWallet();
            });
            console.log('✅ Connect wallet button event listener added');
        } else {
            console.error('❌ Connect wallet button not found');
        }
        
        const disconnectButton = document.getElementById('disconnect-wallet');
        if (disconnectButton) {
            disconnectButton.addEventListener('click', () => this.disconnectWallet());
        }
        
        // Auto-connect if wallet was previously connected
        this.checkForExistingConnection();
    }
    
    async checkForExistingConnection() {
        // Check for Solflare first
        if (window.solflare) {
            try {
                const response = await window.solflare.connect({ onlyIfTrusted: true });
                this.wallet = response.publicKey;
                this.onWalletConnected();
                return;
            } catch (error) {
                console.log('No existing Solflare connection found');
            }
        }
        
        // Check for other Solana wallets
        if (window.solana) {
            try {
                const response = await window.solana.connect({ onlyIfTrusted: true });
                this.wallet = response.publicKey;
                this.onWalletConnected();
            } catch (error) {
                console.log('No existing connection found');
            }
        }
    }
    
    async connectWallet() {
        try {
            console.log('🔍 Checking for Solana wallet...');
            
            // Check for Solflare first (it uses different detection)
            if (window.solflare) {
                console.log('✅ Solflare wallet detected via window.solflare');
                console.log('🔄 Attempting to connect to Solflare...');
                
                try {
                    const response = await window.solflare.connect();
                    console.log('🔍 Solflare response:', response);
                    console.log('🔍 Response type:', typeof response);
                    
                    // Solflare returns boolean true on successful connection
                    // We need to get the public key from the wallet object
                    if (response === true) {
                        console.log('✅ Solflare connection successful, getting public key...');
                        
                                            // Try different methods to get the public key
                    console.log('🔍 Trying different methods to get public key...');
                    
                    // Method 1: Try getAccounts
                    try {
                        const accountsResponse = await window.solflare.request({ method: 'getAccounts' });
                        console.log('🔍 getAccounts response:', accountsResponse);
                        
                        if (accountsResponse && accountsResponse.length > 0) {
                            this.wallet = accountsResponse[0];
                            console.log('✅ Found publicKey via getAccounts');
                        }
                    } catch (e) {
                        console.log('❌ getAccounts failed:', e.message);
                    }
                    
                    // Method 2: Try getAccountInfo
                    if (!this.wallet) {
                        try {
                            const accountInfoResponse = await window.solflare.request({ method: 'getAccountInfo' });
                            console.log('🔍 getAccountInfo response:', accountInfoResponse);
                            
                            if (accountInfoResponse && accountInfoResponse.publicKey) {
                                this.wallet = accountInfoResponse.publicKey;
                                console.log('✅ Found publicKey via getAccountInfo');
                            }
                        } catch (e) {
                            console.log('❌ getAccountInfo failed:', e.message);
                        }
                    }
                    
                    // Method 3: Try getWallet
                    if (!this.wallet) {
                        try {
                            const walletResponse = await window.solflare.request({ method: 'getWallet' });
                            console.log('🔍 getWallet response:', walletResponse);
                            
                            if (walletResponse && walletResponse.publicKey) {
                                this.wallet = walletResponse.publicKey;
                                console.log('✅ Found publicKey via getWallet');
                            }
                        } catch (e) {
                            console.log('❌ getWallet failed:', e.message);
                        }
                    }
                    
                    // Method 4: Try getAddress
                    if (!this.wallet) {
                        try {
                            const addressResponse = await window.solflare.request({ method: 'getAddress' });
                            console.log('🔍 getAddress response:', addressResponse);
                            
                            if (addressResponse) {
                                this.wallet = addressResponse;
                                console.log('✅ Found publicKey via getAddress');
                            }
                        } catch (e) {
                            console.log('❌ getAddress failed:', e.message);
                        }
                    }
                        
                        if (this.wallet) {
                            console.log('✅ Solflare connected successfully:', this.wallet.toString());
                            this.onWalletConnected();
                            return;
                        } else {
                            console.error('❌ Could not get public key after successful connection');
                            this.showError('Connected but could not get wallet address. Please check if Solflare is properly connected.');
                            return;
                        }
                    } else {
                        console.error('❌ Unexpected Solflare response:', response);
                        this.showError('Unexpected response from Solflare: ' + response);
                        return;
                    }
                } catch (solflareError) {
                    console.error('Solflare connection error:', solflareError);
                    this.showError('Failed to connect Solflare: ' + solflareError.message);
                    return;
                }
            }
            
            // Check for any Solana wallet (Phantom, etc.)
            if (!window.solana) {
                console.error('No window.solana found');
                this.showError('Please install a Solana wallet (Phantom, Solflare, etc.) first!');
                return;
            }
            
            console.log('✅ window.solana found');
            console.log('Wallet info:', {
                isSolflare: window.solana.isSolflare,
                isPhantom: window.solana.isPhantom,
                isConnected: window.solana.isConnected
            });
            
            // Try to connect to the wallet
            console.log('🔄 Attempting to connect...');
            const response = await window.solana.connect();
            this.wallet = response.publicKey;
            console.log('✅ Connected successfully:', this.wallet.toString());
            this.onWalletConnected();
            
        } catch (error) {
            console.error('Wallet connection error:', error);
            this.showError('Failed to connect wallet: ' + error.message);
        }
    }
    
    disconnectWallet() {
        this.wallet = null;
        this.onWalletDisconnected();
    }
    
    onWalletConnected() {
        document.getElementById('wallet-not-connected').style.display = 'none';
        document.getElementById('wallet-connected').style.display = 'block';
        document.getElementById('wallet-address').textContent = 
            this.wallet.toString().slice(0, 4) + '...' + this.wallet.toString().slice(-4);
        
        this.loadMysteryNFTs();
    }
    
    onWalletDisconnected() {
        document.getElementById('wallet-not-connected').style.display = 'block';
        document.getElementById('wallet-connected').style.display = 'none';
        document.getElementById('mystery-nfts').style.display = 'none';
        this.mysteryNFTs = [];
    }
    
    async loadMysteryNFTs() {
        try {
            this.showLoading('Loading your mystery NFTs...');
            
            // Initialize metaplex if not already done
            if (!this.metaplex) {
                console.log('🔧 Initializing Metaplex...');
                
                // Check if Metaplex is available
                if (!window.Metaplex) {
                    console.error('❌ Metaplex library not loaded!');
                    this.showMessage('Metaplex library not available. Please refresh the page or try again later.', 'warning');
                    this.hideLoading();
                    return;
                }
                
                // For the website, we'll use a guest identity since we don't have the keypair
                // The user will sign transactions through their wallet
                this.metaplex = window.Metaplex.make(this.connection);
            }
            
            // Get all NFTs owned by the wallet
            const nfts = await this.metaplex.nfts().findAllByOwner({
                owner: this.wallet
            });
            
            // Filter for mystery NFTs (symbol: MYST for testing)
            this.mysteryNFTs = nfts.filter(nft => 
                nft.symbol === 'MYST' && 
                nft.name.includes('Mystery')
            );
            
            console.log(`Found ${this.mysteryNFTs.length} mystery NFTs`);
            this.hideLoading();
            this.displayMysteryNFTs();
            
        } catch (error) {
            console.error('Failed to load NFTs:', error);
            this.hideLoading();
            
            // Show a more user-friendly error message
            if (error.message.includes('Metaplex') || error.message.includes('make')) {
                this.showMessage('Metaplex library issue. Please refresh the page or try again later.', 'warning');
            } else {
                this.showError('Failed to load NFTs: ' + error.message);
            }
        }
    }
    
    displayMysteryNFTs() {
        const nftList = document.getElementById('nft-list');
        const mysteryContainer = document.getElementById('mystery-nfts');
        
        if (this.mysteryNFTs.length === 0) {
            nftList.innerHTML = `
                <div class="col-12 text-center">
                    <div class="mystery-card">
                        <i class="fas fa-search fa-3x text-white-50 mb-3"></i>
                        <h4 class="text-white">No Mystery NFTs Found</h4>
                        <p class="text-white-50">You don't have any mystery NFTs in this wallet.</p>
                        <p class="text-white-50">Make sure you're connected to the right wallet!</p>
                    </div>
                </div>
            `;
        } else {
            nftList.innerHTML = this.mysteryNFTs.map((nft, index) => `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="mystery-card text-center">
                        <img src="${nft.json?.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNjY2NjY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TXlzdGVyeSBBbGNoZW1pc3Q8L3RleHQ+Cjwvc3ZnPgo='}" 
                             alt="Mystery NFT" class="nft-image mystery-shimmer">
                        <h5 class="text-white">${nft.name}</h5>
                        <p class="text-white-50">Status: Mystery</p>
                        <button class="reveal-button" onclick="app.revealNFT('${nft.address.toString()}', ${index})">
                            <i class="fas fa-magic"></i> Reveal NFT
                        </button>
                    </div>
                </div>
            `).join('');
        }
        
        mysteryContainer.style.display = 'block';
    }
    
    async revealNFT(nftAddress, index) {
        try {
            this.showLoading('Revealing your mystery alchemist...');
            
            // Initialize metaplex if not already done
            if (!this.metaplex) {
                console.log('🔧 Initializing Metaplex...');
                
                // Check if Metaplex is available
                if (!window.Metaplex) {
                    console.error('❌ Metaplex library not loaded!');
                    this.showError('Metaplex library failed to load. Please refresh the page.');
                    return;
                }
                
                // For the website, we'll use a guest identity since we don't have the keypair
                // The user will sign transactions through their wallet
                this.metaplex = window.Metaplex.make(this.connection);
            }
            
            // Get the NFT
            const nft = await this.metaplex.nfts().findByMint({
                mintAddress: new solanaWeb3.PublicKey(nftAddress)
            });
            
            // Extract the NFT number from the name (e.g., "Mystery Alchemist #1" -> 1)
            const nftNumber = parseInt(nft.name.match(/#(\d+)/)?.[1] || '1');
            
            // Create the real metadata URI for testing
            // For testing, we'll use a simple revealed metadata
            const revealedMetadata = {
                name: `SOLalchemists #${nftNumber}`,
                description: "The Alchemists of Solana!",
                image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZmY2YjZiIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U09MYWxjaGVtaXN0cyAjMSE8L3RleHQ+Cjwvc3ZnPgo=",
                attributes: [
                    {
                        trait_type: "Background",
                        value: "Solana"
                    },
                    {
                        trait_type: "Items",
                        value: "Black_Stick"
                    },
                    {
                        trait_type: "Robe",
                        value: "Cyber_Robe"
                    },
                    {
                        trait_type: "Headwear",
                        value: "Red_Eyes"
                    }
                ]
            };
            
            const realMetadataUri = "data:application/json;base64," + Buffer.from(JSON.stringify(revealedMetadata)).toString('base64');
            
            // Update the NFT metadata
            const { response } = await this.metaplex.nfts().update({
                nftOrSft: { address: new solanaWeb3.PublicKey(nftAddress) },
                name: `SOLalchemists #${nftNumber}`,
                symbol: 'SOLALCH',
                uri: realMetadataUri,
                sellerFeeBasisPoints: 500,
                creators: [
                    {
                        address: this.wallet,
                        share: 100,
                        verified: true,
                    },
                ],
            });
            
            this.hideLoading();
            this.showSuccess(nftAddress, response.signature);
            
            // Remove the revealed NFT from the list
            this.mysteryNFTs.splice(index, 1);
            this.displayMysteryNFTs();
            
        } catch (error) {
            this.hideLoading();
            this.showError('Failed to reveal NFT: ' + error.message);
        }
    }
    
    showLoading(message) {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading').querySelector('p').textContent = message;
        document.getElementById('success-message').style.display = 'none';
        document.getElementById('error-message').style.display = 'none';
    }
    
    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }
    
    showSuccess(nftAddress, signature) {
        const successDiv = document.getElementById('success-message');
        const solscanLink = document.getElementById('view-on-solscan');
        
        solscanLink.href = `https://solscan.io/token/${nftAddress}?cluster=devnet`;
        successDiv.style.display = 'block';
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 10000);
    }
    
    showError(message) {
        const errorDiv = document.getElementById('error-message');
        const errorText = document.getElementById('error-text');
        
        errorText.textContent = message;
        errorDiv.style.display = 'block';
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 10000);
    }
    
    showMessage(message, type = 'info') {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = message;
        messageDiv.className = `alert alert-${type === 'warning' ? 'warning' : 'info'} alert-dismissible fade show`;
        messageDiv.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Initialize the app when the page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MysteryRevealApp();
});

// Handle wallet connection changes
if (window.solflare) {
    window.solflare.on('connect', () => {
        if (app) {
            app.wallet = window.solflare.publicKey;
            app.onWalletConnected();
        }
    });
    
    window.solflare.on('disconnect', () => {
        if (app) {
            app.onWalletDisconnected();
        }
    });
}

if (window.solana) {
    window.solana.on('connect', () => {
        if (app) {
            app.wallet = window.solana.publicKey;
            app.onWalletConnected();
        }
    });
    
    window.solana.on('disconnect', () => {
        if (app) {
            app.onWalletDisconnected();
        }
    });
}
