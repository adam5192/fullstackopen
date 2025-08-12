const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let likes = 0
  blogs.forEach(blog => {
    likes+=blog.likes
  });
  return likes
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  let favorite = blogs[0]

  blogs.forEach(blog => {
    if(blog.likes > favorite.likes) {
      favorite = blog
    }
  })
  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  const authorCounts = {}

  blogs.forEach(blog => {
    if (authorCounts[blog.author]) {
      authorCounts[blog.author] += 1
    } else {
      authorCounts[blog.author] = 1
    }
  })

  let topAuthor = null
  let maxBlogs = 0

  for (const author in authorCounts) {
    if (authorCounts[author] > maxBlogs) {
      maxBlogs = authorCounts[author]
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    blogs: maxBlogs
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const authorCounts = {}

  blogs.forEach(blog => {
    if (authorCounts[blog.author]) {
      authorCounts[blog.author] += blog.likes
    } else {
      authorCounts[blog.author] = blog.likes
    }
  })

  let topAuthor = null
  let maxLikes = 0

  for (const author in authorCounts) {
    if (authorCounts[author] > maxLikes) {
      maxLikes = authorCounts[author]
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}