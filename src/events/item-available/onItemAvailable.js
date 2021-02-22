import { itemAvailableEventEmitter } from './itemAvailable.event-emitter.js';
import { blinkLights } from '../../notification/index.js';

itemAvailableEventEmitter.on('ITEM_AVAILABLE', function onItemAvailable(itemAvailableEvent) {
  console.log(`✅✅✅✅✅✅ Available items ✅✅✅✅✅✅`);
  console.log('😱😱😱😱😱😱 PLEASE FINALIZE THE PURCHASE! 😱😱😱😱😱😱');
  console.log(`Item from ${itemAvailableEvent.companyName} available at ${itemAvailableEvent.url}`);

  blinkLights();
});
