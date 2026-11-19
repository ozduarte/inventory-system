import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// TEMPORARY DEMO ACCOUNTS
// Replace with backend authentication once the API is ready.
const demoAccounts = [
  {
    email: "admin@stockroom.com",
    password: "admin123",
    name: "Administrator",
    role: "Administrator",
  },
  {
    email: "manager@stockroom.com",
    password: "manager123",
    name: "Manager",
    role: "Manager",
  },
  {
    email: "employee@stockroom.com",
    password: "employee123",
    name: "Employee",
    role: "Employee",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("stockroom_user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  function login(email, password) {
    const account = demoAccounts.find(
      (account) =>
        account.email.toLowerCase() === email.toLowerCase() &&
        account.password === password
    );

    if (!account) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }

    const loggedInUser = {
      name: account.name,
      email: account.email,
      role: account.role,
    };

    setUser(loggedInUser);
    localStorage.setItem("stockroom_user", JSON.stringify(loggedInUser));

    return { success: true };
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("stockroom_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}