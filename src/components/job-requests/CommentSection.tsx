'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { JobRequestComment } from '@/types/job-request';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Trash2 } from 'lucide-react';

interface CommentSectionProps {
  requestId: string;
}

export function CommentSection({ requestId }: CommentSectionProps) {
  const { user } = useUser();
  const [comments, setComments] = useState<JobRequestComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [requestId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/job-requests/${requestId}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/job-requests/${requestId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: newComment,
          author_name: user?.fullName || 'Anonymous',
        }),
      });

      if (!response.ok) throw new Error('Failed to add comment');

      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`/api/job-requests/${requestId}/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete comment');
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center space-x-2">
        <MessageSquare size={18} />
        <span>Comments & Notes</span>
      </h3>

      {/* Add comment form */}
      <form onSubmit={handleSubmitComment} className="mb-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment or note..."
          rows={3}
          className="mb-2"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? 'Adding...' : 'Add Comment'}
          </Button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {comment.author_name || 'Anonymous'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}