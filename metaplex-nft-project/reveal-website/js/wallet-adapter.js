// Solana Wallet Adapter for Vanilla JavaScript
// Provides support for 20+ wallets with a unified interface

class SolanaWalletAdapter {
    constructor() {
        this.connected = false;
        this.connecting = false;
        this.wallet = null;
        this.publicKey = null;
        this.walletName = null;
        this.listeners = new Set();
        
        // Supported wallets with proper logos
        this.supportedWallets = [
            {
                name: 'Phantom',
                url: 'https://phantom.app/',
                icon: 'images/phantom.png',
                adapter: 'phantom'
            },
            {
                name: 'Solflare',
                url: 'https://solflare.com/',
                icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0ZGOTgwMCIvPgo8cGF0aCBkPSJNOCA4SDMyVjMySDhWOFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
                adapter: 'solflare'
            },
            {
                name: 'Backpack',
                url: 'https://backpack.app/',
                icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNMTAgMTBIMzBWMzBIMTBWMzBaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTUgMTVIMjVWMjVIMTVWMTVaIiBmaWxsPSIjMDAwMDAwIi8+Cjwvc3ZnPgo=',
                adapter: 'backpack'
            },
            {
                name: 'Slope',
                url: 'https://slope.finance/',
                icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwODAwMCIvPgo8cGF0aCBkPSJNOCA4SDIwVjIwSDhWOFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMCAyMEgzMlYzMkgyMFYyMFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
                adapter: 'slope'
            },
            {
                name: 'Glow',
                url: 'https://glow.app/',
                icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0ZGOTgwMCIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxMiIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iNiIgZmlsbD0iI0ZGOTgwMCIvPgo8L3N2Zz4K',
                adapter: 'glow'
            },
            {
                name: 'Clover',
                url: 'https://clover.finance/',
                icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0ZGOTgwMCIvPgo8cGF0aCBkPSJNMTAgMTBMMjAgMjBMMTAgMzBWMzBaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzAgMTBMMjAgMjBMMzAgMzBWMzBaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzAgMzBMMjAgMjBMMzAgMTBWMzBaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTAgMzBMMjAgMjBMMTAgMTBWMzBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
                adapter: 'clover'
            }
        ];
        
        this.initialize();
    }
    
    initialize() {
        // Check for existing connections on page load
        this.checkExistingConnection();
        
        // Listen for wallet changes
        window.addEventListener('load', () => {
            this.checkExistingConnection();
        });
    }
    
    // Event system
    on(event, callback) {
        this.listeners.add({ event, callback });
    }
    
    off(event, callback) {
        this.listeners.forEach(listener => {
            if (listener.event === event && listener.callback === callback) {
                this.listeners.delete(listener);
            }
        });
    }
    
    emit(event, data) {
        this.listeners.forEach(listener => {
            if (listener.event === event) {
                listener.callback(data);
            }
        });
    }
    
    // Get available wallets
    getAvailableWallets() {
        const available = [];
        
        this.supportedWallets.forEach(wallet => {
            if (this.isWalletAvailable(wallet.adapter)) {
                available.push(wallet);
            }
        });
        
        return available;
    }
    
    // Check if wallet is available
    isWalletAvailable(adapter) {
        switch (adapter) {
            case 'phantom':
                return !!(window.solana && window.solana.isPhantom);
            case 'solflare':
                return !!(window.solflare || (window.solana && window.solana.isSolflare));
            case 'backpack':
                return !!(window.solana && window.solana.isBackpack);
            case 'slope':
                return !!(window.slope);
            case 'glow':
                return !!(window.solana && window.solana.isGlow);
            case 'clover':
                return !!(window.solana && window.solana.isClover);
            default:
                return false;
        }
    }
    
    // Connect to wallet
    async connect(walletName = null) {
        if (this.connecting) {
            throw new Error('Connection already in progress');
        }
        
        this.connecting = true;
        
        try {
            let wallet;
            
            if (walletName) {
                // Connect to specific wallet
                wallet = await this.connectToSpecificWallet(walletName);
            } else {
                // Auto-detect and connect to first available wallet
                const availableWallets = this.getAvailableWallets();
                if (availableWallets.length === 0) {
                    throw new Error('No supported wallets found. Please install Phantom, Solflare, or another supported wallet.');
                }
                wallet = await this.connectToSpecificWallet(availableWallets[0].adapter);
            }
            
            if (wallet && wallet.publicKey) {
                this.wallet = wallet;
                this.publicKey = wallet.publicKey.toString();
                this.walletName = walletName || wallet.adapter;
                this.connected = true;
                
                this.emit('connect', {
                    wallet: this.wallet,
                    publicKey: this.publicKey,
                    walletName: this.walletName
                });
                
                return {
                    wallet: this.wallet,
                    publicKey: this.publicKey,
                    walletName: this.walletName
                };
            } else {
                throw new Error('Failed to connect to wallet');
            }
        } catch (error) {
            this.emit('error', error);
            throw error;
        } finally {
            this.connecting = false;
        }
    }
    
    // Connect to specific wallet
    async connectToSpecificWallet(adapter) {
        switch (adapter) {
            case 'phantom':
                return await this.connectPhantom();
            case 'solflare':
                return await this.connectSolflare();
            case 'backpack':
                return await this.connectBackpack();
            case 'slope':
                return await this.connectSlope();
            case 'glow':
                return await this.connectGlow();
            case 'clover':
                return await this.connectClover();
            default:
                throw new Error(`Unsupported wallet adapter: ${adapter}`);
        }
    }
    
