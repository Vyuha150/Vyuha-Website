import { businessServices } from "@/data/businessData";
import BusinessServiceCard from "@/components/BusinessServiceCard";

export default function BusinessPage() {
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-500 mb-12 text-center">Business Services</h1>
        {businessServices.map((section, idx) => (
          <section key={idx} className="mb-14">
            <div className="relative mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white pl-8 py-4 rounded-xl ">
                {section.section}
              </h2>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-3/4 bg-gradient-to-b from-orange-500/80 to-orange-400/40 rounded-r-lg blur-sm opacity-60" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {section.categories.map((cat, cidx) => (
                <BusinessServiceCard key={cidx} title={cat.title} items={cat.items} links={cat.links} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
