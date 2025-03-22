import Image from "next/image";
import Button from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-10 bg-white">
      <div className="max-w-8xl mx-auto px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 justify-start">
          <div>
            <div className="mb-4">
              <Image src="/logo-footer.png" alt="Entapp Tech Logo" width={150} height={40} unoptimized />
            </div>
            <p className="text-gray-600 mb-4">
              Join our newsletter to stay up to date on features and releases.
            </p>
            <div className="flex gap-2 mb-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-[800px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 text-sm"
              />
              <Button className="bg-[#0047AB] hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Subscribe
              </Button>
            </div>
            <p className="text-gray-500 text-xs">
              By subscribing you agree with our{" "}
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>{" "}
              and consent to receive updates from our company.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="text-gray-600 flex gap-12 font-semibold text-xs">
              <div className="space-y-4">
                <li><a href="#" className="hover:text-blue-600">Event Centers</a></li>
                <li><a href="#" className="hover:text-blue-600">Catering Services</a></li>
                <li><a href="#" className="hover:text-blue-600">Booking Management</a></li>
                <li><a href="#" className="hover:text-blue-600">User Support</a></li>
                <li><a href="#" className="hover:text-blue-600">FAQs</a></li>
              </div>
              <div className="space-y-4">
                <li><a href="#" className="hover:text-blue-600">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-600">Review Ratings</a></li>
                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms Service</a></li>
                <li><a href="#" className="hover:text-blue-600">Cookies Settings</a></li>
              </div>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Follow Us</h3>
            <ul className="space-y-2 text-gray-600 font-semibold text-xs">
              <li className="flex items-center gap-2">
                <Facebook className="w-5 h-5 text-gray-600" />
                <a href="#" className="hover:text-blue-600">Facebook</a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-gray-600" />
                <a href="#" className="hover:text-blue-600">Instagram</a>
              </li>
              <li className="flex items-center gap-2">
                <Twitter className="w-5 h-5 text-gray-600" />
                <a href="#" className="hover:text-blue-600">X</a>
              </li>
              <li className="flex items-center gap-2">
                <Linkedin className="w-5 h-5 text-gray-600" />
                <a href="#" className="hover:text-blue-600">LinkedIn</a>
              </li>
              <li className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-gray-600" />
                <a href="#" className="hover:text-blue-600">YouTube</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2024 Entapp. All rights reserved.</p>
          <div className="flex gap-4 text-gray-600 text-sm">
            <a href="#" className="hover:text-blue-600 underline">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 underline">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 underline">Cookies Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}