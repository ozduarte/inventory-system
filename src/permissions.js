const rolePermissions = {
  Administrator: {
    canAddInventory: true,
    canEditInventory: true,
    canDeleteInventory: true,
    canManageOrders: true,
  },

  Manager: {
    canAddInventory: true,
    canEditInventory: true,
    canDeleteInventory: true,
    canManageOrders: true,
  },

  Employee: {
    canAddInventory: true,
    canEditInventory: true,
    canDeleteInventory: false,
    canManageOrders: false,
  },
};

export function hasPermission(role, permission) {
  return rolePermissions[role]?.[permission] ?? false;
}