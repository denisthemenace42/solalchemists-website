// 🔮 SOLalchemists Manual Social Media Verification System
// Users submit proof of engagement for manual verification

class ManualVerificationSystem {
    constructor() {
        this.verificationQueue = [];
        this.userProgress = {};
        this.rewards = {
            follow: 100,      // XP for following
            retweet: 50,      // XP for retweeting
            like: 10,         // XP for liking
            comment: 25,      // XP for commenting
            profilePic: 200,  // XP for profile picture
            bio: 150         // XP for bio mention
        };
        this.init();
    }

    async init() {
        console.log('🔮 Initializing Manual Verification System...');
        this.loadUserProgress();
        this.setupVerificationUI();
    }

    // Load user progress from localStorage
    loadUserProgress() {
        const saved = localStorage.getItem('solalchemists_progress');
        this.userProgress = saved ? JSON.parse(saved) : {};
    }

    // Save user progress to localStorage
    saveUserProgress() {
        localStorage.setItem('solalchemists_progress', JSON.stringify(this.userProgress));
    }

    // Setup verification UI
    setupVerificationUI() {
        const user = firebase.auth().currentUser;
        if (!user) return;

        const userId = user.uid;
        const progress = this.userProgress[userId] || {
            totalXP: 0,
            verified: {},
            pending: {},
            rewards: []
        };

        this.updateUI(progress);
    }

