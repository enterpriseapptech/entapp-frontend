import Button from "@/components/ui/button";

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
          <Button className="bg-white text-[#081127] hover:bg-gray-100">Sign up</Button>
          <Button className="bg-transparent border border-white hover:bg-white hover:text-[#081127]">
            Login
          </Button>
        </div>
      </div>
    </section>
  );
}