import Link from 'next/link';
import { fetchPosts } from '@/actions/actions';
import { postType } from '@/db/type';
import CreatePostButton from '@/components/CreatePostButton';

const POSTS_PER_PAGE = 20;

export default async function PostsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams || {};
  const currentPage = parseInt(page || '1', 10);
  const posts: postType[] = await fetchPosts();

  const totalPosts = posts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const start = (validCurrentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(start, end);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-6 px-2">
        <h1 className="text-3xl font-extrabold text-gray-800">All Posts</h1>
        <CreatePostButton currentTotal={totalPosts} />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-xl rounded-2xl md:m-12">
        <table className="min-w-full text-sm text-gray-700 bg-white">
          <thead className="bg-purple-700 text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">User ID</th>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedPosts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">{post.userId}</td>
                <td className="px-6 py-4">{post.title}</td>
                <td className="px-6 py-4">
                  <Link
                    href={`/${post.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium transition"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-8 flex-wrap text-sm">
        <Link
          href={`?page=${validCurrentPage - 1}`}
          className={`px-3 py-1.5 rounded-md border ${validCurrentPage === 1
            ? 'cursor-not-allowed text-gray-400 border-gray-300'
            : 'hover:bg-gray-100 border-gray-400'
            }`}
          aria-disabled={validCurrentPage === 1}
        >
          ← Prev
        </Link>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <Link
            key={pageNum}
            href={`?page=${pageNum}`}
            className={`px-3 py-1.5 rounded-md border ${pageNum === validCurrentPage
              ? 'bg-purple-600 text-white border-purple-600 font-semibold'
              : 'hover:bg-gray-100 border-gray-300 text-gray-700'
              }`}
          >
            {pageNum}
          </Link>
        ))}

        <Link
          href={`?page=${validCurrentPage + 1}`}
          className={`px-3 py-1.5 rounded-md border ${validCurrentPage === totalPages
            ? 'cursor-not-allowed text-gray-400 border-gray-300'
            : 'hover:bg-gray-100 border-gray-400'
            }`}
          aria-disabled={validCurrentPage === totalPages}
        >
          Next →
        </Link>
      </div>

    </div>
  );
}