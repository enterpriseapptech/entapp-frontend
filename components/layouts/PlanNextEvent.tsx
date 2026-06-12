"use client";
import Link from "next/link";

export default function PlanNextEvent() {
  return (
    <section className="py-20 bg-[#0047AB]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4 text-white leading-tight">
          Ready to Plan Your Next Event?
        </h2>
        <p className="text-white mb-8 text-sm">
          Sign up today to explore venues, book catering, and make your event unforgettable.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/signup"
            className="px-4 py-2 bg-white text-[#081127] hover:bg-gray-100 rounded-md font-medium text-sm"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-transparent border border-white hover:bg-white hover:text-[#081127] text-white rounded-md font-medium text-sm transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
