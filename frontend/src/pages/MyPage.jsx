import React, { useState, useEffect } from 'react';

const UserPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/api/myposts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'token': token,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await res.json();
        console.log('Fetched Posts:', data);    
        setPosts(data.posts);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          My Posts
        </h2>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-center">No posts yet.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post._id || post.id}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition duration-200"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-3">{post.post}</p>
            
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPosts;
