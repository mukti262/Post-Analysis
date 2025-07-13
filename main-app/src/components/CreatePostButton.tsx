'use client';

import { useState, lazy } from 'react';
import { useRouter } from 'next/navigation';
import { addPost } from '@/actions/actions';

const CreatePostModal = lazy(() => import('./CreatePostModal'));

export default function CreatePostButton({ currentTotal }: { currentTotal: number }) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleCreate = async (form: { userId: string; title: string; body: string }) => {
    await addPost({
      userId: Number(form.userId),
      title: form.title,
      body: form.body,
    });

    const lastPage = Math.ceil((currentTotal + 1) / 20);
    router.push(`/?page=${lastPage}`);
    router.refresh();
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
      >
        + Create Post
      </button>

      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </>
  );
}
