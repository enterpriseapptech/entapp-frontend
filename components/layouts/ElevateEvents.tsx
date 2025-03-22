import Image from "next/image";

export default function ElevateEvents() {
  return (
    <section className="py-20 bg-[#F5F5F8]">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-center gap-20">
        <div>
          <Image
            src="/cateringServices.png"
            alt="catering setup"
            className="w-[500px] h-[400px] rounded-lg shadow-sm"
            width={500}
            height={400}
            unoptimized
          />
        </div>
        <div className="max-w-md">
          <h2 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 text-[#081127] leading-tight">
            Elevate Your Events with Tailored Catering Services for Every Occasion
          </h2>
          <p className="text-xs sm:text-base text-gray-600 mb-2">
            Our catering service integration allows you to enhance your event experience by selecting from a variety of menu options. Customize your package to meet specific needs and preferences.
          </p>
          <div className="space-y-4 mb-8 flex flex-col sm:flex-row">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[#081127] mb-1 sm:mb-2">
                Custom Menus
              </h3>
              <p className="text-xs sm:text-base text-gray-400">
                Choose from diverse menu options tailored to the event’s theme and dietary needs.
              </p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[#081127] mb-1 sm:mb-2">
                Flexible Options
              </h3>
              <p className="text-xs sm:text-base text-gray-400">
                Easily adjust meal quantities and specific requests to ensure guest satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}