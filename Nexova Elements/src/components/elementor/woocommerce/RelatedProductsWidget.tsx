"use client";

import Image from "next/image";

interface Product {
  name: string;
  price: string;
  img: string;
}

interface RelatedProductsWidgetProps {
  products?: Product[];
}

export default function RelatedProductsWidget({
  products = [
    { name: "Bluetooth Speaker", price: "$89.00", img: "https://picsum.photos/seed/rel1/200/200" },
    { name: "Earbuds", price: "$129.00", img: "https://picsum.photos/seed/rel2/200/200" },
    { name: "Smart Watch", price: "$199.00", img: "https://picsum.photos/seed/rel3/200/200" },
    { name: "Power Bank", price: "$49.00", img: "https://picsum.photos/seed/rel4/200/200" },
  ]
}: RelatedProductsWidgetProps) {
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">Related Products</h3>
      <div className="grid grid-cols-4 gap-4">
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
