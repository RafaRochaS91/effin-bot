# effin-bot
A bot to be able to buy eletronics in this day and age of Bots.

### Attention
Before running the bot, make sure to only add unavailable items that you'd like to buy on your Wishlist. The bot will keep refreshing the Wishlist page and add any available item to your cart. On Mediamarkt and Saturn it will try to finalize the purchase given you inserted your credit card information in the `.env` file.

If more than one item became available at the same time, the bot will only add the one that was later added to the Wishlist. Therefore, prioritize your items according to the order you insert them in the cart.

### Environment Variables
Please create a `.env` file and paste the content from `.env.template` while replacing the relevant variables.

### Starting the bot
```shell
// run the bot on all supported stores
yarn all

// run the bot only on amazon
yarn amazon

// run the bot only on mediamarkt
yarn mediamarkt

// run the bot only on saturn
yarn saturn
```
