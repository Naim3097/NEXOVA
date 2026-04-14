"use client";

import { Reorder } from "framer-motion";
import { useState } from "react";

interface KanbanDragDropDemoProps {
  itemBg?: string;
  textColor?: string;
  initialItems?: string[];
}

export default function KanbanDragDropDemo(props: KanbanDragDropDemoProps) {
  return <KanbanDragDropImplementation {...props} />;
}

export function KanbanDragDropImplementation({
  itemBg = "#27272a",
  textColor = "#ffffff",
  initialItems = ["Item 1", "Item 2", "Item 3", "Item 4"],
}: KanbanDragDropDemoProps) {
  const [items, setItems] = useState(initialItems);

  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-zinc-900">
      <Reorder.Group axis="y" values={items} onReorder={setItems} className="flex flex-col gap-2 w-64">
        {items.map((item) => (
          <Reorder.Item key={item} value={item}>
            <div 
              className="p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing flex items-center justify-between"
              style={{ backgroundColor: itemBg }}
            >
              <span className="font-medium" style={{ color: textColor }}>{item}</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-zinc-500 rounded-full" />
                <div className="w-1 h-1 bg-zinc-500 rounded-full" />
                <div className="w-1 h-1 bg-zinc-500 rounded-full" />
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
