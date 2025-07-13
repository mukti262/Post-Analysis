'use server'

import { getPosts, getPostById, createPost, updatePostTitleById } from '../db/actions';
import { postType } from '../db/type';

export async function fetchPosts() : Promise<postType[]> {
    return await getPosts();
}

export async function fetchPostById({
    id
}: {
    id: number;
}) : Promise<postType[] | null> {
    return await getPostById(id) || null;
}

export async function addPost({
    userId,
    title,
    body
}: {
    userId: number;
    title: string;
    body: string;
}) {
    const post = {
        userId,
        title,
        body
    };
    await createPost(post);
}

export async function editPostTitleById({
    id,
    title
} : {
    id: number;
    title: string;
}) {
    await updatePostTitleById({ id, title });
}