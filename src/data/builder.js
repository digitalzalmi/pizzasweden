/**
 * ============================================
 * PIZZA BUILDER OPTIONS — prices in PKR
 * ============================================
 * Change sizes, crusts, sauces, cheeses, and toppings here.
 * The live total on the page is calculated from these values.
 */
export const builderOptions = {
  sizes: [
    { id: "small", label: "Small", detail: '9"', price: 699 },
    { id: "medium", label: "Medium", detail: '12"', price: 899 },
    { id: "large", label: "Large", detail: '14"', price: 1199 },
  ],
  crusts: [
    { id: "classic", label: "Classic", price: 0 },
    { id: "thin", label: "Thin & Crisp", price: 0 },
    { id: "stuffed", label: "Cheese Stuffed", price: 150 },
  ],
  sauces: [
    { id: "tomato", label: "Tomato", price: 0 },
    { id: "bbq", label: "Smoky BBQ", price: 50 },
    { id: "white", label: "Garlic White", price: 50 },
    { id: "pesto", label: "Basil Pesto", price: 80 },
  ],
  cheeses: [
    { id: "mozzarella", label: "Mozzarella", price: 0 },
    { id: "mixed", label: "Mixed Blend", price: 120 },
    { id: "extra", label: "Extra Cheese", price: 150 },
  ],
  toppings: [
    { id: "pepperoni", label: "Pepperoni", price: 120 },
    { id: "chicken", label: "Chicken", price: 200 },
    { id: "beef", label: "Beef", price: 220 },
    { id: "mushroom", label: "Mushrooms", price: 80 },
    { id: "olives", label: "Olives", price: 80 },
    { id: "onion", label: "Onion", price: 50 },
    { id: "pepper", label: "Bell Pepper", price: 70 },
    { id: "jalapeno", label: "Jalapeño", price: 60 },
    { id: "pineapple", label: "Pineapple", price: 70 },
    { id: "basil", label: "Fresh Basil", price: 40 },
  ],
};