    // Show verification modal
    showVerificationModal(type) {
        const modal = document.createElement('div');
        modal.className = 'verification-modal';
        modal.innerHTML = `
            <div class="verification-content">
                <div class="verification-header">
                    <h3><i class="fas fa-check-circle"></i> Verify ${this.getTypeName(type)}</h3>
                    <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="verification-body">
                    <p>Please provide proof of your ${this.getTypeName(type).toLowerCase()}:</p>
                    
                    <div class="verification-options">
                        <div class="verification-option">
                            <input type="radio" id="screenshot" name="proof-type" value="screenshot" checked>
                            <label for="screenshot">
                                <i class="fas fa-image"></i> Screenshot
                            </label>
                        </div>
                        <div class="verification-option">
                            <input type="radio" id="link" name="proof-type" value="link">
                            <label for="link">
                                <i class="fas fa-link"></i> Tweet Link
                            </label>
                        </div>
                    </div>

                    <div class="proof-input">
                        <div id="screenshot-input" class="proof-section">
                            <label>Upload Screenshot:</label>
                            <input type="file" id="screenshot-file" accept="image/*" style="display: none;">
                            <button class="upload-btn" onclick="document.getElementById('screenshot-file').click()">
                                <i class="fas fa-upload"></i> Choose File
                            </button>
                            <div id="screenshot-preview" class="preview-area"></div>
                        </div>
                        
                        <div id="link-input" class="proof-section" style="display: none;">
                            <label>Tweet URL:</label>
                            <input type="url" id="tweet-link" placeholder="https://twitter.com/SOLalchemists/status/...">
                        </div>
                    </div>

                    <div class="verification-actions">
                        <button class="submit-btn" onclick="manualVerification.submitVerification('${type}')">
                            <i class="fas fa-paper-plane"></i> Submit for Verification
                        </button>
                        <button class="cancel-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup file upload preview
        document.getElementById('screenshot-file').addEventListener('change', this.handleFileUpload);
        
        // Setup radio button switching
        document.querySelectorAll('input[name="proof-type"]').forEach(radio => {
            radio.addEventListener('change', this.handleProofTypeChange);
        });
    }

    // Handle file upload preview
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('screenshot-preview');
                preview.innerHTML = `
                    <img src="${e.target.result}" alt="Screenshot Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
                `;
            };
            reader.readAsDataURL(file);
        }
    }

    // Handle proof type change
    handleProofTypeChange(event) {
        const screenshotInput = document.getElementById('screenshot-input');
        const linkInput = document.getElementById('link-input');
        
        if (event.target.value === 'screenshot') {
            screenshotInput.style.display = 'block';
            linkInput.style.display = 'none';
        } else {
            screenshotInput.style.display = 'none';
            linkInput.style.display = 'block';
        }
    }

    // Get type name for display
    getTypeName(type) {
        const names = {
            follow: 'Follow',
            retweet: 'Retweet',
            like: 'Like',
            comment: 'Comment',
            profilePic: 'Profile Picture',
            bio: 'Bio Mention'
        };
        return names[type] || type;
    }

    // Submit verification
    async submitVerification(type) {
        const user = firebase.auth().currentUser;
        if (!user) {
            showErrorMessage('Please connect with Twitter first!');
            return;
        }

        const userId = user.uid;
        const proofType = document.querySelector('input[name="proof-type"]:checked').value;
        
        let proof = '';
        if (proofType === 'screenshot') {
            const file = document.getElementById('screenshot-file').files[0];
            if (!file) {
                showErrorMessage('Please select a screenshot!');
                return;
            }
            proof = await this.fileToBase64(file);
        } else {
            const link = document.getElementById('tweet-link').value;
            if (!link) {
                showErrorMessage('Please enter a tweet link!');
                return;
            }
            proof = link;
        }

        // Add to verification queue
        const verification = {
            userId,
            type,
            proof,
            proofType,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        this.verificationQueue.push(verification);
        
        // Update user progress
        if (!this.userProgress[userId]) {
            this.userProgress[userId] = {
                totalXP: 0,
                verified: {},
                pending: {},
                rewards: []
            };
        }
        
        this.userProgress[userId].pending[type] = verification;
        this.saveUserProgress();
        this.updateUI(this.userProgress[userId]);

        // Close modal
        document.querySelector('.verification-modal').remove();
        
        showSuccessMessage('Verification submitted! We\'ll review it within 24 hours.');
        
        console.log('🔍 Verification submitted:', verification);
    }

    // Convert file to base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Update UI with user progress
    updateUI(progress) {
        // Update XP display
        const xpElement = document.getElementById('user-xp');
        if (xpElement) {
            xpElement.textContent = progress.totalXP;
        }

        // Update progress bar
        const progressBar = document.getElementById('xp-progress');
        if (progressBar) {
            const nextMilestone = this.getNextMilestone(progress.totalXP);
            const progressPercent = (progress.totalXP / nextMilestone) * 100;
            progressBar.style.width = `${Math.min(progressPercent, 100)}%`;
        }

        // Update engagement status
        this.updateEngagementStatus(progress);
    }

    // Get next milestone
    getNextMilestone(currentXP) {
        const milestones = [100, 500, 1000, 2500, 5000];
        return milestones.find(m => m > currentXP) || 5000;
    }

    // Update engagement status display
    updateEngagementStatus(progress) {
        const statusContainer = document.getElementById('engagement-status');
        if (!statusContainer) return;

        const engagementTypes = [
            { type: 'follow', icon: 'fab fa-twitter', text: 'Follow @SOLalchemists' },
            { type: 'retweet', icon: 'fas fa-retweet', text: 'Retweet posts' },
            { type: 'like', icon: 'fas fa-heart', text: 'Like posts' },
            { type: 'comment', icon: 'fas fa-comment', text: 'Comment on posts' }
        ];

        statusContainer.innerHTML = engagementTypes.map(item => {
            const isVerified = progress.verified[item.type];
            const isPending = progress.pending[item.type];
            let status = 'pending';
            let statusIcon = 'fas fa-clock';
            let statusColor = '#ffaa00';

            if (isVerified) {
                status = 'verified';
                statusIcon = 'fas fa-check';
                statusColor = '#00ff41';
            } else if (isPending) {
                status = 'pending';
                statusIcon = 'fas fa-clock';
                statusColor = '#ffaa00';
            } else {
                status = 'not-done';
                statusIcon = 'fas fa-times';
                statusColor = '#ff4444';
            }

            return `
                <div class="engagement-item ${status}" onclick="manualVerification.showVerificationModal('${item.type}')">
                    <i class="${item.icon}"></i>
                    <span>${item.text}</span>
                    <i class="${statusIcon}" style="color: ${statusColor};"></i>
                </div>
            `;
        }).join('');
    }

    // Admin function to approve verification (for you to use)
    approveVerification(userId, type) {
        const user = this.userProgress[userId];
        if (!user) return;

        // Remove from pending
        delete user.pending[type];
        
        // Add to verified
        user.verified[type] = true;
        
        // Award XP
        const xpGained = this.rewards[type];
        user.totalXP += xpGained;
        
        this.saveUserProgress();
        this.updateUI(user);
        
        console.log(`✅ Approved ${type} for user ${userId}. Awarded ${xpGained} XP.`);
        
        // Check milestones
        this.checkMilestones(userId);
    }

    // Check for milestone rewards
    checkMilestones(userId) {
        const user = this.userProgress[userId];
        const milestones = [100, 500, 1000, 2500, 5000];
        
        milestones.forEach(milestone => {
            if (user.totalXP >= milestone && !user.rewards.includes(`milestone_${milestone}`)) {
                this.grantMilestoneReward(userId, milestone);
            }
        });
    }

    // Grant milestone reward
    async grantMilestoneReward(userId, milestone) {
        const user = this.userProgress[userId];
        user.rewards.push(`milestone_${milestone}`);
        
        let rewardType = 'XP Bonus';
        let rewardAmount = milestone * 0.1;
        
        if (milestone >= 1000) {
            rewardType = 'Mystery NFT';
            rewardAmount = 1;
        }
        
        this.saveUserProgress();
        this.showRewardNotification(rewardType, rewardAmount, milestone);
        
        console.log(`🏆 Milestone ${milestone} reached! Reward: ${rewardAmount} ${rewardType}`);
    }

    // Show reward notification
    showRewardNotification(type, amount, milestone) {
        const notification = document.createElement('div');
        notification.className = 'reward-notification';
        notification.innerHTML = `
            <div class="reward-content">
                <i class="fas fa-trophy"></i>
                <h3>🏆 Milestone Reached!</h3>
                <p>You've earned ${amount} ${type} for reaching ${milestone} XP!</p>
                <button onclick="this.parentElement.parentElement.remove()">Claim</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Get verification queue (for admin)
    getVerificationQueue() {
        return this.verificationQueue.filter(v => v.status === 'pending');
    }

    // Export verification data (for admin)
    exportVerificationData() {
        return {
            queue: this.verificationQueue,
            userProgress: this.userProgress
        };
    }
}

// Initialize the manual verification system
let manualVerification;

// Initialize when Firebase auth is ready
firebase.auth().onAuthStateChanged((user) => {
    if (user && !manualVerification) {
        manualVerification = new ManualVerificationSystem();
    }
});

// Export for use in other files
window.manualVerification = manualVerification;
