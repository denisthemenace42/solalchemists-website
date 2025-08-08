#!/usr/bin/env python3

def generate_carousel_html():
    html_parts = []
    
    # Missing NFTs that we need to skip
    missing_nfts = [11, 12, 14, 15, 19, 93]
    
    # Pattern: NFT1, Mystery, NFT2, NFT3, Mystery, NFT4, NFT5, Mystery, etc.
    for i in range(1, 111):
        # Skip missing NFTs
        if i in missing_nfts:
            continue
            
        # Add NFT
        html_parts.append(f'''                        <div class="carousel-item">
                            <img src="images/nft{i}.png" 
                                 alt="SOLalchemist NFT {i}" 
                                 class="carousel-nft"
                                 onload="console.log('✅ NFT {i} loaded successfully'); this.style.border='3px solid #00ff00';"
                                 onerror="console.log('❌ NFT {i} failed to load'); this.style.background='#ff0080'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.style.color='#fff'; this.style.fontWeight='bold'; this.style.fontSize='16px'; this.innerHTML='SOLalchemist #{i}'; this.style.border='3px solid #ff0000';">
                        </div>''')
        
        # Add mystery after every 1-2 NFTs (pattern: after 1, 3, 5, 7, 9, etc.)
        # But only if the next NFT exists and it's not the last one
        if i % 2 == 1:
            next_nft = i + 1
            # Check if next NFT exists and we're not at the end
            if next_nft <= 110 and next_nft not in missing_nfts:
                html_parts.append(f'''                        <div class="carousel-item">
                            <img src="images/mystery.png" 
                                 alt="Mystery NFT" 
                                 class="carousel-nft"
                                 onload="console.log('✅ Mystery NFT loaded successfully'); this.style.border='3px solid #00ff00';"
                                 onerror="console.log('❌ Mystery NFT failed to load'); this.style.background='#ffff00'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.style.color='#000'; this.style.fontWeight='bold'; this.style.fontSize='16px'; this.innerHTML='MYSTERY'; this.style.border='3px solid #ff0000';">
                        </div>''')
    
    return '\n'.join(html_parts)

if __name__ == "__main__":
    carousel_html = generate_carousel_html()
    print("<!-- Complete NFT Collection (104 available NFTs) with Mystery Interspersed -->")
    print(carousel_html)
