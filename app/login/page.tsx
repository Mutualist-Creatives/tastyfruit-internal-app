import Image from "next/image";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="font-nunito flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border bg-white p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8 text-center">
            <Image
              src="/assets/tasty-fruit-logo.svg"
              alt="Tasty Fruit Logo"
              width={72}
              height={72}
              className="mx-auto"
              priority
            />
            <h1 className="font-heading mt-4 text-2xl font-bold text-slate-800">
              Welcome, Admin!
            </h1>
            <p className="text-sm text-slate-500">
              Sign in to access the dashboard.
            </p>
          </div>

          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} TastyFruit Admin Panel
        </p>
      </div>
    </main>
  );
}
