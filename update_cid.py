import json
import os
import glob

# Your actual folder CID from Web3.Storage
FOLDER_CID = "bafybeibwozxicevxmwjdqe3yhivglneierhkp5k7xlp2ak3wvr5c2an3my"

# Path to your metadata folder
METADATA_FOLDER = "/Users/belqta/hashlips_art_engine/build/json"

def update_metadata_files():
    # Get all JSON files in the metadata folder
    json_files = glob.glob(os.path.join(METADATA_FOLDER, "*.json"))
    
    updated_count = 0
    
    for json_file in json_files:
        try:
            # Read the JSON file
            with open(json_file, 'r') as f:
                data = json.load(f)
            
            # Update the image URL with the CID
            if 'image' in data:
                # Extract filename from current image path
                current_image = data['image']
                filename = current_image.split('/')[-1]  # Get just the filename
                
                # Create new IPFS URL
                new_image_url = f"ipfs://{FOLDER_CID}/{filename}"
                data['image'] = new_image_url
                
                # Write back to file
                with open(json_file, 'w') as f:
                    json.dump(data, f, indent=2)
                
                print(f"Updated {os.path.basename(json_file)}: {new_image_url}")
                updated_count += 1
            else:
                print(f"No 'image' field found in {os.path.basename(json_file)}")
                
        except Exception as e:
            print(f"Error processing {os.path.basename(json_file)}: {e}")
    
    print(f"\n✅ Successfully updated {updated_count} metadata files!")
    print(f"📁 All files now use CID: {FOLDER_CID}")

if __name__ == "__main__":
    print("🚀 Starting metadata update...")
    print(f"Using CID: {FOLDER_CID}")
    print(f"Looking in folder: {METADATA_FOLDER}")
    print(f"Found {len(glob.glob(os.path.join(METADATA_FOLDER, '*.json')))} JSON files")
    print("-" * 60)
    
    update_metadata_files() 