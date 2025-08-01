export interface FiltersInterf {
  category?: CategoryFilterInterf[];
}

export interface CategoryFilterInterf {
  id: number;
  value: string;
  checked: boolean;
}
