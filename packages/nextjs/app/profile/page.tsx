"use client";

import Link from "next/link";
import { RemiliaLogin } from "~~/components/RemiliaLogin";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="card w-full max-w-xl border border-base-300 bg-base-100 shadow-xl">
        <div className="card-body gap-4">
          <h1 className="text-2xl font-bold">Protected profile</h1>
          <p className="text-base-content/70">This page requires a valid Remilia authentication session.</p>
          <RemiliaLogin />
          <Link href="/" className="btn btn-ghost">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
