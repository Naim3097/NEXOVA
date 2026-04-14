'use client';

import Link from 'next/link';

const templates = [
  {
    name: 'SaaS Startup',
    description: 'Perfect for software companies.',
    category: 'SaaS',
    color: 'from-blue-100 to-blue-50',
  },
  {
    name: 'Digital Product',
    description: 'High conversion for downloads.',
    category: 'E-book',
    color: 'from-purple-100 to-purple-50',
  },
  {
    name: 'Agency Portfolio',
    description: 'Showcase your work professionally.',
    category: 'Portfolio',
    color: 'from-green-100 to-green-50',
  },
];

export function Templates() {
  return (
    <section id="templates" className="py-20 sm:py-32 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Start with a template
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our library of high-converting designs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {templates.map((template, index) => (
            <Link
              key={index}
              href="/templates"
              className="group block"
            >
              <div className="rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-all">
                {/* Template Preview */}
                <div className={`aspect-[4/3] bg-gradient-to-br ${template.color} flex items-center justify-center p-8`}>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-300 mb-2">{template.category} Template</div>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {template.name}
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {template.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
