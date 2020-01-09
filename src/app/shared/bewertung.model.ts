export class Bewertung {
  // id must be the same as the item id
  constructor(public itemID: number, public autor: string, public text: string, public url: string, public stars: number) { }
}