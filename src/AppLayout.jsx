import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./components/Sidebar";

function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden sm:flex">
        <Sidebar />
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />

          <div className="absolute inset-y-0 left-0">
            <Sidebar onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 sm:px-6">
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            className="rounded-md p-2 text-gray-700 hover:bg-gray-100 sm:hidden"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>

          <h2 className="min-w-0 text-base font-semibold text-gray-900 sm:text-lg">
            Restaurant Inventory System
          </h2>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;