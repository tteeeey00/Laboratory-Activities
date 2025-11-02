import React from 'react';
import { Post } from '../types';
import { MessageCircle, Calendar, User, Heart } from 'lucide-react';
import { postsAPI } from '../services/api';

interface PostCardProps {
  post: Post;
  onClick: () => void;
  onLikeUpdate?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick, onLikeUpdate }) => {
  const [likes, setLikes] = React.useState(post.likes || 0);
  const [isLiking, setIsLiking] = React.useState(false);
  const [hasLiked, setHasLiked] = React.useState(false);

  React.useEffect(() => {
    // Check if user (logged in or guest) has already liked this post
    const currentUser = localStorage.getItem('user');
    const storageKey = currentUser 
      ? `likedPosts_${JSON.parse(currentUser).id}` 
      : 'likedPosts_guest';
    
    const likedPosts = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setHasLiked(likedPosts.includes(post.id));
  }, [post.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking || hasLiked) return;

    try {
      setIsLiking(true);
      await postsAPI.like(post.id);
      setLikes(prev => prev + 1);
      setHasLiked(true);
      
      // Store liked post in localStorage (for both logged-in users and guests)
      const currentUser = localStorage.getItem('user');
      const storageKey = currentUser 
        ? `likedPosts_${JSON.parse(currentUser).id}` 
        : 'likedPosts_guest';
      
      const likedPosts = JSON.parse(localStorage.getItem(storageKey) || '[]');
      likedPosts.push(post.id);
      localStorage.setItem(storageKey, JSON.stringify(likedPosts));
      
      if (onLikeUpdate) onLikeUpdate();
    } catch (err) {
      console.error('Failed to like post');
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer p-6 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
        {post.title}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
        {post.content}
      </p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
            <User size={16} className="mr-1 text-blue-600" />
            <span className="font-medium">{post.author.username}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={16} className="mr-1 text-gray-400" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleLike}
            disabled={isLiking || hasLiked}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-all ${
              hasLiked
                ? 'bg-red-100 text-red-600 cursor-not-allowed'
                : 'bg-red-50 hover:bg-red-100 text-red-600 hover:scale-105'
            } disabled:opacity-50`}
            title={hasLiked ? 'You already liked this post' : 'Like this post'}
          >
            <Heart size={16} className={isLiking ? 'animate-pulse' : hasLiked ? 'fill-current' : ''} />
            <span className="font-semibold">{likes}</span>
          </button>
          {post.commentsCount !== undefined && (
            <div className="flex items-center space-x-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">
              <MessageCircle size={16} />
              <span className="font-semibold">{post.commentsCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
