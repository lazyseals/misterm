export interface Category {
  name: string;
}

export class MainCategory implements Category {
  constructor(public name: string, public subCategories: Category[]) { }
}

export class SubCategory implements Category {
  constructor(public name: string) { }
}