import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PostsAndComments.css';

const PostsAndComments = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [newComment, setNewComment] = useState({ postId: '', content: '' });

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
            setPosts(Array.isArray(response.data.$values) ? response.data.$values : []);
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
        if (accountId) {
            const commentData = {
                accountId: accountId,
                postId: newComment.postId,
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
                setNewComment({ postId: '', content: '' });
                fetchPosts();
            } catch (error) {
                console.error('Error submitting comment:', error);
            }
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Helper function to format the date and time for Jordan's timezone
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        // Adjust the date for UTC+3
        const utcOffset = 3 * 60; // Offset in minutes
        const localDate = new Date(date.getTime() + utcOffset * 60 * 1000); // Convert to milliseconds
    
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
    

    return (
        <div className="posts-and-comments-container">
            <h1 className="posts-header">Posts and Comments</h1>
            <h2 className="create-post-header">Create Post</h2>
            <form className="post-form" onSubmit={handlePostSubmit}>
                <input 
                    className="post-title-input"
                    type="text" 
                    placeholder="Title" 
                    value={newPost.title} 
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} 
                    required 
                />
                <textarea 
                    className="post-content-textarea"
                    placeholder="Content" 
                    value={newPost.content} 
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} 
                    required 
                />
                <button className="submit-post-button" type="submit">
                    Add Post
                </button>
            </form>

            <h2 className="posts-list-header">Posts</h2>
            <ul className="posts-list">
                {posts.map(post => (
                    <li key={post.postId} className="post-item">
                        <h3 className="post-title">{post.title}</h3>
                        <p className="post-content">{post.content}</p>
                        <p className="post-author-date">By: {post.userName} on {formatDate(post.date)}</p>
                        <h4 className="comments-header">Comments</h4>
                        <ul className="comments-list">
                            {post.comments.$values && post.comments.$values.map(comment => (
                                <li key={comment.commentId} className="comment-item">
                                    <p className="comment-content">{comment.content} by {comment.userName} on {formatDate(comment.date)}</p>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            <h2 className="add-comment-header">Add Comment</h2>
            <form className="comment-form" onSubmit={handleCommentSubmit}>
                <input 
                    className="comment-post-id-input"
                    type="text" 
                    placeholder="Post ID" 
                    value={newComment.postId} 
                    onChange={(e) => setNewComment({ ...newComment, postId: e.target.value })} 
                    required 
                />
                <textarea 
                    className="comment-content-textarea"
                    placeholder="Comment" 
                    value={newComment.content} 
                    onChange={(e) => setNewComment({ ...newComment, content: e.target.value })} 
                    required 
                />
                <button className="submit-comment-button" type="submit">Add Comment</button>
            </form>
        </div>
    );
};

export default PostsAndComments;
