# SOLalchemists Whitelist System

A comprehensive whitelist management system for free Mystery Alchemist NFT mints.

## 🚀 Features

- **User Registration**: Collect wallet addresses, social media handles, and emails
- **Validation**: Real-time validation of Solana addresses, Twitter handles, and Discord handles
- **Admin Dashboard**: View, search, and manage whitelist entries
- **Data Export**: Export whitelist data to CSV format
- **Automatic Backups**: Automatic backup creation for data safety
- **Statistics**: Real-time statistics and analytics
- **Responsive Design**: Works on desktop and mobile devices

## 📁 File Structure

```
reveal-website/
├── whitelist.html          # User registration page
├── admin.html              # Admin dashboard
├── whitelist_backend.py    # Python Flask backend
├── requirements.txt        # Python dependencies
├── whitelist_data.json    # Whitelist data (auto-generated)
├── whitelist_export.csv   # CSV export (auto-generated)
└── whitelist_backups/     # Backup directory (auto-generated)
```

## 🛠️ Setup Instructions

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Start the Backend Server

```bash
python3 whitelist_backend.py
```

The backend will start on `http://localhost:5000`

### 3. Start the Frontend Server

```bash
python3 -m http.server 58111
```

### 4. Access the System

- **User Registration**: `http://localhost:58111/whitelist.html`
- **Admin Dashboard**: `http://localhost:58111/admin.html`
- **Main Website**: `http://localhost:58111/index.html`

## 📊 API Endpoints

### User Endpoints

- `POST /api/whitelist/submit` - Submit new whitelist entry
- `GET /api/whitelist/check/<wallet_address>` - Check if wallet is whitelisted

### Admin Endpoints

- `GET /api/whitelist/list` - Get all whitelist entries
- `GET /api/whitelist/stats` - Get whitelist statistics
- `GET /api/whitelist/export` - Export whitelist to CSV
- `POST /api/whitelist/backup` - Create manual backup
- `GET /health` - Health check

## 🔧 Configuration

### Backend Configuration

Edit `whitelist_backend.py` to modify:

- **Port**: Change `app.run(port=5000)` to your preferred port
- **Host**: Change `app.run(host='0.0.0.0')` for external access
- **File Paths**: Modify `WHITELIST_FILE`, `WHITELIST_CSV`, `BACKUP_DIR`

### Frontend Configuration

Edit the API base URL in `admin.html` and `whitelist.html`:

```javascript
const API_BASE = 'http://localhost:5000/api';
```

## 📝 Usage

### For Users

1. Visit `whitelist.html`
2. Enter your Solana wallet address
3. Provide Twitter/X handle (with @)
4. Provide Discord handle
5. Optionally add email address
6. Click "JOIN WHITELIST"

### For Admins

1. Visit `admin.html`
2. View real-time statistics
3. Browse all whitelist entries
4. Search for specific entries
5. Export data to CSV
6. Create manual backups

## 🔒 Security Features

- **Input Validation**: All inputs are validated server-side
- **Duplicate Prevention**: One entry per wallet address
- **Data Sanitization**: Prevents injection attacks
- **Automatic Backups**: Data is automatically backed up
- **CORS Protection**: Configured for secure cross-origin requests

## 📈 Data Management

### Data Storage

- **Primary**: `whitelist_data.json` (JSON format)
- **Backups**: `whitelist_backups/` directory
- **Exports**: `whitelist_export.csv` (CSV format)

### Backup Strategy

- **Automatic**: Created on each new submission
- **Manual**: Available via admin dashboard
- **Timestamped**: Each backup includes timestamp

## 🎨 Customization

### Styling

The system uses CSS variables for easy customization:

```css
:root {
    --neon-green: #00ff41;
    --neon-blue: #00ffff;
    --dark-bg: #0a0a0a;
}
```

### Branding

- Update logos and icons in HTML files
- Modify color scheme in CSS
- Change text content for your project

## 🚨 Troubleshooting

### Common Issues

1. **Backend won't start**: Check if port 5000 is available
2. **CORS errors**: Ensure backend is running on correct port
3. **Data not saving**: Check file permissions in directory
4. **Validation errors**: Verify input format requirements

### Logs

Check the terminal where you started the backend for error messages and logs.

## 🔄 Integration with NFT Mint

### For Smart Contract Integration

1. Export whitelist data to CSV
2. Use the wallet addresses in your smart contract
3. Implement whitelist checking in mint function

### Example Solana Program Integration

```javascript
// Check if wallet is whitelisted
const isWhitelisted = whitelistAddresses.includes(userWalletAddress);
if (!isWhitelisted) {
    throw new Error("Wallet not in whitelist");
}
```

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review the API documentation
- Ensure all dependencies are installed
- Verify file permissions

## 🔄 Updates

To update the system:

1. Backup your current data
2. Update the files
3. Restart the backend server
4. Test functionality

---

**Note**: This system is designed for development and testing. For production use, consider:
- Adding authentication to admin dashboard
- Implementing rate limiting
- Using a production database
- Adding SSL/TLS encryption
- Setting up proper logging
