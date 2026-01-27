'use client';

import { useState } from 'react';
import Image from 'next/image';

const steps = [
  {
    number: '01',
    title: 'Select Template',
    description: 'Choose from hundreds of built-in high converting landing page templates tailored for growth.',
    image: '/assets/landing/step-1.png'
  },
  {
    number: '02',
    title: 'Dynamic Edits',
    description: 'Choose from hundreds of built-in high converting landing page templates tailored for growth.',
    image: '/assets/landing/step-2.png'
  },
  {
    number: '03',
    title: 'Manage Inventory',
    description: 'Easy Product Inventory Management directly within the builder. Sync stock in real-time.',
    image: '/assets/landing/step-3.png'
  },
  {
    number: '04',
    title: 'Launch Live',
    description: 'Seamless live production with integrated Lean.x payments ready to go immediately.',
    image: '/assets/landing/step-4.png'
  },
];

export function Pipeline() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="pipeline" className="py-20 sm:py-32 bg-[#F8F9FB]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            The Production Pipeline
          </h2>
          <p className="text-xl text-gray-500">
            From concept to cash in four steps.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center transform translate-y-[-2rem]">
          {/* Left Column: Steps */}
          <div className="space-y-8 relative">
             {/* Continuous Vertical Line */}
             <div className="absolute left-[2rem] top-8 bottom-8 w-1 bg-[#E5E7EB] -z-10 hidden lg:block" />

            {steps.map((step, index) => (
              <div 
                key={index} 
                className="flex gap-8 relative group cursor-pointer"
                onMouseEnter={() => setActiveStep(index)}
              >
                
                <div className="flex-shrink-0 z-10">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#5BC0BE] to-[#0E7490] text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-[#5BC0BE]/20 ring-8 ring-[#F8F9FB] grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out">
                    {step.number}
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Image */}
          <div className="relative transform lg:scale-[1.6] lg:translate-x-12 lg:origin-center z-20">
             <div className="grid grid-cols-1 grid-rows-1">
               {steps.map((step, index) => (
                 <div 
                   key={index} 
                   className={`col-start-1 row-start-1 transition-opacity duration-700 ease-in-out ${
                     activeStep === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                   }`}
                 >
                   <Image
                     src={step.image}
                     alt={`Production Pipeline - ${step.title}`}
                     width={800}
                     height={600}
                     className="w-full h-auto drop-shadow-2xl"
                     priority={index === 0} // Load the first one immediately
                   />
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
