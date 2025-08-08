#!/usr/bin/env python3
"""
SOLalchemists Whitelist Backend
Handles whitelist submissions and provides API endpoints
"""

import json
import csv
import os
from datetime import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

# File paths
WHITELIST_FILE = 'whitelist_data.json'
WHITELIST_CSV = 'whitelist_export.csv'
BACKUP_DIR = 'whitelist_backups'

# Ensure backup directory exists
os.makedirs(BACKUP_DIR, exist_ok=True)

def load_whitelist():
    """Load whitelist data from JSON file"""
    if os.path.exists(WHITELIST_FILE):
        with open(WHITELIST_FILE, 'r') as f:
            return json.load(f)
    return []

def save_whitelist(whitelist):
    """Save whitelist data to JSON file"""
    with open(WHITELIST_FILE, 'w') as f:
        json.dump(whitelist, f, indent=2)

def backup_whitelist():
    """Create a backup of the whitelist data"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_file = os.path.join(BACKUP_DIR, f'whitelist_backup_{timestamp}.json')
    
    if os.path.exists(WHITELIST_FILE):
        with open(WHITELIST_FILE, 'r') as f:
            data = json.load(f)
        with open(backup_file, 'w') as f:
            json.dump(data, f, indent=2)
        return backup_file
    return None

def validate_solana_address(address):
    """Validate Solana wallet address format"""
    # Basic Solana address validation (32-44 characters, base58)
    pattern = r'^[1-9A-HJ-NP-Za-km-z]{32,44}$'
    return bool(re.match(pattern, address))

def validate_twitter_handle(handle):
    """Validate Twitter handle format"""
    # Remove @ if present and validate
    handle = handle.lstrip('@')
    pattern = r'^[A-Za-z0-9_]{1,15}$'
    return bool(re.match(pattern, handle))

def validate_discord_handle(handle):
    """Validate Discord handle format"""
    # Format: username#1234 or username
    pattern = r'^[A-Za-z0-9_]{2,32}(#[0-9]{4})?$'
    return bool(re.match(pattern, handle))

def export_to_csv():
    """Export whitelist data to CSV"""
    whitelist = load_whitelist()
    
    if not whitelist:
        return False
    
    with open(WHITELIST_CSV, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['wallet_address', 'twitter_handle', 'discord_handle', 'email', 'timestamp']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        for entry in whitelist:
            writer.writerow({
                'wallet_address': entry.get('walletAddress', ''),
                'twitter_handle': entry.get('twitterHandle', ''),
                'discord_handle': entry.get('discordHandle', ''),
                'email': entry.get('email', ''),
                'timestamp': entry.get('timestamp', '')
            })
    
    return True

@app.route('/api/whitelist/submit', methods=['POST'])
def submit_whitelist():
    """Submit a new whitelist entry"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['walletAddress', 'twitterHandle', 'discordHandle']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        wallet_address = data['walletAddress'].strip()
        twitter_handle = data['twitterHandle'].strip()
        discord_handle = data['discordHandle'].strip()
        email = data.get('email', '').strip()
        
        # Validate wallet address
        if not validate_solana_address(wallet_address):
            return jsonify({'error': 'Invalid Solana wallet address'}), 400
        
        # Validate Twitter handle
        if not validate_twitter_handle(twitter_handle.lstrip('@')):
            return jsonify({'error': 'Invalid Twitter handle'}), 400
        
        # Validate Discord handle
        if not validate_discord_handle(discord_handle):
            return jsonify({'error': 'Invalid Discord handle'}), 400
        
        # Load existing whitelist
        whitelist = load_whitelist()
        
        # Check for duplicate wallet address
        if any(entry['walletAddress'] == wallet_address for entry in whitelist):
            return jsonify({'error': 'Wallet address already registered'}), 409
        
        # Create new entry
        new_entry = {
            'walletAddress': wallet_address,
            'twitterHandle': twitter_handle if twitter_handle.startswith('@') else f'@{twitter_handle}',
            'discordHandle': discord_handle,
            'email': email,
            'timestamp': datetime.now().isoformat(),
            'status': 'pending'
        }
        
        # Add to whitelist
        whitelist.append(new_entry)
        save_whitelist(whitelist)
        
        # Create backup
        backup_whitelist()
        
        return jsonify({
            'success': True,
            'message': 'Successfully added to whitelist',
            'total_entries': len(whitelist)
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/whitelist/list', methods=['GET'])
def get_whitelist():
    """Get all whitelist entries (admin only)"""
    try:
        whitelist = load_whitelist()
        return jsonify({
            'success': True,
            'total_entries': len(whitelist),
            'entries': whitelist
        }), 200
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/whitelist/check/<wallet_address>', methods=['GET'])
def check_whitelist(wallet_address):
    """Check if a wallet address is in the whitelist"""
    try:
        whitelist = load_whitelist()
        is_whitelisted = any(entry['walletAddress'] == wallet_address for entry in whitelist)
        
        return jsonify({
            'success': True,
            'wallet_address': wallet_address,
            'is_whitelisted': is_whitelisted
        }), 200
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/whitelist/export', methods=['GET'])
def export_whitelist():
    """Export whitelist to CSV"""
    try:
        if export_to_csv():
            return send_file(
                WHITELIST_CSV,
                as_attachment=True,
                download_name=f'whitelist_export_{datetime.now().strftime("%Y%m%d")}.csv'
            )
        else:
            return jsonify({'error': 'No whitelist data to export'}), 404
    except Exception as e:
        return jsonify({'error': f'Export error: {str(e)}'}), 500

@app.route('/api/whitelist/stats', methods=['GET'])
def get_stats():
    """Get whitelist statistics"""
    try:
        whitelist = load_whitelist()
        
        # Calculate stats
        total_entries = len(whitelist)
        with_email = len([entry for entry in whitelist if entry.get('email')])
        
        # Group by date
        dates = {}
        for entry in whitelist:
            date = entry['timestamp'][:10]  # YYYY-MM-DD
            dates[date] = dates.get(date, 0) + 1
        
        return jsonify({
            'success': True,
            'stats': {
                'total_entries': total_entries,
                'with_email': with_email,
                'without_email': total_entries - with_email,
                'daily_registrations': dates
            }
        }), 200
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/whitelist/backup', methods=['POST'])
def create_backup():
    """Create a manual backup"""
    try:
        backup_file = backup_whitelist()
        if backup_file:
            return jsonify({
                'success': True,
                'message': 'Backup created successfully',
                'backup_file': backup_file
            }), 200
        else:
            return jsonify({'error': 'No data to backup'}), 404
    except Exception as e:
        return jsonify({'error': f'Backup error: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'whitelist_entries': len(load_whitelist())
    }), 200

if __name__ == '__main__':
    print("🚀 Starting SOLalchemists Whitelist Backend...")
    print(f"📊 Whitelist file: {WHITELIST_FILE}")
    print(f"💾 Backup directory: {BACKUP_DIR}")
    
    # Load existing data
    whitelist = load_whitelist()
    print(f"📋 Loaded {len(whitelist)} existing entries")
    
    # Start server
    app.run(host='0.0.0.0', port=5000, debug=True)
