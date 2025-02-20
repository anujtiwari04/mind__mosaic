import React, { useState } from 'react';
import { Send, Eye, EyeOff, MessageCircle, X } from 'lucide-react';
import Button from '../components/Button';
import AuthModal from '../components/AuthModal';

interface Post {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  comments: Comment[];
  isAnonymous: boolean;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  isAnonymous: boolean;
}

export default function Community() {
  // Initial static posts data
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      content: "I've been feeling overwhelmed with work lately. How do you all manage work-related stress?",
      author: "Sarah Johnson",
      timestamp: new Date('2024-03-10T10:00:00'),
      comments: [
        {
          id: '1',
          content: "I find that taking regular breaks and practicing deep breathing helps a lot!",
          author: "Michael Chen",
          timestamp: new Date('2024-03-10T10:30:00'),
          isAnonymous: false
        },
        {
          id: '2',
          content: "Regular exercise has been a game-changer for me. Even a short walk helps!",
          author: "Emma Wilson",
          timestamp: new Date('2024-03-10T11:00:00'),
          isAnonymous: false
        }
      ],
      isAnonymous: false
    },
    {
      id: '2',
      content: "Just completed my first meditation session! The peace I feel is incredible.",
      author: "Anonymous",
      timestamp: new Date('2024-03-11T09:00:00'),
      comments: [],
      isAnonymous: true
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showCommentsForPost, setShowCommentsForPost] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePostSubmit = () => {
    if (newPost.trim() === '') return;

    const newPostObj: Post = {
      id: Date.now().toString(),
      content: newPost,
      author: isAnonymous ? "Anonymous" : "Anuj Tiwari",
      timestamp: new Date(),
      comments: [],
      isAnonymous: isAnonymous
    };

    setPosts([newPostObj, ...posts]);
    setNewPost('');
    setIsAnonymous(false);
  };

  const handleCommentSubmit = () => {
    if (!selectedPost || !newComment.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: isAnonymous ? "Anonymous" : "Anuj Tiwari",
      timestamp: new Date(),
      isAnonymous: isAnonymous
    };

    setPosts(posts.map(post => {
      if (post.id === selectedPost.id) {
        return {
          ...post,
          comments: [...post.comments, newCommentObj],
        };
      }
      return post;
    }));

    setNewComment('');
    setIsModalOpen(false);
    setSelectedPost(null);
    setIsAnonymous(false);
  };

  const toggleComments = (postId: string) => {
    setShowCommentsForPost(showCommentsForPost === postId ? null : postId);
  };

  const openCommentModal = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Create Post */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent dark:text-white resize-none"
          rows={3}
        />
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setIsAnonymous(!isAnonymous)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            {isAnonymous ? (
              <><EyeOff className="w-4 h-4" /> Anonymous</>
            ) : (
              <><Eye className="w-4 h-4" /> Public</>
            )}
          </button>
          <Button onClick={handlePostSubmit} disabled={newPost.trim() === ''}>
            Post
          </Button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Post Content */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {post.author}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-800 dark:text-gray-200 mb-3">{post.content}</p>
              
              {/* Comment Button and Counter */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => openCommentModal(post)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <MessageCircle className="w-4 h-4" />
                  Reply
                </button>
                {post.comments.length > 0 && (
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {showCommentsForPost === post.id ? 'Hide replies' : `Show ${post.comments.length} ${post.comments.length === 1 ? 'reply' : 'replies'}`}
                  </button>
                )}
              </div>
            </div>

            {/* Comments Section */}
            {showCommentsForPost === post.id && post.comments.length > 0 && (
              <div className="border-t dark:border-gray-700">
                {post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700 last:border-b-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(comment.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comment Modal */}
      {isModalOpen && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reply</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              {/* Original Post */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Replying to {selectedPost.author}
                </div>
                <p className="text-gray-800 dark:text-gray-200">{selectedPost.content}</p>
              </div>

              {/* Comment Input */}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your reply..."
                className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent dark:text-white resize-none"
                rows={3}
              />

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  {isAnonymous ? (
                    <><EyeOff className="w-4 h-4" /> Anonymous</>
                  ) : (
                    <><Eye className="w-4 h-4" /> Public</>
                  )}
                </button>
                <Button
                  onClick={handleCommentSubmit}
                  disabled={newComment.trim() === ''}
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
















// import React, { useState, useEffect } from 'react';
// import { Send, Eye, EyeOff, MessageCircle, X } from 'lucide-react';
// import Button from '../components/Button';
// import AuthModal from '../components/AuthModal';


// const username = localStorage.getItem('username');

// interface Post {
//   id: string;
//   content: string;
//   author: string;
//   timestamp: Date;
//   comments: Comment[];
//   isAnonymous: boolean;
// }

// interface Comment {
//   id: string;
//   content: string;
//   author: string;
//   timestamp: Date;
//   isAnonymous: boolean;
// }

// export default function Community() {
//   const [posts, setPosts] = useState<Post[]>([
//     {
//       id: '1',
//       content: "I've been feeling overwhelmed with work lately. How do you all manage work-related stress?",
//       author: "Sarah Johnson",
//       timestamp: new Date('2024-03-10T10:00:00'),
//       comments: [
//         {
//           id: '1',
//           content: "I find that taking regular breaks and practicing deep breathing helps a lot!",
//           author: "Michael Chen",
//           timestamp: new Date('2024-03-10T10:30:00'),
//           isAnonymous: false
//         }
//       ],
//       isAnonymous: false
//     }
//   ]);

//   const [newPost, setNewPost] = useState('');
//   const [newComment, setNewComment] = useState('');
//   const [isAnonymous, setIsAnonymous] = useState(false);
//   const [showCommentsForPost, setShowCommentsForPost] = useState<string | null>(null);
//   const [selectedPost, setSelectedPost] = useState<Post | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await fetch('https://mindmosaicbackend.vercel.app/api/fetchPosts');
//         if (!response.ok) throw new Error('Failed to fetch posts');
//         const data = await response.json();
//         setPosts(data);
//       } catch (error) {
//         console.error('Error fetching posts:', error);
//       }
//     };
//     fetchPosts();
//   }, []);

//   const handlePostSubmit = async () => {
//     if (newPost.trim() === '') return;

//     // if (!isLoggedIn) {
//     //   setIsAuthModalOpen(true);
//     //   return;
//     // }

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('https://mindmosaicbackend.vercel.app/api/posts', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           content: newPost,
//           isAnonymous,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to create post');
//       }

//       const post = await response.json();
//       setPosts([post, ...posts]);
//       setNewPost('');
//     } catch (error) {
//       console.error('Error creating post:', error);
//     }
//   };

// // Fix the handleCommentSubmit function
// const handleCommentSubmit = async () => {
//   if (!selectedPost || !newComment.trim()) return;

//   try {
//     const token = localStorage.getItem('token');
//     const response = await fetch(`https://mindmosaicbackend.vercel.app/api/posts/${selectedPost.id}/comments`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         content: newComment,
//         isAnonymous,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to create comment');
//     }

//     const comment = await response.json();
    
//     // Update posts state with new comment
//     setPosts(posts.map(post => {
//       if (post.id === selectedPost.id) {
//         return {
//           ...post,
//           comments: [...post.comments, comment],
//         };
//       }
//       return post;
//     }));

//     // Clear form and close modal
//     setNewComment('');
//     setIsModalOpen(false);
//     setSelectedPost(null);
//     setIsAnonymous(false); // Reset anonymous state
//   } catch (error) {
//     console.error('Error creating comment:', error);
//   }
// };

//   const toggleComments = (postId: string) => {
//     setShowCommentsForPost(showCommentsForPost === postId ? null : postId);
//   };

//   const openCommentModal = (post: Post) => {
//     // if (!isLoggedIn) {  
//     //   setIsAuthModalOpen(true);
//     //   return;
//     // }
//     setSelectedPost(post);
//     setIsModalOpen(true);
//   };

//   const handleAuthSuccess = () => {
//     setIsLoggedIn(true);
//   };

//   return (
//     <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
//       {/* Create Post */}
//       <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
//         <textarea
//           value={newPost}
//           onChange={(e) => setNewPost(e.target.value)}
//           // placeholder={`Welcome ${username}, share your thoughts...`}
//           placeholder="Share your thoughts..."
//           className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent dark:text-white resize-none"
//           rows={3}
//         />
//         <div className="flex justify-between items-center mt-4">
//           <button
//             onClick={() => setIsAnonymous(!isAnonymous)}
//             className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
//           >
//             {isAnonymous ? (
//               <><EyeOff className="w-4 h-4" /> Anonymous</>
//             ) : (
//               <><Eye className="w-4 h-4" /> Public</>
//             )}
//           </button>
//           <Button onClick={handlePostSubmit} disabled={newPost.trim() === ''}>
//             Post
//           </Button>
//         </div>
//       </div>

//       {/* Posts List */}
//       <div className="space-y-4">
//         {posts.map((post) => (
//           <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
//             {/* Post Content */}
//             <div className="p-4">
//               <div className="flex justify-between items-start mb-2">
//                 <div>
//                   <h3 className="font-medium text-gray-900 dark:text-white">
//                     {post.author}
//                   </h3>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     {new Date(post.timestamp).toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//               <p className="text-gray-800 dark:text-gray-200 mb-3">{post.content}</p>
              
//               {/* Comment Button and Counter */}
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => openCommentModal(post)}
//                   className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
//                 >
//                   <MessageCircle className="w-4 h-4" />
//                   Reply
//                 </button>
//                 {post.comments.length > 0 && (
//                   <button
//                     onClick={() => toggleComments(post.id)}
//                     className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
//                   >
//                     {showCommentsForPost === post.id ? 'Hide replies' : `Show ${post.comments.length} ${post.comments.length === 1 ? 'reply' : 'replies'}`}
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Comments Section */}
//             {showCommentsForPost === post.id && post.comments.length > 0 && (
//               <div className="border-t dark:border-gray-700">
//                 {post.comments.map((comment) => (
//                   <div
//                     key={comment.id}
//                     className="p-4 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700 last:border-b-0"
//                   >
//                     <div className="flex justify-between items-start mb-2">
//                       <span className="font-medium text-sm text-gray-900 dark:text-white">
//                         {comment.author}
//                       </span>
//                       <span className="text-xs text-gray-500 dark:text-gray-400">
//                         {new Date(comment.timestamp).toLocaleString()}
//                       </span>
//                     </div>
//                     <p className="text-gray-800 dark:text-gray-200">{comment.content}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Comment Modal */}
//       {isModalOpen && selectedPost && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg">
//             <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reply</h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
            
//             <div className="p-4">
//               {/* Original Post */}
//               <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
//                 <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
//                   Replying to {selectedPost.author}
//                 </div>
//                 <p className="text-gray-800 dark:text-gray-200">{selectedPost.content}</p>
//               </div>

//               {/* Comment Input */}
//               <textarea
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 placeholder="Write your reply..."
//                 className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent dark:text-white resize-none"
//                 rows={3}
//               />

//               <div className="flex justify-between items-center mt-4">
//                 <button
//                   onClick={() => setIsAnonymous(!isAnonymous)}
//                   className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
//                 >
//                   {isAnonymous ? (
//                     <><EyeOff className="w-4 h-4" /> Anonymous</>
//                   ) : (
//                     <><Eye className="w-4 h-4" /> Public</>
//                   )}
//                 </button>
//                 <Button
//                   onClick={handleCommentSubmit}
//                   disabled={newComment.trim() === ''}
//                 >
//                   Reply
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Auth Modal */}
//       <AuthModal
//         isOpen={isAuthModalOpen}
//         onClose={() => setIsAuthModalOpen(false)}
//         onSuccess={handleAuthSuccess}
//       />
//     </div>
//   );
// }
