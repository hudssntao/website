import fs from "node:fs";
import path from "node:path";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import matter from "gray-matter";
import type { BlogPost } from "../../lib/blog";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query;

  if (!slug || Array.isArray(slug)) {
    return res.status(400).json({ error: "Slug parameter is required and must be a string" });
  }

  try {
    // Get the file path
    const postPath = path.join(process.cwd(), "content/posts", `${slug}.md`);

    // Check if the file exists
    if (!fs.existsSync(postPath)) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Read the file content
    const fileContent = fs.readFileSync(postPath, "utf8");

    // Parse with gray-matter
    const { data, content } = matter(fileContent);

    // Return the post data
    const post: BlogPost = {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt || "",
      content,
    };

    return res.status(200).json(post);
  } catch (error) {
    console.error("Error in post API:", error);
    return res.status(500).json({ error: "Failed to fetch post" });
  }
}
