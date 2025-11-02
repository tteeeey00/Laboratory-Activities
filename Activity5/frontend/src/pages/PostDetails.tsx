import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI, commentsAPI } from '../services/api';
import { Post, Comment } from '../types';
import { MessageCircle, Trash2, Edit2, Heart, ArrowLeft, Save, X } from 'lucide-react';

const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [likes, setLikes] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  useEffect(() => {
    // Check if current user has already liked this post (stored per user in localStorage)
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const userId = JSON.parse(currentUser).id;
      const userLikedPosts = JSON.parse(localStorage.getItem(`likedPosts_${userId}`) || '[]');
      setHasLiked(userLikedPosts.includes(Number(id)));
    }
  }, [id]);

  const fetchPostAndComments = async () => {
    try {
      setLoading(true);
      const postData = await postsAPI.getById(Number(id));
      setPost(postData);
      setLikes(postData.likes || 0);
      
      const commentsData = await commentsAPI.getByPost(Number(id));
      setComments(commentsData);
    } catch (err: any) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      await commentsAPI.create(Number(id), newComment);
      setNewComment('');
      await fetchPostAndComments();
    } catch (err: any) {
      setError('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLike = async () => {
    if (isLiking || hasLiked) return;

    try {
      setIsLiking(true);
      await postsAPI.like(Number(id));
      setLikes(prev => prev + 1);
      setHasLiked(true);
      
      // Store liked post in localStorage per user
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        const userId = JSON.parse(currentUser).id;
        const userLikedPosts = JSON.parse(localStorage.getItem(`likedPosts_${userId}`) || '[]');
        userLikedPosts.push(Number(id));
        localStorage.setItem(`likedPosts_${userId}`, JSON.stringify(userLikedPosts));
      }
    } catch (err: any) {
      setError('Failed to like post');
    } finally {
      setIsLiking(false);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const handleSaveComment = async (commentId: number) => {
    if (!editCommentContent.trim()) return;

    try {
      await commentsAPI.update(Number(id), commentId, editCommentContent);
      setEditingCommentId(null);
      setEditCommentContent('');
      await fetchPostAndComments();
    } catch (err: any) {
      setError('Failed to update comment');
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentContent('');
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentsAPI.delete(Number(id), commentId);
      await fetchPostAndComments();
    } catch (err: any) {
      setError('Failed to delete comment');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await postsAPI.delete(Number(id));
      navigate('/');
    } catch (err: any) {
      setError('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-red-600">{error || 'Post not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </button>

        {/* Post */}
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-6 border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{post.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                  <span className="font-medium text-blue-600">By {post.author.username}</span>
                </div>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                disabled={isLiking || hasLiked}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all shadow-sm ${
                  hasLiked
                    ? 'bg-red-100 text-red-600 cursor-not-allowed'
                    : 'bg-red-50 hover:bg-red-100 text-red-600 hover:scale-105'
                } disabled:opacity-50`}
                title={hasLiked ? 'You already liked this post' : 'Like this post'}
              >
                <Heart size={20} className={isLiking ? 'animate-pulse' : hasLiked ? 'fill-current' : ''} />
                <span className="font-semibold">{likes}</span>
              </button>
              {user && user.id === post.authorId && (
                <>
                  <button
                    onClick={() => navigate(`/posts/${post.id}/edit`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">{post.content}</p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <MessageCircle className="mr-2 text-blue-600" size={28} />
            Comments ({comments.length})
          </h2>

          {/* Add Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="mb-8">
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={3}
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={commentLoading}
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={commentLoading || !newComment.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all font-medium"
                >
                  {commentLoading ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-center border border-blue-100">
              <p className="text-gray-700">
                Please{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  sign in
                </button>{' '}
                to comment
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <MessageCircle className="mx-auto mb-3 text-gray-400" size={48} />
                <p className="text-gray-500 text-lg">No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-all bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-lg">
                          {comment.author.username}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {editingCommentId === comment.id ? (
                        <div className="mt-2">
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            value={editCommentContent}
                            onChange={(e) => setEditCommentContent(e.target.value)}
                          />
                          <div className="mt-2 flex space-x-2">
                            <button
                              onClick={() => handleSaveComment(comment.id)}
                              className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm"
                            >
                              <Save size={14} className="mr-1" />
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all text-sm"
                            >
                              <X size={14} className="mr-1" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                      )}
                    </div>
                    {user && user.id === comment.authorId && editingCommentId !== comment.id && (
                      <div className="ml-4 flex space-x-1">
                        <button
                          onClick={() => handleEditComment(comment)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
