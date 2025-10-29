/**
 * AuctionHouseSystem.js
 * Global auction house for buying/selling items.
 * All UI from Kenney + game-icons.net.
 */

export class AuctionHouseSystem {
  constructor() {
    this.listings = new Map();
    this.ui = {
      ah_window: '/assets/ui/auction/auction_house.png',            // Kenney UI Pack
      bid_button: '/assets/ui/auction/bid.png',                     // Kenney UI Pack
      buyout_button: '/assets/ui/auction/buyout.png'                // Kenney UI Pack
    };
    this.icons = {
      gold_coin: '/assets/icons/currency/gold.png',                 // game-icons.net
      silver_coin: '/assets/icons/currency/silver.png'              // game-icons.net
    };
  }

  listItem(sellerId, itemId, price, duration) {
    console.log(`${sellerId} lists ${itemId} for ${price} gold`);
    console.log(`  Icon: ${this.icons.gold_coin}`);
    this.listings.set(`listing_${Date.now()}`, { seller: sellerId, item: itemId, price: price, expiresAt: Date.now() + duration });
  }

  buyItem(buyerId, listingId) {
    console.log(`${buyerId} purchases listing ${listingId}`);
    this.listings.delete(listingId);
  }
}
