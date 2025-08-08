// 🔮 SOLalchemists Social Media Rewards System
// Tracks Twitter engagement and rewards users with XP/mints

class SocialRewardsSystem {
    constructor() {
        this.twitterApiKey = ''; // Add your Twitter API key
        this.rewards = {
            follow: 100,      // XP for following
            retweet: 50,      // XP for retweeting
            like: 10,         // XP for liking
            comment: 25,      // XP for commenting
            profilePic: 200,  // XP for profile picture
            bio: 150         // XP for bio mention
        };
        this.userProgress = {};
        this.init();
    }

    async init() {
        console.log('🔮 Initializing Social Rewards System...');
        this.loadUserProgress();
        await this.setupTwitterTracking();
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

    // Setup Twitter engagement tracking
    async setupTwitterTracking() {
        if (!this.twitterApiKey) {
            console.warn('⚠️ Twitter API key not configured');
            return;
        }

        // Check for user authentication
        const user = firebase.auth().currentUser;
        if (!user) {
            console.log('👤 No authenticated user found');
            return;
        }

        // Get user's Twitter handle from Firebase auth
        const twitterHandle = user.providerData.find(p => p.providerId === 'twitter.com')?.screenName;
        if (!twitterHandle) {
            console.log('🐦 No Twitter handle found for user');
            return;
        }

        console.log(`🔍 Setting up tracking for @${twitterHandle}`);
        await this.checkEngagement(twitterHandle);
    }

    // Check user's engagement with SOLalchemists
    async checkEngagement(twitterHandle) {
        try {
            const userId = firebase.auth().currentUser?.uid;
            if (!userId) return;

            const engagement = await this.getTwitterEngagement(twitterHandle);
            const newXP = this.calculateRewards(engagement);
            
            // Update user progress
            this.userProgress[userId] = {
                twitterHandle,
                totalXP: (this.userProgress[userId]?.totalXP || 0) + newXP,
                engagement,
                lastChecked: new Date().toISOString(),
                rewards: this.userProgress[userId]?.rewards || []
            };

            this.saveUserProgress();
            this.updateUI();
            
            console.log(`🎉 User earned ${newXP} XP! Total: ${this.userProgress[userId].totalXP}`);
            
            // Check for milestone rewards
            this.checkMilestones(userId);

        } catch (error) {
            console.error('❌ Error checking engagement:', error);
        }
    }

    // Get Twitter engagement data (simulated - replace with actual Twitter API)
    async getTwitterEngagement(twitterHandle) {
        // This is a simulation - replace with actual Twitter API calls
        const engagement = {
            follows: Math.random() > 0.5, // 50% chance of following
            retweets: Math.floor(Math.random() * 3), // 0-2 retweets
            likes: Math.floor(Math.random() * 10), // 0-9 likes
            comments: Math.floor(Math.random() * 2), // 0-1 comments
            profilePic: Math.random() > 0.7, // 30% chance of profile pic
            bio: Math.random() > 0.8 // 20% chance of bio mention
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return engagement;
    }

    // Calculate XP rewards based on engagement
    calculateRewards(engagement) {
        let totalXP = 0;
        
        if (engagement.follows) totalXP += this.rewards.follow;
        totalXP += engagement.retweets * this.rewards.retweet;
        totalXP += engagement.likes * this.rewards.like;
        totalXP += engagement.comments * this.rewards.comment;
        if (engagement.profilePic) totalXP += this.rewards.profilePic;
        if (engagement.bio) totalXP += this.rewards.bio;

        return totalXP;
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
        let rewardAmount = milestone * 0.1; // 10% bonus
        
        // Special rewards for higher milestones
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
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Update UI with user progress
    updateUI() {
        const user = firebase.auth().currentUser;
        if (!user) return;

        const progress = this.userProgress[user.uid];
        if (!progress) return;

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

        // Show engagement status
        this.updateEngagementStatus(progress.engagement);
    }

    // Get next milestone
    getNextMilestone(currentXP) {
        const milestones = [100, 500, 1000, 2500, 5000];
        return milestones.find(m => m > currentXP) || 5000;
    }

    // Update engagement status display
    updateEngagementStatus(engagement) {
        const statusContainer = document.getElementById('engagement-status');
        if (!statusContainer) return;

        statusContainer.innerHTML = `
            <div class="engagement-item ${engagement.follows ? 'completed' : ''}">
                <i class="fab fa-twitter"></i>
                <span>Follow @SOLalchemists</span>
                <i class="fas fa-${engagement.follows ? 'check' : 'times'}"></i>
            </div>
            <div class="engagement-item ${engagement.retweets > 0 ? 'completed' : ''}">
                <i class="fas fa-retweet"></i>
                <span>Retweet (${engagement.retweets})</span>
                <i class="fas fa-${engagement.retweets > 0 ? 'check' : 'times'}"></i>
            </div>
            <div class="engagement-item ${engagement.likes > 0 ? 'completed' : ''}">
                <i class="fas fa-heart"></i>
                <span>Like posts (${engagement.likes})</span>
                <i class="fas fa-${engagement.likes > 0 ? 'check' : 'times'}"></i>
            </div>
            <div class="engagement-item ${engagement.comments > 0 ? 'completed' : ''}">
                <i class="fas fa-comment"></i>
                <span>Comment (${engagement.comments})</span>
                <i class="fas fa-${engagement.comments > 0 ? 'check' : 'times'}"></i>
            </div>
        `;
    }

    // Manual refresh engagement
    async refreshEngagement() {
        const user = firebase.auth().currentUser;
        if (!user) {
            showErrorMessage('Please connect with Twitter first!');
            return;
        }

        const twitterHandle = user.providerData.find(p => p.providerId === 'twitter.com')?.screenName;
        if (!twitterHandle) {
            showErrorMessage('No Twitter handle found. Please reconnect with Twitter.');
            return;
        }

        showSuccessMessage('Checking your engagement...');
        await this.checkEngagement(twitterHandle);
        showSuccessMessage('Engagement updated! Check your rewards.');
    }

    // Get user's current progress
    getUserProgress() {
        const user = firebase.auth().currentUser;
        if (!user) return null;
        
        return this.userProgress[user.uid] || null;
    }
}

// Initialize the rewards system
let socialRewards;

// Initialize when Firebase auth is ready
firebase.auth().onAuthStateChanged((user) => {
    if (user && !socialRewards) {
        socialRewards = new SocialRewardsSystem();
    }
});

// Export for use in other files
window.socialRewards = socialRewards;
window.refreshEngagement = () => socialRewards?.refreshEngagement();
