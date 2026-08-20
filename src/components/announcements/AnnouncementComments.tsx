import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FaUser, FaStar, FaReply } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

interface Comment {
  id: number;
  user: {
    name: string;
    is_verified?: boolean;
  };
  content: string;
  rating?: number;
  created_at: string;
  replies?: Comment[];
}

interface AnnouncementCommentsProps {
  comments?: Comment[];
  isLoggedIn?: boolean;
  onAddComment?: (content: string) => void;
}

const AnnouncementComments = ({
  comments = [],
  isLoggedIn = false,
  onAddComment,
}: AnnouncementCommentsProps) => {
  const { isDark } = useTheme();
  const [newComment, setNewComment] = useState('');
  const [showReply, setShowReply] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Sample comments for demo
  const sampleComments: Comment[] = comments.length > 0 ? comments : [
    {
      id: 1,
      user: { name: 'أحمد محمد', is_verified: true },
      content: 'منتج رائع جداً، أنصح بالتعامل مع المعلن',
      rating: 5,
      created_at: new Date().toISOString(),
      replies: [
        {
          id: 2,
          user: { name: 'المعلن', is_verified: true },
          content: 'شكراً لك على تقييمك الجميل 🙏',
          created_at: new Date().toISOString(),
        },
      ],
    },
    {
      id: 3,
      user: { name: 'سارة خالد' },
      content: 'هل المنتج لا يزال متوفراً؟',
      created_at: new Date().toISOString(),
    },
  ];

  const displayComments = comments.length > 0 ? comments : sampleComments;

  return (
    <div
      style={{
        backgroundColor: isDark ? '#16213e' : '#FFFFFF',
        borderRadius: '16px',
        padding: '1.5rem 2rem',
        boxShadow: isDark
          ? '0 4px 16px rgba(0,0,0,0.2)'
          : '0 4px 16px rgba(0,0,0,0.04)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.06)'}`,
      }}
    >
      <h4
        style={{
          color: isDark ? '#FDF5E6' : '#6B4226',
          fontSize: '1.1rem',
          fontWeight: 700,
          fontFamily: 'Cairo, sans-serif',
          marginBottom: '1rem',
        }}
      >
        💬 التعليقات ({displayComments.length})
      </h4>

      {/* Add Comment */}
      {isLoggedIn ? (
        <Form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="أضف تعليقك..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{
                backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)',
                color: isDark ? '#FDF5E6' : '#6B4226',
                borderRadius: '12px',
                fontFamily: 'Cairo, sans-serif',
                resize: 'vertical',
              }}
            />
            <Button
              type="submit"
              disabled={!newComment.trim()}
              style={{
                backgroundColor: '#E87A20',
                borderColor: '#E87A20',
                color: '#FFFFFF',
                borderRadius: '12px',
                padding: '0 24px',
                fontWeight: 600,
                fontFamily: 'Cairo, sans-serif',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D46A1A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#E87A20';
              }}
            >
              نشر
            </Button>
          </div>
        </Form>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '1rem',
            backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            color: isDark ? '#C49A6C' : '#8B5A2B',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          💬 <Link to="/login" style={{ color: '#E87A20' }}>سجل الدخول</Link> لإضافة تعليق
        </div>
      )}

      {/* Comments List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {displayComments.map((comment) => (
          <div key={comment.id}>
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
                borderRadius: '12px',
              }}
            >
              {/* Comment Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isDark ? '#C49A6C' : '#8B5A2B',
                      fontSize: '12px',
                    }}
                  >
                    <FaUser />
                  </div>
                  <span
                    style={{
                      color: isDark ? '#FDF5E6' : '#6B4226',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      fontFamily: 'Cairo, sans-serif',
                    }}
                  >
                    {comment.user.name}
                    {comment.user.is_verified && (
                      <span
                        style={{
                          backgroundColor: '#28A745',
                          color: '#FFFFFF',
                          fontSize: '0.5rem',
                          padding: '1px 6px',
                          borderRadius: '10px',
                          fontWeight: 600,
                          marginRight: '6px',
                        }}
                      >
                        موثق
                      </span>
                    )}
                  </span>
                  {comment.rating && (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        color: '#F5A623',
                        fontSize: '0.75rem',
                      }}
                    >
                      <FaStar size={12} />
                      {comment.rating}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    color: isDark ? '#C49A6C' : '#8B5A2B',
                    fontSize: '0.7rem',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  {formatDate(comment.created_at)}
                </span>
              </div>

              {/* Comment Content */}
              <p
                style={{
                  color: isDark ? '#C49A6C' : '#6B4226',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '6px',
                }}
              >
                {comment.content}
              </p>

              {/* Reply Button */}
              {isLoggedIn && (
                <button
                  onClick={() => setShowReply(showReply === comment.id ? null : comment.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#E87A20',
                    fontSize: '0.8rem',
                    fontFamily: 'Cairo, sans-serif',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                  }}
                >
                  <FaReply size={12} />
                  رد
                </button>
              )}
            </div>

            {/* Reply Form */}
            {showReply === comment.id && isLoggedIn && (
              <div
                style={{
                  marginTop: '8px',
                  marginRight: '32px',
                  padding: '12px',
                  backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
                  borderRadius: '10px',
                }}
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    placeholder="اكتب ردك..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    style={{
                      backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
                      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)',
                      color: isDark ? '#FDF5E6' : '#6B4226',
                      borderRadius: '10px',
                      fontFamily: 'Cairo, sans-serif',
                    }}
                  />
                  <Button
                    size="sm"
                    disabled={!replyContent.trim()}
                    style={{
                      backgroundColor: '#E87A20',
                      borderColor: '#E87A20',
                      color: '#FFFFFF',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontFamily: 'Cairo, sans-serif',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#D46A1A';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#E87A20';
                    }}
                  >
                    رد
                  </Button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div style={{ marginRight: '32px', marginTop: '8px' }}>
                {comment.replies.map((reply) => (
                  <div
                    key={reply.id}
                    style={{
                      padding: '10px 14px',
                      backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
                      borderRadius: '10px',
                      marginBottom: '6px',
                      borderRight: `2px solid #E87A20`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                      }}
                    >
                      <span
                        style={{
                          color: isDark ? '#FDF5E6' : '#6B4226',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          fontFamily: 'Cairo, sans-serif',
                        }}
                      >
                        {reply.user.name}
                      </span>
                      <span
                        style={{
                          color: isDark ? '#C49A6C' : '#8B5A2B',
                          fontSize: '0.6rem',
                          fontFamily: 'Cairo, sans-serif',
                        }}
                      >
                        {formatDate(reply.created_at)}
                      </span>
                    </div>
                    <p
                      style={{
                        color: isDark ? '#C49A6C' : '#6B4226',
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                        fontFamily: 'Cairo, sans-serif',
                        marginBottom: 0,
                      }}
                    >
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementComments;