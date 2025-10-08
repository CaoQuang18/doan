import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaComment, FaShare, FaImage, FaVideo, FaSmile, FaPaperPlane, FaUserPlus, FaCheck, FaHome } from 'react-icons/fa';
import { useUser } from '../components/UserContext';
import { useToast } from '../components/Toast';
import { Link, useNavigate } from 'react-router-dom';

const Community = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Generate avatar from username
  const getUserAvatar = () => {
    // Ưu tiên profilePicture từ Profile page
    if (user?.profilePicture) return user.profilePicture;
    if (user?.avatar) return user.avatar;
    if (user?.username) {
      // Use UI Avatars service with username
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=7c3aed&color=fff&size=150&bold=true`;
    }
    if (user?.email) {
      // Use first letter of email
      const name = user.email.split('@')[0];
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff&size=150&bold=true`;
    }
    return 'https://ui-avatars.com/api/?name=User&background=7c3aed&color=fff&size=150&bold=true';
  };
  
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: 'Sofia Gomes',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'Chủ nhà',
        isHost: true
      },
      content: 'Vừa hoàn thành cải tạo căn hộ mới! 🏠✨ Rất vui được chia sẻ không gian tuyệt vời này với mọi người. Ai quan tâm có thể inbox mình nhé!',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
      likes: 124,
      comments: 18,
      shares: 5,
      timestamp: '2 giờ trước',
      isLiked: false
    },
    {
      id: 2,
      author: {
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?img=3',
        role: 'Khách thuê',
        isHost: false
      },
      content: 'Cảm ơn HomeLand đã giúp mình tìm được căn nhà mơ ước! Chủ nhà rất thân thiện và nhiệt tình. Highly recommended! 🙏',
      images: [],
      likes: 89,
      comments: 12,
      shares: 3,
      timestamp: '5 giờ trước',
      isLiked: true
    },
    {
      id: 3,
      author: {
        name: 'Maria Garcia',
        avatar: 'https://i.pravatar.cc/150?img=5',
        role: 'Chủ nhà',
        isHost: true
      },
      content: 'Tips cho các bạn mới thuê nhà: Luôn kiểm tra kỹ hợp đồng và chụp ảnh tình trạng nhà trước khi vào ở. Điều này sẽ giúp tránh những hiểu lầm không đáng có! 📝',
      images: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800'],
      likes: 256,
      comments: 34,
      shares: 45,
      timestamp: '1 ngày trước',
      isLiked: false
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [showComments, setShowComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [following, setFollowing] = useState([]);

  // Load posts từ localStorage khi component mount
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    if (savedPosts.length > 0) {
      // Merge với posts mặc định, thêm ID unique
      const mergedPosts = savedPosts.map((post, idx) => ({
        ...post,
        id: `saved-${idx}`,
        likes: post.likes || 0,
        comments: post.comments || 0,
        shares: post.shares || 0,
        isLiked: false
      }));
      setPosts(prevPosts => [...mergedPosts, ...prevPosts]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleComment = (postId) => {
    if (!commentText[postId]?.trim()) return;
    
    toast.success('Đã bình luận!');
    setCommentText({ ...commentText, [postId]: '' });
    
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, comments: post.comments + 1 }
        : post
    ));
  };

  const handleShare = (postId) => {
    toast.success('Đã chia sẻ bài viết!');
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, shares: post.shares + 1 }
        : post
    ));
  };

  const handleFollow = (authorName) => {
    if (following.includes(authorName)) {
      setFollowing(following.filter(name => name !== authorName));
      toast.info(`Đã bỏ theo dõi ${authorName}`);
    } else {
      setFollowing([...following, authorName]);
      toast.success(`Đang theo dõi ${authorName}`);
    }
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) {
      toast.warning('Vui lòng nhập nội dung!');
      return;
    }

    const post = {
      id: posts.length + 1,
      author: {
        name: user?.username || 'Bạn',
        avatar: getUserAvatar(),
        role: 'Thành viên',
        isHost: false
      },
      content: newPost,
      images: [],
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: 'Vừa xong',
      isLiked: false
    };

    setPosts([post, ...posts]);
    setNewPost('');
    toast.success('Đã đăng bài!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - User Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-6"
            >
              <div className="text-center">
                <img
                  src={getUserAvatar()}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-violet-500"
                />
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  {user?.username || 'Khách'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {user?.email || 'guest@example.com'}
                </p>
                
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-2xl font-bold text-violet-600">12</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Bài viết</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-violet-600">{following.length}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Đang theo dõi</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-violet-600">156</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Người theo dõi</p>
                  </div>
                </div>

                <Link
                  to="/become-host"
                  className="block w-full mt-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-2 rounded-xl transition"
                >
                  Trở thành chủ nhà
                </Link>
              </div>
            </motion.div>

            {/* Suggested Hosts */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-6"
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Chủ nhà nổi bật</h3>
              <div className="space-y-3">
                {['Sofia Gomes', 'Maria Garcia', 'David Kim'].map((name, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://i.pravatar.cc/150?img=${idx + 1}`}
                        alt={name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Chủ nhà</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollow(name)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        following.includes(name)
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          : 'bg-violet-600 hover:bg-violet-700 text-white'
                      }`}
                    >
                      {following.includes(name) ? <><FaCheck className="inline mr-1" />Đang theo dõi</> : <><FaUserPlus className="inline mr-1" />Theo dõi</>}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2">
            {/* Create Post */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6"
            >
              <div className="flex gap-3">
                <img
                  src={getUserAvatar()}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Bạn đang nghĩ gì?"
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white resize-none"
                    rows="3"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-600 dark:text-gray-400">
                        <FaImage className="text-green-500" />
                        <span className="text-sm">Ảnh</span>
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-600 dark:text-gray-400">
                        <FaVideo className="text-red-500" />
                        <span className="text-sm">Video</span>
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-600 dark:text-gray-400">
                        <FaSmile className="text-yellow-500" />
                        <span className="text-sm">Cảm xúc</span>
                      </button>
                    </div>
                    <button
                      onClick={handleCreatePost}
                      className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                    >
                      Đăng
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-900 dark:text-white">{post.author.name}</h4>
                            {post.author.isHost && (
                              <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-semibold rounded-full">
                                Chủ nhà
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFollow(post.author.name)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                          following.includes(post.author.name)
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            : 'bg-violet-600 hover:bg-violet-700 text-white'
                        }`}
                      >
                        {following.includes(post.author.name) ? 'Đang theo dõi' : 'Theo dõi'}
                      </button>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">{post.content}</p>

                    {/* Post Images */}
                    {post.images.length > 0 && (
                      <div className={`grid ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 mb-4`}>
                        {post.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt="Post"
                            className="w-full h-64 object-cover rounded-xl"
                          />
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 py-3 border-t border-gray-200 dark:border-gray-700">
                      <span>{post.likes} lượt thích</span>
                      <div className="flex gap-4">
                        <span>{post.comments} bình luận</span>
                        <span>{post.shares} chia sẻ</span>
                      </div>
                    </div>

                    {/* View House Button (if houseData exists) */}
                    {post.houseData && (
                      <div className="mt-4">
                        <button
                          onClick={() => navigate(`/property/${post.houseData._id}`)}
                          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                        >
                          <FaHome />
                          Xem chi tiết nhà
                        </button>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center justify-center gap-2 py-2 rounded-lg transition ${
                          post.isLiked
                            ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <FaHeart className={post.isLiked ? 'fill-current' : ''} />
                        <span className="font-semibold text-sm">Thích</span>
                      </button>
                      <button
                        onClick={() => setShowComments({ ...showComments, [post.id]: !showComments[post.id] })}
                        className="flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        <FaComment />
                        <span className="font-semibold text-sm">Bình luận</span>
                      </button>
                      <button
                        onClick={() => handleShare(post.id)}
                        className="flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        <FaShare />
                        <span className="font-semibold text-sm">Chia sẻ</span>
                      </button>
                    </div>

                    {/* Comments Section */}
                    {showComments[post.id] && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex gap-2">
                          <img
                            src={getUserAvatar()}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={commentText[post.id] || ''}
                              onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                              placeholder="Viết bình luận..."
                              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm text-gray-900 dark:text-white"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleComment(post.id);
                              }}
                            />
                            <button
                              onClick={() => handleComment(post.id)}
                              className="p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-full transition"
                            >
                              <FaPaperPlane className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
