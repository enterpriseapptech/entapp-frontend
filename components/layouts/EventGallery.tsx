import Image from "next/image";

export default function EventGallery() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2 text-[#081127]">
            Event Gallery
          </h2>
          <p className="text-gray-600">
            Explore stunning venues and memorable events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:row-span-2">
            <Image
              src="/gallery-img1.png"
              alt="Burger menu"
              className="w-full h-full object-cover rounded-lg shadow-lg"
              width={400}
              height={600}
              unoptimized
            />
          </div>
          <div>
            <Image
              src="/gallery-img2.png"
              alt="Buffet table"
              className="w-full h-48 object-cover rounded-lg shadow-lg"
              width={400}
              height={200}
              unoptimized
            />
          </div>
          <div>
            <Image
              src="/gallery-img3.png"
              alt="Wedding couple"
              className="w-full h-48 object-cover rounded-lg shadow-lg"
              width={400}
              height={200}
              unoptimized
            />
          </div>
          <div>
            <Image
              src="/gallery-img4.png"
              alt="Photographer at event"
              className="w-full h-48 object-cover rounded-lg shadow-lg"
              width={400}
              height={200}
              unoptimized
            />
          </div>
          <div>
            <Image
              src="/gallery-img5.png"
              alt="Event venue"
              className="w-full h-48 object-cover rounded-lg shadow-lg"
              width={400}
              height={200}
              unoptimized
            />
          </div>
          <div>
            <Image
              src="/gallery-img6.png"
              alt="Special menu"
              className="w-full h-48 object-cover rounded-lg shadow-lg"
              width={400}
              height={200}
              unoptimized
            />
          </div>
          <div>
            <Image
              src="/gallery-img7.png"
              alt="Special menu"
              className="w-full h-48 object-cover rounded-lg shadow-lg"
              width={400}
              height={200}
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}
