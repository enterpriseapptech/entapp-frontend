import Image from "next/image";

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="max-w-md">
          <p className="text-[#0047AB] font-medium mb-4">Events & Catering services</p>
          <h2 className="text-4xl font-bold mb-6 text-[#081127] leading-tight">
            Your One-Stop Solution for Event Planning
          </h2>
          <p className="text-gray-600 mb-8">
            Discover and book the perfect event center with ease. Customize your experience by adding services and making secure payments all in one place.
          </p>
          <div className="space-y-4 mb-8 text-gray-400">
            <div className="flex items-center gap-3">
              <Image src="/varietyText.png" alt="check" width={16} height={16} />
              Browse a variety of event centers effortlessly.
            </div>
            <div className="flex items-center gap-3">
              <Image src="/varietyText.png" alt="check" width={16} height={16} />
              Personalize your booking with catering options.
            </div>
            <div className="flex items-center gap-3">
              <Image src="/varietyText.png" alt="check" width={16} height={16} />
              Experience secure payments and easy management.
            </div>
          </div>
          <div className="flex gap-4">
            <button className="bg-[#0047AB] hover:bg-blue-700 text-white px-6 py-2 rounded-md">Learn More</button>
            <button className="border border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-md text-[#0047AB]">Sign up</button>
          </div>
        </div>
        <div>
          <Image
            src="/event.png"
            alt="event"
            width={500}
            height={400}
            className="rounded-lg shadow-xl"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}