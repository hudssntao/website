import { ArrowLeft, Calendar, Text } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { type BlogPost, getAllPosts } from "../../lib/blog";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getAllPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="w-full flex flex-col gap-6 justify-center items-center bg-background overflow-y-auto">
      <div className="w-full h-screen flex flex-col justify-center items-start p-5 select-none bg-gradient-to-tr from-background via-background to-primary">
        <Link to="/" className="flex gap-2 items-center">
          <ArrowLeft /> back
        </Link>
        <div className="text-[15rem] font-bold">blog</div>
        <div className="flex justify-center items-center gap-2 pl-5 animate-bounce text-primary">
          read read read read
          <Text />
        </div>
      </div>

      <div id="posts" className="flex flex-col w-full h-screen justify-center items-center">
        <h2 className="text-3xl font-bold mb-8">All Posts</h2>

        {loading ? (
          <div className="text-center py-10">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10">No blog posts found.</div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="block p-6 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <div className="flex items-center gap-2 text-gray-500 mb-3">
                  <Calendar size={16} />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
