import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  description: string;
  date: string;
  readTime: string;
  imageUrl: string;
  url: string;
  author: IUser;
}

interface IUser {
  name: string;
}

interface MousePosition {
  x: number;
  y: number;
}

interface BlogCardProps {
  post: Post;
}

const readTimes = ["3 min read", "5 min read", "7 min read", "10 min read"];
const getRandomItem = (array: string[]): string => array[Math.floor(Math.random() * array.length)];

const isValidImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

interface ApiPost {
  id: number;
  title: string;
  body: string;
  userId: number;
  imageUrl: string;
  url: string;
  author: IUser;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: {
    posts: ApiPost[];
  };
  timestamp: string;
  path: string;
}

const fetchBlogPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}blog/posts?page=1&limit=10`);
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const responseData: ApiResponse = await response.json();

    if (!responseData.data?.posts) {
      throw new Error("No posts data available");
    }

    return responseData.data.posts.map((post, index) => ({
      id: post.id,
      title: post.title.charAt(0).toUpperCase() + post.title.slice(1),
      description: post.body,
      date: new Date(Date.now() - index * 86400000).toISOString(),
      readTime: getRandomItem(readTimes),
      author: post.author,
      url: post.url,
      imageUrl: isValidImageUrl(post.imageUrl) ? post.imageUrl : "/placeholder-image.jpg",
    }));
  } catch (error) {
    // More specific error handling
    if (error instanceof Error) {
      throw new Error(`Error fetching blog posts: ${error.message}`);
    }
    // Handle cases where error is not an Error object
    throw new Error("Error fetching blog posts: An unknown error occurred");
  }
};
const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const [mousePos, setMousePos] = useState<MousePosition>({
    x: -1000,
    y: -1000,
  });
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!cardRef.current) return;
    const bounds = cardRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const padding = 50;
    if (x >= -padding && x <= bounds.width + padding && y >= -padding && y <= bounds.height + padding) {
      setMousePos({ x, y });
    } else {
      setMousePos({ x: -1000, y: -1000 });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setMousePos({ x: -1000, y: -1000 });
        setIsHovered(false);
      }}
      className="relative bg-[#1A1A1A]/80 backdrop-blur-sm rounded-lg overflow-hidden h-full"
    >
      <div
        className="absolute inset-0 pointer-events-none rounded-lg border-2 border-secondary"
        style={{
          maskImage: `radial-gradient(
            120px circle at ${mousePos.x}px ${mousePos.y}px,
            black,
            transparent
          )`,
          WebkitMaskImage: `radial-gradient(
            120px circle at ${mousePos.x}px ${mousePos.y}px,
            black,
            transparent
          )`,
        }}
      />

      <div className="relative z-10 p-6">
        <div className="relative overflow-hidden rounded-lg mb-6 group">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            alt={post.title}
            className={`w-full h-48 object-cover transition-transform duration-700 ease-out
    ${isHovered ? "scale-110 rotate-1" : ""}`}
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <Clock className="w-4 h-4" />
          <span>{post.readTime}</span>
          <span className="text-gray-600">•</span>
          <span>{post.author.name}</span>
          <span className="text-gray-600">•</span>
          <span>{new Date(post.date).toLocaleDateString()}</span>
        </div>

        <h3 className="text-xl font-semibold text-white mb-3">{post.title}</h3>

        <p className="text-gray-400 text-sm mb-6 line-clamp-3">{post.description}</p>
        <Link href={post.url} target="_blank">
          <Button variant="ghost" className="w-full flex bg-gray-900/50 text-gray-300 ">
            <span className="mr-2">Read More</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchBlogPosts();
        setPosts(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="w-full min-h-screen bg-[#121212] pb-16" id="blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl text-center font-bold tracking-tight text-white mb-4">Latest Blog Posts</h2>
          <p className="text-md text-gray-400">Stay up to date with the latest news and updates from our team.</p>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto mb-12">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading
            ? Array(6)
                .fill(null)
                .map((_, index) => (
                  <motion.div key={`skeleton-${index}`} variants={cardVariants} className="h-full">
                    <div className="bg-[#1A1A1A]/80 backdrop-blur-sm rounded-lg p-6 h-full">
                      <Skeleton className="h-48 w-full bg-gray-700/50 rounded-lg mb-6" />
                      <Skeleton className="h-4 w-24 bg-gray-700/50 mb-3" />
                      <Skeleton className="h-6 w-full bg-gray-700/50 mb-3" />
                      <Skeleton className="h-24 w-full bg-gray-700/50" />
                    </div>
                  </motion.div>
                ))
            : posts.map((post) => (
                <motion.div key={post.id} variants={cardVariants} className="h-full">
                  <BlogCard post={post} />
                </motion.div>
              ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
