import fs from "node:fs";
import path from "node:path";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import matter from "gray-matter";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query;

  if (!slug || Array.isArray(slug)) {
    return res.status(400).json({ error: "Slug parameter is required and must be a string" });
  }

  try {
    const postPath = path.join(process.cwd(), "public/posts", `${slug}.md`);

    if (!fs.existsSync(postPath)) {
      return res.status(404).json({ error: "Post not found" });
    }

    const fileContent = fs.readFileSync(postPath, "utf8");

    const { data, content } = matter(fileContent);

    return res.status(200).json({
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt || "",
      content,
    });
  } catch (error) {
    console.error("Error in post API:", error);
    return res.status(500).json({ error: "Failed to fetch post" });
  }
}
