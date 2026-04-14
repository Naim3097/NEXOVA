"use client";

import Image from "next/image";

interface Product {
  name: string;
  price: string;
  img: string;
}

interface UpsellsWidgetProps {
  products?: Product[];
}

export default function UpsellsWidget({
  products = [
    { name: "Pro Case", price: "$29.00", img: "https://picsum.photos/seed/upsell1/200/200" },
    { name: "Extra Cables", price: "$15.00", img: "https://picsum.photos/seed/upsell2/200/200" },
    { name: "Stand", price: "$45.00", img: "https://picsum.photos/seed/upsell3/200/200" },
  ]
}: UpsellsWidgetProps) {
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">You may also like...</h3>
      <div className="grid grid-cols-3 gap-4">
        {products.map((p, i) => (
          <div key={i} className="group">
            <div className="relative w-full aspect-square overflow-hidden rounded mb-2">
              <Image src={p.img} alt={p.name} fill className="object-cover transition-transform group-hover:scale-105" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-500 transition-colors">{p.name}</h4>
            <span className="text-xs text-zinc-400">{p.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
