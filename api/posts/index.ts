import fs from "node:fs";
import path from "node:path";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import matter from "gray-matter";
import type { BlogPost } from "../../src/lib/blog";

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const postsDirectory = path.join(process.cwd(), "public/posts");
    const fileNames = fs.readdirSync(postsDirectory);

    const posts: BlogPost[] = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(".md", "");

        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data } = matter(fileContents);

        return {
          slug,
          title: data.title,
          date: data.date,
          excerpt: data.excerpt || "",
        };
      });

    const sortedPosts = posts.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    res.status(200).json(sortedPosts);
  } catch (error) {
    console.error("Error in posts API:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
}
