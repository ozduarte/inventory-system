export const inventorySummary = [
  {
    label: "Total inventory items",
    value: 24,
    description: "Items currently tracked",
  },
  {
    label: "Low stock",
    value: 3,
    description: "Items needing attention",
  },
  {
    label: "Expiring soon",
    value: 2,
    description: "Items expiring within 7 days",
  },
];

export const lowStockItems = [
  { name: "Chicken breast", quantity: "4 kg", threshold: "10 kg" },
  { name: "Whole milk", quantity: "3 L", threshold: "8 L" },
  { name: "Olive oil", quantity: "2 L", threshold: "5 L" },
];

export const recentOrders = [
  { id: "ORD-001", supplier: "Fresh Produce Co.", status: "Ordered" },
  { id: "ORD-002", supplier: "Local Dairy", status: "Delivered" },
  { id: "ORD-003", supplier: "Restaurant Supply Co.", status: "Requested" },
];

export const inventoryItems = [
  {
    id: 1,
    name: "Chicken breast",
    category: "Meat",
    quantity: 4,
    unit: "kg",
    threshold: 10,
    location: "Freezer",
    expirationDate: "2026-10-29",
  },
  {
    id: 2,
    name: "Whole milk",
    category: "Dairy",
    quantity: 3,
    unit: "L",
    threshold: 8,
    location: "Refrigerator",
    expirationDate: "2026-10-27",
  },
  {
    id: 3,
    name: "Olive oil",
    category: "Pantry",
    quantity: 2,
    unit: "L",
    threshold: 5,
    location: "Pantry shelf",
    expirationDate: "2027-06-15",
  },
  {
    id: 4,
    name: "All-purpose flour",
    category: "Baking",
    quantity: 18,
    unit: "kg",
    threshold: 5,
    location: "Pantry shelf",
    expirationDate: "2027-04-10",
  },
  {
    id: 5,
    name: "Cheddar cheese",
    category: "Dairy",
    quantity: 12,
    unit: "kg",
    threshold: 5,
    location: "Refrigerator",
    expirationDate: "2026-11-02",
  },
  {
    id: 6,
    name: "Tomatoes",
    category: "Produce",
    quantity: 2,
    unit: "kg",
    threshold: 6,
    location: "Refrigerator",
    expirationDate: "2026-10-26",
  },
];
