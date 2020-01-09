import { Item } from './item.model';
import { MainCategory, SubCategory, Category } from './category.model';
import { Bewertung } from './bewertung.model';
import { Shop } from './shop.model';
import { Naehrwert } from './naehrwert.model';
import { ShopService } from './shop.service';

export class ItemService {

  // Current loaded items from backend that are available to user 
  private items: Item[] = [
    new Item(1,
      'Whey Perfection',
      '23 Gramm hochwertiges Whey Protein, 5 Gramm BCAAs und 3,6 Gramm L-Glutamin',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam maecenas ultricies mi eget mauris pharetra et. Erat velit scelerisque in dictum non consectetur a. Varius quam quisque id diam vel quam elementum pulvinar. Dui id ornare arcu odio ut sem nulla pharetra diam. Vestibulum morbi blandit cursus risus at ultrices mi tempus imperdiet. Donec ultrices tincidunt arcu non sodales. Eget velit aliquet sagittis id. Risus quis varius quam quisque. Donec et odio pellentesque diam volutpat commodo sed.',
      [new Bewertung(1, 'Gannikus', 'Krasseste Maschinenprodukt wo gibt.', 'https://gannikus.de', 4.6)],
      '../assets/img/whey-perfection.webp',
      '../assets/img/whey-perfection-label.webp',
      new SubCategory('Whey Protein'),
      ['Vanille', 'Schoko'],
      ['milch'],
      new Naehrwert(189, 6, 35, 35),
      1
    ),
    new Item(2,
      'Gold Standard Whey',
      'Gold Standard Whey ist weltweit seit über 20 Jahren die Nummer eins unter den Proteinpulvern.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam maecenas ultricies mi eget mauris pharetra et. Erat velit scelerisque in dictum non consectetur a. Varius quam quisque id diam vel quam elementum pulvinar. Dui id ornare arcu odio ut sem nulla pharetra diam. Vestibulum morbi blandit cursus risus at ultrices mi tempus imperdiet. Donec ultrices tincidunt arcu non sodales. Eget velit aliquet sagittis id. Risus quis varius quam quisque. Donec et odio pellentesque diam volutpat commodo sed.',
      [new Bewertung(2, 'Gannikus', 'Krasseste Maschinenprodukt wo gibt.', 'https://gannikus.de', 4.6)],
      '../assets/img/gold-standard.webp',
      '../assets/img/whey-perfection-label.webp',
      new SubCategory('Whey Protein'),
      ['Vanille', 'Schoko'],
      ['milch'],
      new Naehrwert(189, 6, 35, 35),
      2
    ),
    new Item(3,
      'Smart Protein',
      'Unser absoluter Proteinshake Nummer 1 in jeder Low Carb- und Proteindiät!',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam maecenas ultricies mi eget mauris pharetra et. Erat velit scelerisque in dictum non consectetur a. Varius quam quisque id diam vel quam elementum pulvinar. Dui id ornare arcu odio ut sem nulla pharetra diam. Vestibulum morbi blandit cursus risus at ultrices mi tempus imperdiet. Donec ultrices tincidunt arcu non sodales. Eget velit aliquet sagittis id. Risus quis varius quam quisque. Donec et odio pellentesque diam volutpat commodo sed.',
      [new Bewertung(3, 'Gannikus', 'Krasseste Maschinenprodukt wo gibt.', 'https://gannikus.de', 4.6)],
      '../assets/img/smart-protein.webp',
      '../assets/img/whey-perfection-label.webp',
      new SubCategory('Whey Protein'),
      ['Vanille', 'Schoko'],
      ['milch'],
      new Naehrwert(189, 6, 35, 35),
      9
    ),
    new Item(4,
      'Amino Perfection',
      'Unser absoluter Proteinshake Nummer 1 in jeder Low Carb- und Proteindiät!',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam maecenas ultricies mi eget mauris pharetra et. Erat velit scelerisque in dictum non consectetur a. Varius quam quisque id diam vel quam elementum pulvinar. Dui id ornare arcu odio ut sem nulla pharetra diam. Vestibulum morbi blandit cursus risus at ultrices mi tempus imperdiet. Donec ultrices tincidunt arcu non sodales. Eget velit aliquet sagittis id. Risus quis varius quam quisque. Donec et odio pellentesque diam volutpat commodo sed.',
      [new Bewertung(4, 'Gannikus', 'Krasseste Maschinenprodukt wo gibt.', 'https://gannikus.de', 4.6)],
      '../assets/img/amino-perfection.webp',
      '../assets/img/whey-perfection-label.webp',
      new SubCategory('BCAA'),
      ['Vanille'],
      ['milch'],
      new Naehrwert(189, 6, 35, 35),
      3
    ),
    new Item(5,
      'Smart Protein',
      'Unser absoluter Proteinshake Nummer 1 in jeder Low Carb- und Proteindiät!',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam maecenas ultricies mi eget mauris pharetra et. Erat velit scelerisque in dictum non consectetur a. Varius quam quisque id diam vel quam elementum pulvinar. Dui id ornare arcu odio ut sem nulla pharetra diam. Vestibulum morbi blandit cursus risus at ultrices mi tempus imperdiet. Donec ultrices tincidunt arcu non sodales. Eget velit aliquet sagittis id. Risus quis varius quam quisque. Donec et odio pellentesque diam volutpat commodo sed.',
      [new Bewertung(5, 'Gannikus', 'Krasseste Maschinenprodukt wo gibt.', 'https://gannikus.de', 4.6)],
      '../assets/img/arginine.webp',
      '../assets/img/whey-perfection-label.webp',
      new SubCategory('Whey Protein'),
      ['Vanille', 'Schoko'],
      ['milch'],
      new Naehrwert(189, 6, 35, 35),
      7
    ),
    new Item(6,
      'L-Glutamine',
      'Unser absoluter Proteinshake Nummer 1 in jeder Low Carb- und Proteindiät!',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam maecenas ultricies mi eget mauris pharetra et. Erat velit scelerisque in dictum non consectetur a. Varius quam quisque id diam vel quam elementum pulvinar. Dui id ornare arcu odio ut sem nulla pharetra diam. Vestibulum morbi blandit cursus risus at ultrices mi tempus imperdiet. Donec ultrices tincidunt arcu non sodales. Eget velit aliquet sagittis id. Risus quis varius quam quisque. Donec et odio pellentesque diam volutpat commodo sed.',
      [new Bewertung(6, 'Gannikus', 'Krasseste Maschinenprodukt wo gibt.', 'https://gannikus.de', 4.6)],
      '../assets/img/l-glutamine.webp',
      '../assets/img/whey-perfection-label.webp',
      new SubCategory('Glutamin'),
      ['Vanille', 'Schoko'],
      ['milch'],
      new Naehrwert(189, 6, 35, 35),
      6
    ),
    new Item(7,
      'Pink Pizza',
      'Unser absoluter Proteinshake Nummer 1 in jeder Low Carb- und Proteindiät!',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam maecenas ultricies mi eget mauris pharetra et. Erat velit scelerisque in dictum non consectetur a. Varius quam quisque id diam vel quam elementum pulvinar. Dui id ornare arcu odio ut sem nulla pharetra diam. Vestibulum morbi blandit cursus risus at ultrices mi tempus imperdiet. Donec ultrices tincidunt arcu non sodales. Eget velit aliquet sagittis id. Risus quis varius quam quisque. Donec et odio pellentesque diam volutpat commodo sed.',
      [new Bewertung(7, 'Gannikus', 'Krasseste Maschinenprodukt wo gibt.', 'https://gannikus.de', 4.6)],
      '../assets/img/pinkPizza.jpg',
      '../assets/img/whey-perfection-label.webp',
      new SubCategory('Pizza \& Pasta'),
      ['Vanille', 'Schoko'],
      ['milch'],
      new Naehrwert(189, 6, 35, 35),
      5
    ),
    new Item(8,
      'Skinny Pasta',
      'Unser absoluter Proteinshake Nummer 1 in jeder Low Carb- und Proteindiät!',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam maecenas ultricies mi eget mauris pharetra et. Erat velit scelerisque in dictum non consectetur a. Varius quam quisque id diam vel quam elementum pulvinar. Dui id ornare arcu odio ut sem nulla pharetra diam. Vestibulum morbi blandit cursus risus at ultrices mi tempus imperdiet. Donec ultrices tincidunt arcu non sodales. Eget velit aliquet sagittis id. Risus quis varius quam quisque. Donec et odio pellentesque diam volutpat commodo sed.',
      [new Bewertung(8, 'Gannikus', 'Krasseste Maschinenprodukt wo gibt.', 'https://gannikus.de', 4.6)],
      '../assets/img/skinnyPasta.jpg',
      '../assets/img/whey-perfection-label.webp',
      new SubCategory('Pizza \& Pasta'),
      ['Vanille', 'Schoko'],
      ['milch'],
      new Naehrwert(189, 6, 35, 35),
      8
    ),
    new Item(9,
      'Smart Protein Drink',
      'Unser absoluter Proteinshake Nummer 1 in jeder Low Carb- und Proteindiät!',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam maecenas ultricies mi eget mauris pharetra et. Erat velit scelerisque in dictum non consectetur a. Varius quam quisque id diam vel quam elementum pulvinar. Dui id ornare arcu odio ut sem nulla pharetra diam. Vestibulum morbi blandit cursus risus at ultrices mi tempus imperdiet. Donec ultrices tincidunt arcu non sodales. Eget velit aliquet sagittis id. Risus quis varius quam quisque. Donec et odio pellentesque diam volutpat commodo sed.',
      [new Bewertung(9, 'Gannikus', 'Krasseste Maschinenprodukt wo gibt.', 'https://gannikus.de', 4.6)],
      '../assets/img/smart-protein-drinks.webp',
      '../assets/img/whey-perfection-label.webp',
      new SubCategory('Protein Drinks'),
      ['Vanille', 'Schoko'],
      ['milch'],
      new Naehrwert(89, 6, 35, 350),
      4
    ),
    new Item(10,
      'Low Calorie Meal',
      'Unser absoluter Proteinshake Nummer 1 in jeder Low Carb- und Proteindiät!',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam maecenas ultricies mi eget mauris pharetra et. Erat velit scelerisque in dictum non consectetur a. Varius quam quisque id diam vel quam elementum pulvinar. Dui id ornare arcu odio ut sem nulla pharetra diam. Vestibulum morbi blandit cursus risus at ultrices mi tempus imperdiet. Donec ultrices tincidunt arcu non sodales. Eget velit aliquet sagittis id. Risus quis varius quam quisque. Donec et odio pellentesque diam volutpat commodo sed.',
      [new Bewertung(10, 'Gannikus', 'Krasseste Maschinenprodukt wo gibt.', 'https://gannikus.de', 4.6)],
      '../assets/img/low-calorie-meal.webp',
      '../assets/img/whey-perfection-label.webp',
      new SubCategory('Mahlzeitenersatz'),
      ['Vanille', 'Schoko'],
      ['erdnuesse'],
      new Naehrwert(1289, 60, 350, 325),
      10
    ),
  ];

