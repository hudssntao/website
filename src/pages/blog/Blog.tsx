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
      <div className="w-full h-screen flex flex-col gap-6 justify-center items-start p-5 select-none bg-gradient-to-tr from-background via-background to-primary">
        <Link to="/" className="flex gap-2 items-center text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> back
        </Link>
        <div className="text-7xl sm:text-9xl xl:text-[15rem] font-bold">blog</div>
        <div className="flex justify-center items-center gap-2 md:pl-5 animate-bounce text-primary text-sm sm:text-base">
          read read read read
          <Text className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      <div
        id="posts"
        className="flex flex-col w-full min-h-screen justify-center items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">All Posts</h2>

        {loading ? (
          <div className="text-center py-10 text-sm sm:text-base">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 text-sm sm:text-base">No blog posts found.</div>
        ) : (
          <div className="grid gap-4 sm:gap-6 w-full max-w-2xl">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="block p-4 sm:p-6 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors"
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{post.title}</h3>
                <div className="flex items-center gap-2 text-gray-500 mb-3 text-sm sm:text-base">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700 text-sm sm:text-base">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
