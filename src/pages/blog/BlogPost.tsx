import { ArrowLeft, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { type BlogPost as BlogPostType, getPostBySlug } from "../../lib/blog";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!slug) {
          setError("Post not found");
          return;
        }

        const postData = await getPostBySlug(slug);
        if (!postData) {
          setError("Post not found");
          return;
        }

        setPost(postData);
      } catch (error) {
        console.error("Failed to fetch post:", error);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="w-full min-h-screen flex justify-center items-center">Loading...</div>;
  }

  if (error || !post) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center">
        <div className="text-xl mb-4">{error || "Post not found"}</div>
        <Link to="/blog#posts" className="flex gap-2 items-center text-primary">
          <ArrowLeft /> Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-background min-h-screen">
      <div className="w-full p-5 bg-gradient-to-r from-background to-primary/10">
        <div className="container mx-auto max-w-4xl">
          <Link to="/blog#posts" className="flex gap-2 items-center mb-6">
            <ArrowLeft /> Back to blog
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-2 text-gray-500 mb-8">
            <Calendar size={16} />
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 max-w-4xl">
        <article className="prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content || ""}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
