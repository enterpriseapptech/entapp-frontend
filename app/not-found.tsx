"use client";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-8">
        <Link href="/">
          <Image
            src="/logo-footer.png"
            alt="Entapp Tech"
            width={150}
            height={50}
            className="object-contain mx-auto"
            unoptimized
          />
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-8xl font-extrabold text-[#0047AB] mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Page Not Found</h2>
        <p className="text-gray-500 max-w-md">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-3 bg-[#0047AB] hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
        >
          Go to Homepage
        </Link>
        <Link
          href="/event-center"
          className="px-6 py-3 bg-white border border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 rounded-md font-medium transition-colors"
        >
          Browse Event Centers
        </Link>
        <Link
          href="/cateringServices/allPost"
          className="px-6 py-3 bg-white border border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 rounded-md font-medium transition-colors"
        >
          Browse Catering
        </Link>
      </div>

      <p className="mt-8 text-sm text-gray-400">
        Need help?{" "}
        <a href="#" className="text-blue-600 hover:underline">
          Contact support
        </a>
      </p>
    </div>
  );
}
