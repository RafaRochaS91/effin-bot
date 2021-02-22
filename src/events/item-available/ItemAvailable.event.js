export class ItemAvailableEvent {
  constructor({ companyName, url }) {
    this.companyName = companyName;
    this.url = url;
  }
}
