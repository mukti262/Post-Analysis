import { db } from './connect';
import { postType } from './type';

// Function to get all posts
export async function getPosts() : Promise<postType[]> {
    const sql = `
        SELECT * FROM Post
    `;
    const [rows] = await db.query(sql);
    
    return rows as postType[];
}

// Function to get a post by ID
export async function getPostById(id: number) : Promise<postType[] | null> {
    const sql = `
        SELECT * FROM Post WHERE id = ?
    `;
    const [rows] = await db.query(sql, [id]);
    return rows as postType[] | null;
}

// Function to create a new post
export async function createPost({
    userId,
    title,
    body
}: {
    userId: number;
    title: string;
    body: string;
}) {
    const sql = `
        INSERT INTO Post (userId, title, body)
        VALUES (?, ?, ?)
    `;
    const [result] = await db.query(sql, [userId, title, body]);
    return result;
}

// Function to update the post title by ID
export async function updatePostTitleById({
    id,
    title
}: {
    id: number;
    title: string;
}) {
    const sql = `
        UPDATE Post SET title = ? WHERE id = ?
    `;
    const [result] = await db.query(sql, [title, id]);
    return result;
}