import { db } from './connect';

// Add initial posts to the database
export async function initDB() {
    const sql = `
    CREATE TABLE IF NOT EXISTS Post (
      userId INT NOT NULL,
      id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(100) NOT NULL,
      body VARCHAR(256) NOT NULL
    );
  `;

    await db.query(sql);

    // Fetch initial posts from an external API as json
    const initialPosts = await fetch('https://jsonplaceholder.typicode.com/posts');

    if (!initialPosts.ok) {
        throw new Error('Failed to fetch initial posts');
    }

    const posts = await initialPosts.json();
    
    const insertSql = `
    INSERT INTO Post (userId, title, body)
    VALUES (?, ?, ?)
    `;

    for (const post of posts) {
        await db.query(insertSql, [post.userId, post.title, post.body]);
    }

    console.log('Database initialized with initial posts');

    return true;
}

// Call the initDB function ONLY ONCE to set up the database
(async () => {
    try {
        await initDB();
        console.log('Database initialization complete');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
})();

// command to run this script
// npx tsx src/db/init.ts