import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FaUser, FaStar, FaReply, FaChevronDown, FaChevronUp, FaEnvelope } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

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
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyStates, setReplyStates] = useState<Record<number, { show: boolean; content: string }>>({});
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());

  // ✅ التحقق من تفعيل البريد الإلكتروني
  const isEmailVerified = user?.email_verified_at !== null && user?.email_verified_at !== undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const handleReplySubmit = (commentId: number) => {
    const state = replyStates[commentId];
    if (state?.content.trim()) {
      setReplyStates(prev => ({ ...prev, [commentId]: { show: false, content: '' } }));
    }
  };

  const toggleReply = (commentId: number) => {
    setReplyStates(prev => ({
      ...prev,
      [commentId]: {
        show: !prev[commentId]?.show,
        content: prev[commentId]?.content || '',
      },
    }));
  };

  const updateReplyContent = (commentId: number, content: string) => {
    setReplyStates(prev => ({
      ...prev,
      [commentId]: {
        show: prev[commentId]?.show || false,
        content,
      },
    }));
  };

  const toggleReplies = (commentId: number) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diff = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    if (diff < 60) return 'الآن';
    if (diff < 3600) return `${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ساعة`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} يوم`;
    return commentDate.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const mockComments: Comment[] = [
    {
      id: 1,
      user: { name: 'أحمد محمد', is_verified: true },
      content: 'منتج رائع جداً، أنصح بالتعامل مع المعلن. الجودة ممتازة والسعر مناسب 👍',
      rating: 5,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      replies: [
        {
          id: 2,
          user: { name: 'المعلن', is_verified: true },
          content: 'شكراً لك على تقييمك الجميل 🙏 يسعدني خدمتك',
          created_at: new Date(Date.now() - 1800000).toISOString(),
          replies: [
            {
              id: 3,
              user: { name: 'محمود علي' },
              content: 'أنا أيضاً تعاملت معه وكانت تجربة ممتازة',
              created_at: new Date(Date.now() - 900000).toISOString(),
              replies: [
                {
                  id: 4,
                  user: { name: 'أحمد محمد', is_verified: true },
                  content: 'فعلاً هو شخص محترم وأمين 🤝',
                  created_at: new Date(Date.now() - 600000).toISOString(),
                  replies: [
                    {
                      id: 5,
                      user: { name: 'المعلن', is_verified: true },
                      content: 'شكراً لكما على ثقتكم 🙏',
                      created_at: new Date(Date.now() - 300000).toISOString(),
                      replies: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 6,
          user: { name: 'نورا خالد', is_verified: true },
          content: 'كم سعر الشحن؟',
          created_at: new Date(Date.now() - 600000).toISOString(),
          replies: [
            {
              id: 7,
              user: { name: 'المعلن', is_verified: true },
              content: '@نورا خالد الشحن مجاني داخل غزة',
              created_at: new Date(Date.now() - 300000).toISOString(),
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: 8,
      user: { name: 'سارة خالد' },
      content: 'هل المنتج لا يزال متوفراً؟',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      replies: [
        {
          id: 9,
          user: { name: 'المعلن', is_verified: true },
          content: 'نعم لا يزال متوفراً، تواصل معي على واتساب',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          replies: [
            {
              id: 10,
              user: { name: 'سارة خالد' },
              content: 'تمام شكراً سأتصل بك',
              created_at: new Date(Date.now() - 1800000).toISOString(),
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: 11,
      user: { name: 'محمد حسن' },
      content: 'سعر ممتاز مقارنة بالجودة 👌',
      created_at: new Date(Date.now() - 10800000).toISOString(),
      replies: [],
    },
    {
      id: 12,
      user: { name: 'ليلى عمر', is_verified: true },
      content: 'هل تقبل الدفع عند الاستلام؟',
      created_at: new Date(Date.now() - 14400000).toISOString(),
      replies: [
        {
          id: 13,
          user: { name: 'المعلن', is_verified: true },
          content: 'نعم، الدفع عند الاستلام متاح',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          replies: [
            {
              id: 14,
              user: { name: 'ليلى عمر', is_verified: true },
              content: 'ممتاز شكراً لك',
              created_at: new Date(Date.now() - 3600000).toISOString(),
              replies: [
                {
                  id: 15,
                  user: { name: 'أحمد صلاح' },
                  content: 'أنا أيضاً أبحث عن نفس الشيء',
                  created_at: new Date(Date.now() - 1800000).toISOString(),
                  replies: [
                    {
                      id: 16,
                      user: { name: 'المعلن', is_verified: true },
                      content: '@أحمد صلاح مرحباً، يمكنك التواصل معي أيضاً',
                      created_at: new Date(Date.now() - 600000).toISOString(),
                      replies: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const displayComments = comments.length > 0 ? comments : mockComments;

  const renderReplies = (replies: Comment[], depth: number = 0) => {
    const maxDepth = 4;
    const indent = Math.min(depth, maxDepth);

    return replies.map((reply) => {
      const hasReplies = reply.replies && reply.replies.length > 0;
      const isExpanded = expandedReplies.has(reply.id);
      const replyCount = reply.replies?.length || 0;
      const isReply = depth > 0;

      return (
        <div key={reply.id}>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              padding: '4px 0',
              marginRight: isReply ? `${indent * 16}px` : '0',
              borderRight: isReply ? `2px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.08)'}` : 'none',
              paddingRight: isReply ? '12px' : '0',
            }}
          >
            <div
              style={{
                width: isReply ? '28px' : '36px',
                height: isReply ? '28px' : '36px',
                borderRadius: '50%',
                backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDark ? '#C49A6C' : '#8B5A2B',
                fontSize: isReply ? '10px' : '14px',
                flexShrink: 0,
                marginTop: '2px',
              }}
            >
              <FaUser />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F0F2F5',
                  borderRadius: '12px',
                  padding: isReply ? '6px 12px' : '8px 14px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: isReply ? '0.75rem' : '0.85rem',
                      fontWeight: 700,
                      fontFamily: 'Cairo, sans-serif',
                    }}
                  >
                    {reply.user.name}
                  </span>
                  {reply.user.is_verified && (
                    <span
                      style={{
                        backgroundColor: '#28A745',
                        color: '#FFFFFF',
                        fontSize: '0.35rem',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        fontWeight: 600,
                      }}
                    >
                      موثق
                    </span>
                  )}
                  {reply.rating && (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        color: '#F5A623',
                        fontSize: '0.6rem',
                      }}
                    >
                      <FaStar size={8} />
                      {reply.rating}
                    </span>
                  )}
                  <span
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: isReply ? '0.55rem' : '0.65rem',
                      fontFamily: 'Cairo, sans-serif',
                      marginRight: 'auto',
                    }}
                  >
                    {formatDate(reply.created_at)}
                  </span>
                </div>
                <p
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: isReply ? '0.8rem' : '0.9rem',
                    lineHeight: 1.5,
                    fontFamily: 'Cairo, sans-serif',
                    margin: '2px 0 0',
                  }}
                >
                  {reply.content}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: isReply ? '2px 12px' : '4px 14px',
                }}
              >
                {isLoggedIn && isEmailVerified && (
                  <button
                    onClick={() => toggleReply(reply.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: isReply ? '0.65rem' : '0.75rem',
                      fontFamily: 'Cairo, sans-serif',
                      padding: '2px 0',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--primary-orange)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    <FaReply size={isReply ? 10 : 12} />
                    رد
                  </button>
                )}

                {hasReplies && (
                  <button
                    onClick={() => toggleReplies(reply.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: isReply ? '0.65rem' : '0.75rem',
                      fontFamily: 'Cairo, sans-serif',
                      padding: '2px 0',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--primary-orange)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    {isExpanded ? <FaChevronUp size={isReply ? 8 : 10} /> : <FaChevronDown size={isReply ? 8 : 10} />}
                    {isExpanded ? 'إخفاء' : 'عرض'} {replyCount} ردود
                  </button>
                )}
              </div>

              <AnimatePresence>
                {replyStates[reply.id]?.show && isLoggedIn && isEmailVerified && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        marginTop: '4px',
                        paddingRight: isReply ? '12px' : '14px',
                      }}
                    >
                      <div
                        style={{
                          width: isReply ? '26px' : '32px',
                          height: isReply ? '26px' : '32px',
                          borderRadius: '50%',
                          backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isDark ? '#C49A6C' : '#8B5A2B',
                          fontSize: isReply ? '9px' : '12px',
                          flexShrink: 0,
                        }}
                      >
                        <FaUser />
                      </div>
                      <div style={{ flex: 1 }}>
                        <Form.Control
                          as="textarea"
                          rows={1}
                          placeholder="اكتب رداً..."
                          value={replyStates[reply.id]?.content || ''}
                          onChange={(e) => updateReplyContent(reply.id, e.target.value)}
                          style={{
                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F0F2F5',
                            border: 'none',
                            color: 'var(--text-primary)',
                            borderRadius: '20px',
                            fontFamily: 'Cairo, sans-serif',
                            resize: 'none',
                            padding: isReply ? '6px 14px' : '8px 16px',
                            minHeight: isReply ? '30px' : '36px',
                            fontSize: isReply ? '0.75rem' : '0.85rem',
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleReplySubmit(reply.id);
                            }
                          }}
                        />
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                          <Button
                            size="sm"
                            disabled={!replyStates[reply.id]?.content.trim()}
                            onClick={() => handleReplySubmit(reply.id)}
                            style={{
                              backgroundColor: 'var(--primary-orange)',
                              borderColor: 'var(--primary-orange)',
                              color: '#FFFFFF',
                              borderRadius: '20px',
                              padding: isReply ? '1px 12px' : '2px 16px',
                              fontWeight: 600,
                              fontFamily: 'Cairo, sans-serif',
                              fontSize: isReply ? '0.65rem' : '0.75rem',
                              opacity: replyStates[reply.id]?.content.trim() ? 1 : 0.5,
                            }}
                          >
                            رد
                          </Button>
                          <Button
                            size="sm"
                            variant="link"
                            onClick={() => toggleReply(reply.id)}
                            style={{
                              color: 'var(--text-muted)',
                              textDecoration: 'none',
                              fontFamily: 'Cairo, sans-serif',
                              fontSize: isReply ? '0.65rem' : '0.75rem',
                              padding: isReply ? '1px 6px' : '2px 8px',
                            }}
                          >
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {hasReplies && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    {renderReplies(reply.replies!, depth + 1)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      );
    });
  };

  const countAllComments = (items: Comment[]): number => {
    let count = items.length;
    items.forEach(item => {
      if (item.replies) {
        count += countAllComments(item.replies);
      }
    });
    return count;
  };

  const totalComments = countAllComments(displayComments);

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        padding: '1.5rem 1.5rem 1rem',
        boxShadow: '0 2px 12px var(--shadow-sm)',
        border: '1px solid var(--border-color)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}
      >
        <h4
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            fontWeight: 700,
            fontFamily: 'Cairo, sans-serif',
            margin: 0,
          }}
        >
          💬 التعليقات ({totalComments})
        </h4>
        <span
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          {displayComments.length} محادثة
        </span>
      </div>

      {isLoggedIn ? (
        isEmailVerified ? (
          <Form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? '#C49A6C' : '#8B5A2B',
                  fontSize: '14px',
                  flexShrink: 0,
                  marginTop: '4px',
                }}
              >
                <FaUser />
              </div>
              <div style={{ flex: 1 }}>
                <Form.Control
                  as="textarea"
                  rows={1}
                  placeholder="اكتب تعليقاً..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F0F2F5',
                    border: 'none',
                    color: 'var(--text-primary)',
                    borderRadius: '20px',
                    fontFamily: 'Cairo, sans-serif',
                    resize: 'none',
                    padding: '10px 16px',
                    minHeight: '40px',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.08)' : '#E4E6EB';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : '#F0F2F5';
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <Button
                    type="submit"
                    disabled={!newComment.trim()}
                    size="sm"
                    style={{
                      backgroundColor: 'var(--primary-orange)',
                      borderColor: 'var(--primary-orange)',
                      color: '#FFFFFF',
                      borderRadius: '20px',
                      padding: '4px 20px',
                      fontWeight: 600,
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.85rem',
                      transition: 'all 0.3s ease',
                      opacity: newComment.trim() ? 1 : 0.5,
                    }}
                    onMouseEnter={(e) => {
                      if (newComment.trim()) {
                        e.currentTarget.style.backgroundColor = 'var(--primary-orange-dark)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
                    }}
                  >
                    نشر
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '0.75rem',
              backgroundColor: isDark ? 'rgba(255,193,7,0.1)' : 'rgba(255,193,7,0.08)',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              color: '#856404',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.9rem',
              border: '1px solid #FFC10740',
            }}
          >
            <FaEnvelope style={{ marginLeft: '8px', color: '#FFC107' }} />
            <Link to="/verify-email" style={{ color: 'var(--primary-orange)', fontWeight: 600 }}>
              فعّل بريدك الإلكتروني
            </Link>
            {' '}لتتمكن من إضافة تعليقات
          </div>
        )
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '0.75rem',
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F0F2F5',
            borderRadius: '20px',
            marginBottom: '1.5rem',
            color: 'var(--text-muted)',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.9rem',
          }}
        >
          <Link to="/login" style={{ color: 'var(--primary-orange)', fontWeight: 600 }}>
            سجل الدخول
          </Link>
          {' '}لتضيف تعليقاً
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {displayComments.map((comment) => {
          const hasReplies = comment.replies && comment.replies.length > 0;
          const isExpanded = expandedReplies.has(comment.id);
          const replyCount = comment.replies?.length || 0;

          return (
            <div key={comment.id}>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '6px 4px',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDark ? '#C49A6C' : '#8B5A2B',
                    fontSize: '14px',
                    flexShrink: 0,
                  }}
                >
                  <FaUser />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F0F2F5',
                      borderRadius: '12px',
                      padding: '8px 14px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          fontFamily: 'Cairo, sans-serif',
                        }}
                      >
                        {comment.user.name}
                      </span>
                      {comment.user.is_verified && (
                        <span
                          style={{
                            backgroundColor: '#28A745',
                            color: '#FFFFFF',
                            fontSize: '0.4rem',
                            padding: '1px 6px',
                            borderRadius: '6px',
                            fontWeight: 600,
                          }}
                        >
                          موثق
                        </span>
                      )}
                      {comment.rating && (
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            color: '#F5A623',
                            fontSize: '0.7rem',
                          }}
                        >
                          <FaStar size={10} />
                          {comment.rating}
                        </span>
                      )}
                      <span
                        style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.65rem',
                          fontFamily: 'Cairo, sans-serif',
                          marginRight: 'auto',
                        }}
                      >
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                        fontFamily: 'Cairo, sans-serif',
                        margin: '4px 0 0',
                      }}
                    >
                      {comment.content}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '4px 14px',
                    }}
                  >
                    {isLoggedIn && isEmailVerified && (
                      <button
                        onClick={() => toggleReply(comment.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontFamily: 'Cairo, sans-serif',
                          padding: '4px 0',
                          transition: 'color 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--primary-orange)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                      >
                        <FaReply size={12} />
                        رد
                      </button>
                    )}

                    {hasReplies && (
                      <button
                        onClick={() => toggleReplies(comment.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontFamily: 'Cairo, sans-serif',
                          padding: '4px 0',
                          transition: 'color 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--primary-orange)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                      >
                        {isExpanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                        {isExpanded ? 'إخفاء' : 'عرض'} {replyCount} ردود
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {replyStates[comment.id]?.show && isLoggedIn && isEmailVerified && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: '10px',
                            marginTop: '6px',
                            paddingRight: '14px',
                          }}
                        >
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: isDark ? '#C49A6C' : '#8B5A2B',
                              fontSize: '12px',
                              flexShrink: 0,
                            }}
                          >
                            <FaUser />
                          </div>
                          <div style={{ flex: 1 }}>
                            <Form.Control
                              as="textarea"
                              rows={1}
                              placeholder="اكتب رداً..."
                              value={replyStates[comment.id]?.content || ''}
                              onChange={(e) => updateReplyContent(comment.id, e.target.value)}
                              style={{
                                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F0F2F5',
                                border: 'none',
                                color: 'var(--text-primary)',
                                borderRadius: '20px',
                                fontFamily: 'Cairo, sans-serif',
                                resize: 'none',
                                padding: '8px 16px',
                                minHeight: '36px',
                                fontSize: '0.85rem',
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleReplySubmit(comment.id);
                                }
                              }}
                            />
                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                              <Button
                                size="sm"
                                disabled={!replyStates[comment.id]?.content.trim()}
                                onClick={() => handleReplySubmit(comment.id)}
                                style={{
                                  backgroundColor: 'var(--primary-orange)',
                                  borderColor: 'var(--primary-orange)',
                                  color: '#FFFFFF',
                                  borderRadius: '20px',
                                  padding: '2px 16px',
                                  fontWeight: 600,
                                  fontFamily: 'Cairo, sans-serif',
                                  fontSize: '0.75rem',
                                  opacity: replyStates[comment.id]?.content.trim() ? 1 : 0.5,
                                }}
                              >
                                رد
                              </Button>
                              <Button
                                size="sm"
                                variant="link"
                                onClick={() => toggleReply(comment.id)}
                                style={{
                                  color: 'var(--text-muted)',
                                  textDecoration: 'none',
                                  fontFamily: 'Cairo, sans-serif',
                                  fontSize: '0.75rem',
                                  padding: '2px 8px',
                                }}
                              >
                                إلغاء
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {hasReplies && isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ marginTop: '4px' }}>
                          {renderReplies(comment.replies!, 1)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {displayComments.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.85rem',
              padding: '6px 16px',
              borderRadius: '20px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : '#F0F2F5';
              e.currentTarget.style.color = 'var(--primary-orange)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            عرض المزيد من التعليقات
          </button>
        </div>
      )}
    </div>
  );
};

export default AnnouncementComments;