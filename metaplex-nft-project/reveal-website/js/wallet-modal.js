// Wallet Modal UI Component
class WalletModal {
    constructor() {
        this.modal = null;
        this.overlay = null;
        this.isOpen = false;
        this.onWalletSelect = null;
        this.createModal();
    }
    
    createModal() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'wallet-modal-overlay';
        
        // Create modal
        this.modal = document.createElement('div');
        this.modal.className = 'wallet-modal';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'wallet-modal-header';
        
        const title = document.createElement('h2');
        title.className = 'wallet-modal-title';
        title.textContent = 'CONNECT WALLET';
        
        const subtitle = document.createElement('p');
        subtitle.className = 'wallet-modal-subtitle';
        subtitle.textContent = 'Choose your preferred wallet to connect';
        
        header.appendChild(title);
        header.appendChild(subtitle);
        
        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'wallet-modal-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => this.close();
        
        // Create wallet list container
        const walletList = document.createElement('div');
        walletList.className = 'wallet-list';
        walletList.id = 'wallet-list';
        
        // Create status container
        const statusContainer = document.createElement('div');
        statusContainer.id = 'wallet-status-container';
        
        // Assemble modal
        this.modal.appendChild(closeBtn);
        this.modal.appendChild(header);
        this.modal.appendChild(statusContainer);
        this.modal.appendChild(walletList);
        
        // Add to overlay
        this.overlay.appendChild(this.modal);
        
        // Add to body
        document.body.appendChild(this.overlay);
        
        // Close on overlay click
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    open(onWalletSelect) {
        this.onWalletSelect = onWalletSelect;
        this.isOpen = true;
        this.overlay.classList.add('show');
        this.renderWallets();
        
        // Focus trap
        this.modal.focus();
    }
    
    close() {
        this.isOpen = false;
        this.overlay.classList.remove('show');
        this.onWalletSelect = null;
    }
    
    renderWallets() {
        const walletList = document.getElementById('wallet-list');
        const statusContainer = document.getElementById('wallet-status-container');
        
        // Clear existing content
        walletList.innerHTML = '';
        statusContainer.innerHTML = '';
        
        // Check if wallet adapter is available
        if (!window.SolanaWalletAdapter) {
            this.showError('Wallet adapter not loaded');
            return;
        }
        
        // Get available wallets
        const availableWallets = window.SolanaWalletAdapter.getAvailableWallets();
        const allWallets = window.SolanaWalletAdapter.supportedWallets;
        
        console.log('Available wallets:', availableWallets);
        console.log('All wallets:', allWallets);
        
        // Show connection status if already connected
        const status = window.SolanaWalletAdapter.getConnectionStatus();
        if (status.connected) {
            this.showConnectedStatus(status);
        }
        
        // Render wallet list
        allWallets.forEach(wallet => {
            const isAvailable = availableWallets.some(aw => aw.adapter === wallet.adapter);
            const walletItem = this.createWalletItem(wallet, isAvailable);
            walletList.appendChild(walletItem);
        });
        
        // Show message if no wallets available
        if (availableWallets.length === 0) {
            this.showNoWalletsMessage();
        }
        
        // Debug: Check if wallet list has content
        console.log('Wallet list children:', walletList.children.length);
        console.log('Wallet list HTML:', walletList.innerHTML);
    }
    
    createWalletItem(wallet, isAvailable) {
        const item = document.createElement('div');
        item.className = `wallet-item ${isAvailable ? 'available' : 'not-available'}`;
        
        // Wallet icon
        const icon = document.createElement('div');
        icon.className = 'wallet-icon';
        icon.style.backgroundImage = `url(${wallet.icon})`;
        
        // Wallet info
        const info = document.createElement('div');
        info.className = 'wallet-info';
        
        const name = document.createElement('div');
        name.className = 'wallet-name';
        name.textContent = wallet.name;
        
        const status = document.createElement('div');
        status.className = `wallet-status ${isAvailable ? 'available' : 'not-available'}`;
        
        const statusIndicator = document.createElement('div');
        statusIndicator.className = `status-indicator ${isAvailable ? 'available' : ''}`;
        
        const statusText = document.createElement('span');
        statusText.textContent = isAvailable ? 'Available' : 'Not installed';
        
        status.appendChild(statusIndicator);
        status.appendChild(statusText);
        
        info.appendChild(name);
        info.appendChild(status);
        
        // Install link for unavailable wallets
        if (!isAvailable) {
            const installLink = document.createElement('a');
            installLink.className = 'wallet-install-link';
            installLink.href = wallet.url;
            installLink.target = '_blank';
            installLink.textContent = 'Install';
            status.appendChild(installLink);
        }
        
        item.appendChild(icon);
        item.appendChild(info);
        
        // Add click handler for available wallets
        if (isAvailable) {
            item.addEventListener('click', () => {
                this.connectWallet(wallet.adapter);
            });
        }
        
        return item;
    }
    
