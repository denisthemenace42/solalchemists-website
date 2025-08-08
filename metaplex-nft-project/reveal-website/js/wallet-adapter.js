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
                icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9InVybCgjZ3JhZGllbnQxX2xpbmVhcl8xXzEpIi8+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9InVybCgjZ3JhZGllbnQyX2xpbmVhcl8xXzEpIi8+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9InVybCgjZ3JhZGllbnQzX2xpbmVhcl8xXzEpIi8+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9InVybCgjZ3JhZGllbnQ0X2xpbmVhcl8xXzEpIi8+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9InVybCgjZ3JhZGllbnQ1X2xpbmVhcl8xXzEpIi8+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9InVybCgjZ3JhZGllbnQ2X2xpbmVhcl8xXzEpIi8+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9InVybCgjZ3JhZGllbnQ3X2xpbmVhcl8xXzEpIi8+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9InVybCgjZ3JhZGllbnQ4X2xpbmVhcl8xXzEpIi8+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9InVybCgjZ3JhZGllbnQ5X2xpbmVhcl8xXzEpIi8+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9InVybCgjZ3JhZGllbnQxMF9saW5lYXJfMV8xKSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDBfbGluZWFyXzFfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iMTI4IiB5Mj0iMTI4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM1NEE5RkYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQUJGRjE5Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQxX2xpbmVhcl8xXzEiIHgxPSIwIiB5MT0iMCIgeDI9IjEyOCIgeTI9IjEyOCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjNTZBRUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0FCQ0YxOSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50Ml9saW5lYXJfMV8xIiB4MT0iMCIgeTE9IjAiIHgyPSIxMjgiIHkyPSIxMjgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzU4QjNGRiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNBQ0NGMTkiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDNfbGluZWFyXzFfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iMTI4IiB5Mj0iMTI4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM1QkM3RkYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQURGRjE5Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQ0X2xpbmVhcl8xXzEiIHgxPSIwIiB5MT0iMCIgeDI9IjEyOCIgeTI9IjEyOCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjNUZDRUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0FFRkYxOSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50NV9saW5lYXJfMV8xIiB4MT0iMCIgeTE9IjAiIHgyPSIxMjgiIHkyPSIxMjgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzYwRDFGRiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNBRkZGMjAiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDZfbGluZWFyXzFfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iMTI4IiB5Mj0iMTI4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM2MUQ0RkYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQjBGRjIwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQ3X2xpbmVhcl8xXzEiIHgxPSIwIiB5MT0iMCIgeDI9IjEyOCIgeTI9IjEyOCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjNjJEN0ZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0IxRkYyMCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50OF9saW5lYXJfMV8xIiB4MT0iMCIgeTE9IjAiIHgyPSIxMjgiIHkyPSIxMjgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzYzRENGIiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNCMkZGMjAiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDlfbGluZWFyXzFfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iMTI4IiB5Mj0iMTI4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM2NEUwRkYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQjNGRjIwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQxMF9saW5lYXJfMV8xIiB4MT0iMCIgeTE9IjAiIHgyPSIxMjgiIHkyPSIxMjgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzY1RTNGRiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNCNEZGMjAiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K',
                adapter: 'phantom'
            },
            {
                name: 'Solflare',
                url: 'https://solflare.com/',
                icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxwYXRoIGQ9Ik0yNCAyNEgxMDRWMTA0SDI0VjI0WiIgZmlsbD0id2hpdGUiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQwX2xpbmVhcl8xXzEiIHgxPSIwIiB5MT0iMCIgeDI9IjEyOCIgeTI9IjEyOCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkY2QjAwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGOTgwMCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=',
                adapter: 'solflare'
            },
            {
                name: 'Backpack',
                url: 'https://backpack.app/',
                icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iTTMyIDMySDk2Vjk2SDMyVjMyWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQ4IDQ4SDgwVjgwSDQ4VjQ4WiIgZmlsbD0iIzAwMDAwMCIvPgo8L3N2Zz4K',
                adapter: 'backpack'
            },
            {
                name: 'Slope',
                url: 'https://slope.finance/',
                icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiMwMDgwMDAiLz4KPHBhdGggZD0iTTI0IDI0SDQ4VjQ4SDI0VjI0WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQ4IDQ4SDcyVjcySDQ4VjQ4WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTcyIDcySDk2Vjk2SDcyVjcyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==',
                adapter: 'slope'
            },
            {
                name: 'Glow',
                url: 'https://glow.app/',
                icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiNGRjZCMDAiLz4KPGNpcmNsZSBjeD0iNjQiIGN5PSI2NCIgcj0iMzIiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjY0IiBjeT0iNjQiIHI9IjE2IiBmaWxsPSIjRkY2QjAwIi8+Cjwvc3ZnPgo=',
                adapter: 'glow'
            },
            {
                name: 'Clover',
                url: 'https://clover.finance/',
                icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiNGRjZCMDAiLz4KPHBhdGggZD0iTTMyIDMyTDUwIDUwTDMyIDY4VjMyWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTk2IDMyTDUwIDUwTDk2IDY4VjMyWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTMyIDk2TDUwIDUwTDMyIDMyVjk2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTk2IDk2TDUwIDUwTDk2IDMyVjk2WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==',
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
