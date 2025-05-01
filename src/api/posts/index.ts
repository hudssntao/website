import fs from "node:fs";
import path from "node:path";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import matter from "gray-matter";
import type { BlogPost } from "../../lib/blog";

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("Fetching posts");
    // Get files from the content/posts directory
    const postsDirectory = path.join(process.cwd(), "content/posts");
    const fileNames = fs.readdirSync(postsDirectory);

    // Get the posts data
    const posts: BlogPost[] = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        // Create slug from filename
        const slug = fileName.replace(".md", "");

        // Get frontmatter
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data } = matter(fileContents);

        // Return the data
        return {
          slug,
          title: data.title,
          date: data.date,
          excerpt: data.excerpt || "",
        };
      });

    // Sort posts by date (newest first)
    const sortedPosts = posts.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Return the posts
    res.status(200).json(sortedPosts);
  } catch (error) {
    console.error("Error in posts API:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
}
