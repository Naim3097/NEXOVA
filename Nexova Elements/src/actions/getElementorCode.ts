"use server";

import fs from "fs/promises";
import path from "path";

export async function getElementorCode(id: string) {
  try {
    const parts = id.split("-");
    const category = parts[0];
    const nameParts = parts.slice(1);
    
    // Map category to folder name
    let folder = category;
    if (category === "woo") folder = "woocommerce";

    // Convert name parts to PascalCase for filename
    // e.g. ["text", "editor"] -> "TextEditor"
    const name = nameParts
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
    
    const filename = `${name}Widget.tsx`;
    
    const filePath = path.join(process.cwd(), "src", "components", "elementor", folder, filename);
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error(`Error reading file for ID ${id}:`, error);
    return null;
  }
}