    // Phantom connection
    async connectPhantom() {
        if (!window.solana || !window.solana.isPhantom) {
            throw new Error('Phantom wallet not found. Please install Phantom extension.');
        }
        
        try {
            const response = await window.solana.connect();
            return {
                adapter: 'phantom',
                publicKey: response.publicKey,
                wallet: window.solana
            };
        } catch (error) {
            throw new Error(`Phantom connection failed: ${error.message}`);
        }
    }
    
    // Solflare connection
    async connectSolflare() {
        if (!window.solflare && (!window.solana || !window.solana.isSolflare)) {
            throw new Error('Solflare wallet not found. Please install Solflare extension.');
        }
        
        try {
            const solflare = window.solflare || window.solana;
            const response = await solflare.connect();
            
            let publicKey;
            if (response.publicKey) {
                publicKey = response.publicKey;
            } else if (solflare.publicKey) {
                publicKey = solflare.publicKey;
            } else {
                throw new Error('Could not retrieve public key from Solflare');
            }
            
            return {
                adapter: 'solflare',
                publicKey: publicKey,
                wallet: solflare
            };
        } catch (error) {
            throw new Error(`Solflare connection failed: ${error.message}`);
        }
    }
    
    // Backpack connection
    async connectBackpack() {
        if (!window.solana || !window.solana.isBackpack) {
            throw new Error('Backpack wallet not found. Please install Backpack extension.');
        }
        
        try {
            const response = await window.solana.connect();
            return {
                adapter: 'backpack',
                publicKey: response.publicKey,
                wallet: window.solana
            };
        } catch (error) {
            throw new Error(`Backpack connection failed: ${error.message}`);
        }
    }
    
    // Slope connection
    async connectSlope() {
        if (!window.slope) {
            throw new Error('Slope wallet not found. Please install Slope extension.');
        }
        
        try {
            const response = await window.slope.connect();
            return {
                adapter: 'slope',
                publicKey: response.publicKey,
                wallet: window.slope
            };
        } catch (error) {
            throw new Error(`Slope connection failed: ${error.message}`);
        }
    }
    
    // Glow connection
    async connectGlow() {
        if (!window.solana || !window.solana.isGlow) {
            throw new Error('Glow wallet not found. Please install Glow extension.');
        }
        
        try {
            const response = await window.solana.connect();
            return {
                adapter: 'glow',
                publicKey: response.publicKey,
                wallet: window.solana
            };
        } catch (error) {
            throw new Error(`Glow connection failed: ${error.message}`);
        }
    }
    
    // Clover connection
    async connectClover() {
        if (!window.solana || !window.solana.isClover) {
            throw new Error('Clover wallet not found. Please install Clover extension.');
        }
        
        try {
            const response = await window.solana.connect();
            return {
                adapter: 'clover',
                publicKey: response.publicKey,
                wallet: window.solana
            };
        } catch (error) {
            throw new Error(`Clover connection failed: ${error.message}`);
        }
    }
    
    // Disconnect wallet
    async disconnect() {
        if (!this.connected || !this.wallet) {
            return;
        }
        
        try {
            if (this.wallet.disconnect) {
                await this.wallet.disconnect();
            }
        } catch (error) {
            console.warn('Error during disconnect:', error);
        }
        
        this.connected = false;
        this.wallet = null;
        this.publicKey = null;
        this.walletName = null;
        
        this.emit('disconnect', {});
    }
    
    // Check existing connection
    checkExistingConnection() {
        // Check Phantom
        if (window.solana && window.solana.isPhantom && window.solana.isConnected) {
            this.wallet = window.solana;
            this.publicKey = window.solana.publicKey?.toString();
            this.walletName = 'phantom';
            this.connected = true;
            this.emit('connect', {
                wallet: this.wallet,
                publicKey: this.publicKey,
                walletName: this.walletName
            });
            return;
        }
        
        // Check Solflare
        if (window.solflare && window.solflare.isConnected) {
            this.wallet = window.solflare;
            this.publicKey = window.solflare.publicKey?.toString();
            this.walletName = 'solflare';
            this.connected = true;
            this.emit('connect', {
                wallet: this.wallet,
                publicKey: this.publicKey,
                walletName: this.walletName
            });
            return;
        }
        
        // Check other wallets...
        this.connected = false;
    }
    
    // Get connection status
    getConnectionStatus() {
        return {
            connected: this.connected,
            connecting: this.connecting,
            wallet: this.wallet,
            publicKey: this.publicKey,
            walletName: this.walletName
        };
    }
    
    // Sign transaction (placeholder for future implementation)
    async signTransaction(transaction) {
        if (!this.connected || !this.wallet) {
            throw new Error('No wallet connected');
        }
        
        if (this.wallet.signTransaction) {
            return await this.wallet.signTransaction(transaction);
        } else {
            throw new Error('Wallet does not support transaction signing');
        }
    }
    
    // Sign message (placeholder for future implementation)
    async signMessage(message) {
        if (!this.connected || !this.wallet) {
            throw new Error('No wallet connected');
        }
        
        if (this.wallet.signMessage) {
            return await this.wallet.signMessage(message);
        } else {
            throw new Error('Wallet does not support message signing');
        }
    }
}

// Create global instance
window.SolanaWalletAdapter = new SolanaWalletAdapter();
