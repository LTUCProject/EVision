import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Box, IconButton, Typography, Button, TextField } from '@mui/material';
import { faker } from '@faker-js/faker';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import './CommunityStyle.css';

const ClientCommunity = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [newComment, setNewComment] = useState({ content: '' });
    const [commentingPostId, setCommentingPostId] = useState(null);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentContent, setEditedCommentContent] = useState('');

    const getAccountIdFromToken = () => {
        const token = localStorage.getItem("token");
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        }
        return null;
    };

    const fetchPosts = async () => {
        try {
            const response = await axios.get('https://localhost:7080/api/Clients/posts', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            const fetchedPosts = Array.isArray(response.data.$values) ? response.data.$values : [];

            const sortedPosts = fetchedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

            setPosts(sortedPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        const accountId = getAccountIdFromToken();
        if (accountId) {
            const postData = {
                accountId: accountId,
                title: newPost.title,
                content: newPost.content,
                date: new Date().toISOString()
            };
            try {
                await axios.post('https://localhost:7080/api/Clients/posts', postData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                });
                setNewPost({ title: '', content: '' });
                fetchPosts();
            } catch (error) {
                console.error('Error submitting post:', error);
            }
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const accountId = getAccountIdFromToken();
        if (accountId && commentingPostId) {
            const commentData = {
                accountId: accountId,
                postId: commentingPostId,
                content: newComment.content,
                date: new Date().toISOString()
            };
            try {
                await axios.post('https://localhost:7080/api/Clients/comments', commentData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                });
                setNewComment({ content: '' });
                setCommentingPostId(null);
                fetchPosts();
            } catch (error) {
                console.error('Error submitting comment:', error);
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        const accountId = getAccountIdFromToken();
        const comment = posts.flatMap(post => post.comments.$values).find(comment => comment.commentId === commentId);
        if (accountId === comment.accountId) {
            try {
                await axios.delete(`https://localhost:7080/api/Clients/comments/${commentId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                fetchPosts();
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    const handleEditCommentClick = (comment) => {
        const accountId = getAccountIdFromToken();
        if (accountId === comment.accountId) {
            setEditingCommentId(comment.commentId);
            setEditedCommentContent(comment.content);
        } else {
            alert("You are not the owner of this comment.");
        }
    };

    const handleUpdateComment = async (commentId) => {
        const accountId = getAccountIdFromToken();
        if (accountId) {
            const updatedCommentData = {
                accountId: accountId,
                content: editedCommentContent,
                date: new Date().toISOString()
            };
            try {
                await axios.put(`https://localhost:7080/api/Clients/comments/${commentId}`, updatedCommentData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                });
                setEditingCommentId(null);
                setEditedCommentContent('');
                fetchPosts();
            } catch (error) {
                console.error('Error updating comment:', error);
            }
        }
    };

    const handleEditClick = (post) => {
        const accountId = getAccountIdFromToken();
        if (accountId === post.accountId) {
            setEditingPostId(post.postId);
        } else {
            alert("You are not the owner of this post.");
        }
    };

    const handleDeleteClick = async (postId, accountId) => {
        const currentAccountId = getAccountIdFromToken();
        if (currentAccountId === accountId) {
            try {
                await axios.delete(`https://localhost:7080/api/Clients/posts/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                fetchPosts();
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    const handleUpdatePost = async (postId) => {
        const accountId = getAccountIdFromToken();
        const post = posts.find((p) => p.postId === postId);
        if (accountId === post.accountId) {
            const updatedPostData = {
                accountId: accountId,
                title: post.title,
                content: post.content,
                date: new Date().toISOString()
            };
            try {
                await axios.put(`https://localhost:7080/api/Clients/posts/${postId}`, updatedPostData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                });
                setEditingPostId(null);
                fetchPosts();
            } catch (error) {
                console.error('Error updating post:', error);
            }
        }
    };

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const utcOffset = 3 * 60;
        const localDate = new Date(date.getTime() + utcOffset * 60 * 1000);

        return localDate.toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className='backgroundCO'>
            <Box className="posts-and-comments-container">
                <Typography variant="h4" component="h1" className="posts-header">Electric Car Enthusiasts</Typography>
    
                {/* Create Post Section */}
                <Box className="create-post-box">
                    <Box className="create-post-avatar-textfield">
                        <Avatar src={faker.image.avatar()} />
                        <TextField
                            label="What's on your mind?"
                            variant="outlined"
                            fullWidth
                            value={newPost.content}
                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        style={{
                            backgroundColor: '#007bff',
                            color: '#ffffff',
                            boxShadow: '0 6px 18px rgba(0, 123, 255, 0.15)',
                            transition: 'all 0.3s ease',
                        }}
                        onClick={handlePostSubmit}
                    >
                        Post
                    </Button>
                </Box>
    
                {/* Posts List */}
                {posts.map(post => (
                    <Box key={post.postId} className="post-item">
                        <Box className="post-header">
                            <Avatar src={faker.image.avatar()} />
                            <Typography variant="h6" className='h6'>{post.userName}</Typography>
                            {getAccountIdFromToken() === post.accountId && (
                                <IconButton onClick={() => handleEditClick(post)}>
                                    <EditIcon />
                                </IconButton>
                            )}
                        </Box>
                        {editingPostId === post.postId ? (
                            <>
                                <TextField
                                    label="Content"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={post.content}
                                    onChange={(e) => setPosts(posts.map(p => p.postId === post.postId ? { ...p, content: e.target.value } : p))}
                                />
                                <Button
                                    variant="contained"
                                    style={{
                                        backgroundColor: '#28a745',
                                        color: '#ffffff',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 10px rgba(40, 167, 69, 0.2)',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onClick={() => handleUpdatePost(post.postId)}
                                >
                                    Save
                                </Button>
                            </>
                        ) : (
                            <>
                                <Typography variant="caption" color="textSecondary">{formatDate(post.date)}</Typography>
                                <Typography variant="body1" className="post-content">{post.content}</Typography>
                            </>
                        )}
    
                        <Box className="post-actions">
                            <Button
                                startIcon={<FavoriteIcon />}
                                style={{
                                    backgroundColor: '#ffc107',
                                    color: '#212529',
                                    boxShadow: '0 4px 12px rgba(255, 193, 7, 0.2)',
                                    transition: 'all 0.3s ease',
                                }}
                                className='btL'
                            >
                                Like
                            </Button>
                            <Button
                                startIcon={<CommentIcon />}
                                style={{
                                    backgroundColor: '#17a2b8',
                                    color: '#ffffff',
                                    boxShadow: '0 4px 12px rgba(23, 162, 184, 0.2)',
                                    transition: 'all 0.3s ease',
                                }}
                                className='btC'
                                onClick={() => setCommentingPostId(post.postId)}
                            >
                                Comment
                            </Button>
                            {getAccountIdFromToken() === post.accountId && (
                                <Button
                                    className="delete-button"
                                    style={{
                                        backgroundColor: '#dc3545',
                                        color: '#ffffff',
                                        boxShadow: '0 4px 12px rgba(220, 53, 69, 0.2)',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onClick={() => handleDeleteClick(post.postId, post.accountId)}
                                >
                                    Delete
                                </Button>
                            )}
                        </Box>
    
                        {/* Comments Section */}
                        <Box className="comments-container">
                            {post.comments.$values.map(comment => (
                                <Box key={comment.commentId} className="comment-item">
                                    <Box className="comment-header">
                                        <Avatar src={faker.image.avatar()} />
                                        <Typography variant="body2">{comment.userName}</Typography>
                                        {getAccountIdFromToken() === comment.accountId && (
                                            <>
                                                <IconButton onClick={() => handleEditCommentClick(comment)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={() => handleDeleteComment(comment.commentId)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </>
                                        )}
                                    </Box>
                                    {editingCommentId === comment.commentId ? (
                                        <Box className="edit-comment-box">
                                            <TextField
                                                label="Edit Comment"
                                                value={editedCommentContent}
                                                onChange={(e) => setEditedCommentContent(e.target.value)}
                                                fullWidth
                                            />
                                            <Button
                                                variant="contained"
                                                style={{
                                                    backgroundColor: '#28a745',
                                                    color: '#ffffff',
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 10px rgba(40, 167, 69, 0.2)',
                                                    transition: 'all 0.3s ease',
                                                }}
                                                className='btU'
                                                onClick={() => handleUpdateComment(comment.commentId)}
                                            >
                                                Update
                                            </Button>
                                        </Box>
                                    ) : (
                                        <>
                                            <Typography variant="caption" color="textSecondary" className="comment-date">{formatDate(comment.date)}</Typography>
                                            <Typography variant="body2" className="comment-content">{comment.content}</Typography>
                                        </>
                                    )}
                                </Box>
                            ))}
                        </Box>
    
                        {/* Add Comment Section */}
                        {commentingPostId === post.postId ? (
                            <Box className="add-comment-box">
                                <Avatar src={faker.image.avatar()} />
                                <TextField
                                    label="Add a comment"
                                    fullWidth
                                    multiline
                                    value={newComment.content}
                                    onChange={(e) => setNewComment({ content: e.target.value })}
                                />
                                <Button
                                    variant="contained"
                                    style={{
                                        backgroundColor: '#007bff',
                                        color: '#ffffff',
                                        boxShadow: '0 6px 18px rgba(0, 123, 255, 0.15)',
                                        transition: 'all 0.3s ease',
                                    }}
                                    className='btP'
                                    onClick={handleCommentSubmit}
                                >
                                    Post Comment
                                </Button>
                            </Box>
                        ) : (
                            <Button
                                onClick={() => setCommentingPostId(post.postId)}
                                style={{
                                    backgroundColor: '#6c757d',
                                    color: '#ffffff',
                                    boxShadow: '0 4px 12px rgba(108, 117, 125, 0.2)',
                                    transition: 'all 0.3s ease',
                                }}
                                className='btA'
                            >
                                Add Comment
                            </Button>
                        )}
                    </Box>
                ))}
            </Box>
        </div>
    );
    
};

export default ClientCommunity;