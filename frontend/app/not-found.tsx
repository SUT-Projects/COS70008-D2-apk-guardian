import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center p-24">
      <h1 className="text-red-700 font-semibold">404 - Page Not Found</h1>
      <p className="text-red-700 font-semibold">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Link
        className="outline outline-slate-400 py-2 px-4 rounded-xl mt-4"
        href="/"
      >
        Go back to Home
      </Link>
    </div>
  );
}
