import Image from "next/image";
import Button from "@/components/ui/button";

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
            <Button className="bg-white text-[#081127] hover:bg-gray-100">Sign up</Button>
            <Button className="bg-transparent border border-white hover:bg-white hover:text-[#081127]">
              Login
            </Button>
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