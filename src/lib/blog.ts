import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content?: string;
}

// Get list of all blog posts from the posts.json file
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    // Fetch the posts.json file directly
    const response = await fetch("/posts/posts.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Fetch the markdown file directly
    const response = await fetch(`/posts/${slug}.md`);

    if (!response.ok) {
      return null;
    }

    // Get the markdown content
    const markdownContent = await response.text();

    // Parse frontmatter and content with gray-matter
    const { data, content } = matter(markdownContent);

    // Return the post data
    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt || "",
      content,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}
