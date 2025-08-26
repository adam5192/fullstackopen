import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }

    if (isError === true) {
      return <div className="error">{message}</div>
    }

    return <div className="success">{message}</div>
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog">
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const addBlog = async (blogObject, messageText) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setMessage(messageText)
      setTimeout(() => {
        setIsError(false)
        setMessage(null)
      }, 5000)
    } catch {
      setIsError(true)
      setMessage('blog not added')
      setTimeout(() => {
        setIsError(false)
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setIsError(true)
      setMessage('wrong username or password')
      setTimeout(() => {
        setIsError(false)
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    window.location.reload()
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: (blog.likes || 0) + 1,
      user: blog.user?.id || blog.user?._id || blog.user,
    }

    try {
      const updated = await blogService.update(blog.id, updatedBlog)
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === blog.id ? { ...b, likes: updated.likes } : b,
        ),
      )
    } catch {
      setIsError(true)
      setMessage('could not like the blog')
      setTimeout(() => {
        setIsError(false)
        setMessage(null)
      }, 5000)
    }
  }

  const handleDelete = async (blog) => {
    const ok = window.confirm(
      `Remove blog '${blog.title}' by '${blog.author}'`,
    )
    if (!ok) return
    try {
      await blogService.remove(blog.id)
      setBlogs((prev) => prev.filter((b) => b.id !== blog.id))
      setIsError(false)
      setMessage(`Removed '${blog.title}'`)
      setTimeout(() => setMessage(null), 5000)
    } catch {
      setIsError(true)
      setMessage('could not delete the blog')
      setTimeout(() => {
        setIsError(false)
        setMessage(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      {blogForm()}
      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes) // highest likes first
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            onLike={handleLike}
            onDelete={handleDelete}
            currentUser={user}
          />
        ))}
    </div>
  )
}

export default App
