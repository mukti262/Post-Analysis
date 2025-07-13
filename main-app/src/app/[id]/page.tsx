'use client';

import { fetchPostById, editPostTitleById } from "@/actions/actions";
import { postType } from "@/db/type";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import WordCount from '@/components/WordCount';
import KeywordExtractor from "@/components/KeywordExtractor";
import Sentiment from "@/components/Sentiment";

export default function PostDetails() {
  const { id } = useParams();
  const postId = Number(id);

  const [post, setPost] = useState<postType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!isNaN(postId)) {
          const fetchedPost = await fetchPostById({ id: postId });
          if (fetchedPost) {
            setPost(fetchedPost[0]);
            setTitle(fetchedPost[0].title);
          } else {
            setPost(null);
          }
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleEditClick = async () => {
    if (isEditing) {
      try {
        await editPostTitleById({ id: postId, title });
        setPost((prev) => prev ? { ...prev, title } : prev);
        setIsEditing(false);
      } catch (err) {
        console.error('Failed to update post title:', err);
      }
    } else {
      setIsEditing(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600 text-lg">
        Loading post...
      </div>
    );
  }

  if (!post) {
    return <div className="text-center text-red-500 mt-6">Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Post Details
      </h1>

      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-4 gap-4">
          {isEditing ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ) : (
            <h2 className="text-2xl font-bold">{post.title}</h2>
          )}

          <button
            onClick={handleEditClick}
            className="rounded-md bg-purple-600 text-white px-3 py-1 text-sm hover:bg-purple-700 cursor-pointer transition"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
        <p className="text-gray-700 mb-4"><strong>User ID:</strong> {post.userId}</p>
        <p className="text-gray-600 whitespace-pre-line">{post.body}</p>
      </div>

      <h1 className="text-3xl font-extrabold text-gray-800 mt-10 mb-6 text-center">
        Post Analysis
      </h1>
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-700 mb-2">
          <strong>Word Count:</strong> <WordCount text={post.body} />
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Keywords:</strong> <KeywordExtractor text={post.body} />
        </p>
        <p className="text-gray-700">
          <strong>Sentiment:</strong> <Sentiment text={post.body} />
        </p>
      </div>

    </div>
  );
}