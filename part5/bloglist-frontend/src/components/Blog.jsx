import { useState } from 'react'

const Blog = ({ blog, onLike, onDelete, currentUser }) => {
  const [showDetails, setShowDetails] = useState(false)

  const ownedByCurrentUser =
    (blog.user?.username && blog.user.username === currentUser?.username) ||
    (blog.user?.id && blog.user.id === currentUser?.id) ||
    (typeof blog.user === 'string' && blog.user === currentUser?.id)

  return (
    <div className="blog">
      {blog.title} by {blog.author}{' '}
      <button onClick={() => setShowDetails((s) => !s)}>
        {showDetails ? 'hide' : 'view'}
      </button>
      {showDetails && (
        <div className="details">
          <p>{blog.url}</p>
          <p>
            likes {blog.likes}{' '}
            <button onClick={() => onLike(blog)}>like</button>
          </p>
          <p>{blog.author}</p>
          {ownedByCurrentUser && (
            <button onClick={() => onDelete(blog)}>delete</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
