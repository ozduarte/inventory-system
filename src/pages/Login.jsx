import { useState } from "react";
import { useNavigate } from "react-router";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    // Temporary navigation until authentication is implemented.
    navigate("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">

      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-emerald-950">
            Stockroom
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Restaurant Inventory Management
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Welcome back
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-16 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 text-sm font-medium text-gray-500 hover:text-emerald-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
          >
            Sign In
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;