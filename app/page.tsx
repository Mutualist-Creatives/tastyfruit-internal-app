import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="font-nunito flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border bg-white p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8 text-center">
            {/* REVISI: Path gambar diubah sesuai permintaan */}
            <Image
              src="/assets/tasty-fruit-logo.svg"
              alt="Tasty Fruit Logo"
              width={72}
              height={72}
              className="mx-auto"
            />
            <h1 className="font-heading mt-4 text-2xl font-bold text-slate-800">
              Welcome, Admin!
            </h1>
            <p className="text-sm text-slate-500">
              Sign in to access the dashboard.
            </p>
          </div>

          <div className="space-y-6">
            {/* Input Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>

            {/* Input Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            {/* Tombol Navigasi */}
            <Link href="/dashboard" className="block w-full">
              <button
                type="button"
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign In
              </button>
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} TastyFruit Admin Panel
        </p>
      </div>
    </main>
  );
}
