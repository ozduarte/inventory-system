import { Routes, Route } from "react-router";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import AppLayout from "./AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;