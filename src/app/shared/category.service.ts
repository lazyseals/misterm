import { Category, MainCategory, SubCategory } from './category.model';

export class CategoryService {
  // Current loaded categories from backend that are available to user
  private categories: MainCategory[] = [
    new MainCategory('Supplements', [
      new SubCategory('Creatin'),
      new MainCategory('Aminosäuren', [
        new SubCategory('BCAA'),
        new SubCategory('Glutamin'),
        new SubCategory('Aminosäuren Getränke'),
        new SubCategory('Aminosäuren Komplex'),
        new SubCategory('HMB'),
        new SubCategory('Arginin'),
        new SubCategory('AAKG'),
        new SubCategory('Beta Alanin'),
        new SubCategory('Citrulin'),
        new SubCategory('Gaba'),
        new SubCategory('Lysin'),
        new SubCategory('Onrithin'),
        new SubCategory('Taurin'),
        new SubCategory('Tyrosin')
      ]),
      new MainCategory('Pre-Workout', [
        new SubCategory('ohne Koffein'),
        new SubCategory('mit Koffein'),
        new SubCategory('Pump- \& Trainingsbooster'),
        new SubCategory('Energy Drinks')
      ])
      , new MainCategory('Vitalstoffe', [
        new SubCategory('Vitamin B'),
        new SubCategory('Vitamin C'),
        new SubCategory('Vitamin D'),
        new SubCategory('Vitamin E'),
        new SubCategory('Multivitamin'),
        new SubCategory('Mineralstoffe'),
        new SubCategory('Zink'),
        new SubCategory('Magnesium'),
        new SubCategory('ZMA'),
        new SubCategory('Antioxidantien'),
        new SubCategory('Fischöl'),
        new SubCategory('Omega 3'),
        new SubCategory('MCT Fette'),
        new SubCategory('Gelenknahrung'),
        new SubCategory('Glucosamin'),
        new SubCategory('Enzyme'),
        new SubCategory('Probiotika'),
        new SubCategory('Pflanzliche Präparate'),
        new SubCategory('Curcurmin')
      ]),
      new MainCategory('Masseaufbau', [
        new SubCategory('Weight Gainer'),
        new SubCategory('Kohlenhydratpulver'),
        new SubCategory('Maltodextin'),
        new SubCategory('Dextrose'),
        new SubCategory('Haferflocken'),
      ])
    ]),
    new MainCategory('Protein', [
      new MainCategory('Milchproteine', [
        new SubCategory('Whey Protein'),
        new SubCategory('Casein Protein')
      ]),
      new MainCategory('Pflanzliche Proteine', [
        new SubCategory('SojaProtein'),
        new SubCategory('Reisprotein'),
        new SubCategory('Erbsenprotein')
      ]),
      new MainCategory('Weitere Proteinprodukte', [
        new SubCategory('Ohne Geschmackszusatz'),
        new SubCategory('Ei Protein'),
        new SubCategory('Biologisches Protein')
      ])
    ]),
    new MainCategory('Fitnessfood', [
      new MainCategory('Riegel \& Snacks', [
        new SubCategory('Proteinriegel'),
        new SubCategory('Light Chips'),
        new SubCategory('Schokolade'),
        new SubCategory('Energieriegel'),
        new SubCategory('Proteincookie')
      ]),
      new MainCategory('Superfoods', [
        new SubCategory('Chia'),
        new SubCategory('Spirulina'),
        new SubCategory('Samen'),
        new SubCategory('Nüsse'),
        new SubCategory('Beeren'),
        new SubCategory('Bohnen')
      ]),
      new MainCategory('Alltägliche Lebensmittel', [
        new SubCategory('Mealprep Boxen'),
        new SubCategory('Pizza \& Pasta'),
        new SubCategory('Eiklar'),
        new SubCategory('Butter'),
        new SubCategory('Aufstriche'),
        new SubCategory('Fleisch'),
        new SubCategory('Gewürze'),
        new SubCategory('Tiefkühl'),
        new SubCategory('Tee \& Kaffee'),
        new SubCategory('Saucen'),
        new SubCategory('Aromen \& Süßstoffe'),
        new SubCategory('Proteineis'),
        new SubCategory('Syrup'),
        new SubCategory('Speiseöle'),
        new SubCategory('Getreide'),
        new SubCategory('Pancake'),
        new SubCategory('Pudding'),
      ])
    ]),
    new MainCategory('Getränke', [
      new SubCategory('Protein Drinks'),
      new SubCategory('Mahlzeitenersatz'),
      new SubCategory('Tee \& Kaffee'),
      new SubCategory('Ohne Kalorien')
    ])
  ];

  /**
   * Get list of all loaded categories
   */
  getCategories() {
    return this.categories.slice();
  }

  /**
   * Get list of all cateogories of type main categories
   */
  getMainCategories() {
    let filtered_categories = [];
    for (var category of this.categories) {
      filtered_categories = filtered_categories.concat(this._getMainCategories(category));
    }
    return filtered_categories;
  }

  /**
   * Helper method for getMainCategories method
   */
  private _getMainCategories(category: Category) {
    if (category instanceof MainCategory) {
      let filtered_categories = [];
      filtered_categories = filtered_categories.concat(category);
      for (var subCategory of category.subCategories) {
        filtered_categories = filtered_categories.concat(this._getMainCategories(subCategory));
      }
      return filtered_categories;
    } else {
      return [];
    }
  }

  /**
   * Returns category type by category name.
   * @param category_name 
   */
  getCategoryType(category_name: string) {
    for (var category of this.getMainCategories()) {
      if (category_name === category.name) {
        return category;
      }
    }
    return new SubCategory(category_name);
  }
}