  /**
   * Get list of all loaded items
   */
  getItems() {
    return this.items.slice();
  }

  /**
   * Get item with given name
   * @param name 
   */
  getItem(name: string) {
    return this.items.find(i => i.name === name);
  }

  /**
   * Get item with given id
   * @param id 
   */
  getItemById(id: number) {
    return this.items.find(i => i.id === id);
  }

  /**
   * Get all items in given category
   * @param category 
   */
  getCategoryItems(category: Category) {
    // As long as category is not SubCategory it invokes getCategoryItems on all subcategories 
    if (category instanceof MainCategory) {
      let filtered_items = [];
      for (var sub_category of category.subCategories) {
        filtered_items = filtered_items.concat(this.getCategoryItems(sub_category));
      }
      return filtered_items;
    } else {
      return this.items.filter(i => i.category.name === category.name);
    }
  }

  /**
   * Get durchschnittsbewertung of item with given id by calculating the mean 
   * of all ratings of the shops in the shop property of the item 
   * @param id 
   */
  getDurchschnittsBewertung(id: number) {
    let filtered_item = this.items.find(i => i.id === id);
    let durchschnitts_bewertung = 0;
    let anzahl_bewertungen = filtered_item.bewertungen.length;
    for (var bewertung of filtered_item.bewertungen) {
      durchschnitts_bewertung += bewertung.stars;
    }
    return durchschnitts_bewertung / anzahl_bewertungen;
  }

  /**
   * Get all shops in given category
   * @param category 
   */
  getShopsInCategory(category: Category) {
    // Get all items in category
    const categoryItems: Item[] = this.getCategoryItems(category);
    // Store all shop ids of the items in category
    let shopIDs = new Set<number>([]);

    // Iterate over all items in category to extract all shop ids in them
    for (var item of categoryItems) {
      for (var shopID of item.shops) {
        shopIDs.add(shopID);
      }
    }

    // Return shop ids
    return Array.from(shopIDs);
  }

  /**
   * Get all geschmaecker in given category 
   * @param category 
   */
  getGeschmackInCategory(category: Category) {
    // Get all items in category
    const categoryItems: Item[] = this.getCategoryItems(category);
    // Store all geschmacks of the items in category
    let geschmacks = new Set<string>([]);

    // Iterate over all items in category to extract all geschmack in them
    for (var item of categoryItems) {
      for (var geschmack of item.geschmack) {
        geschmacks.add(geschmack);
      }
    }

    // Return geschmacks
    return Array.from(geschmacks);
  }
}