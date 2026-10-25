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