    async connectWallet(adapter) {
        if (!window.SolanaWalletAdapter) {
            this.showError('Wallet adapter not available');
            return;
        }
        
        try {
            // Show loading state
            this.showConnectingStatus();
            
            // Connect to wallet
            const result = await window.SolanaWalletAdapter.connect(adapter);
            
            // Show success
            this.showSuccess(`Connected to ${result.walletName}!`);
            
            // Close modal after delay
            setTimeout(() => {
                this.close();
                if (this.onWalletSelect) {
                    this.onWalletSelect(result);
                }
            }, 1500);
            
        } catch (error) {
            this.showError(`Connection failed: ${error.message}`);
        }
    }
    
    showConnectedStatus(status) {
        const statusContainer = document.getElementById('wallet-status-container');
        
        const connectedDiv = document.createElement('div');
        connectedDiv.className = 'connected-wallet';
        
        const info = document.createElement('div');
        info.className = 'connected-wallet-info';
        
        const name = document.createElement('div');
        name.className = 'connected-wallet-name';
        name.textContent = status.walletName.charAt(0).toUpperCase() + status.walletName.slice(1);
        
        const address = document.createElement('div');
        address.className = 'connected-wallet-address';
        address.textContent = `${status.publicKey.substring(0, 8)}...${status.publicKey.substring(status.publicKey.length - 8)}`;
        
        const disconnectBtn = document.createElement('button');
        disconnectBtn.className = 'disconnect-button';
        disconnectBtn.textContent = 'DISCONNECT';
        disconnectBtn.onclick = async () => {
            await window.SolanaWalletAdapter.disconnect();
            this.renderWallets();
        };
        
        info.appendChild(name);
        info.appendChild(address);
        
        connectedDiv.appendChild(info);
        connectedDiv.appendChild(disconnectBtn);
        
        statusContainer.appendChild(connectedDiv);
    }
    
    showConnectingStatus() {
        const statusContainer = document.getElementById('wallet-status-container');
        
        const connectingDiv = document.createElement('div');
        connectingDiv.className = 'connection-status connecting';
        connectingDiv.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
                <div style="width: 20px; height: 20px; border: 2px solid #ffaa00; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <span>Connecting to wallet...</span>
            </div>
        `;
        
        statusContainer.innerHTML = '';
        statusContainer.appendChild(connectingDiv);
    }
    
    showSuccess(message) {
        const statusContainer = document.getElementById('wallet-status-container');
        
        const successDiv = document.createElement('div');
        successDiv.className = 'wallet-success';
        successDiv.textContent = message;
        
        statusContainer.innerHTML = '';
        statusContainer.appendChild(successDiv);
    }
    
    showError(message) {
        const statusContainer = document.getElementById('wallet-status-container');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'wallet-error';
        errorDiv.textContent = message;
        
        statusContainer.innerHTML = '';
        statusContainer.appendChild(errorDiv);
    }
    
    showNoWalletsMessage() {
        const walletList = document.getElementById('wallet-list');
        
        const messageDiv = document.createElement('div');
        messageDiv.style.textAlign = 'center';
        messageDiv.style.padding = '2rem';
        messageDiv.style.color = '#ccc';
        
        messageDiv.innerHTML = `
            <h3 style="color: #ff0040; margin-bottom: 1rem;">No Wallets Found</h3>
            <p style="margin-bottom: 1rem;">Please install one of the supported wallets to continue:</p>
            <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">
                <a href="https://phantom.app/" target="_blank" style="color: #00ff41; text-decoration: none;">Phantom</a>
                <a href="https://solflare.com/" target="_blank" style="color: #00ff41; text-decoration: none;">Solflare</a>
                <a href="https://backpack.app/" target="_blank" style="color: #00ff41; text-decoration: none;">Backpack</a>
            </div>
        `;
        
        walletList.appendChild(messageDiv);
    }
}

// Create global instance
window.WalletModal = new WalletModal();
