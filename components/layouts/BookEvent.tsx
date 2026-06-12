"use client";
import Image from "next/image";
import Link from "next/link";

export default function BookEvent() {
  return (
    <section className="py-20 bg-[#0047AB]">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-4 text-white leading-tight">
            Book Your Perfect Event Today
          </h2>
          <p className="text-white mb-8 text-sm">
            Join us now to explore and reserve the ideal venue for your next event.
          </p>
          <div className="flex gap-4">
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
        <div>
          <Image
            src="/bookEvent.png"
            alt="bookEvent"
            className="w-[400px] h-[300px] object-contain"
            width={400}
            height={300}
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
