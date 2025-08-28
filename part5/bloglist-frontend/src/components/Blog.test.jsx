import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author but NOT Url or likes by default', () => {
    const blog = {
        title: 'Testing for correct render',
        author: 'adam',
        url: 'www.example.com',
        likes: '100'
    }

    render(<Blog blog={blog} />)

    // title and author visible
    expect(screen.getByText(/Testing for correct render/i)).toBeInTheDocument()
    expect(screen.getByText(/adam/i)).toBeInTheDocument()

    // url and likes should be hidden by default
    expect(screen.queryByText(/www.example.com/i)).toBeNull()
    expect(screen.queryByText(/likes 100/i)).toBeNull()
})

test('renders URL and likes when showDetails button is clicked', async () => {
    const blog = {
        title: 'Testing for showDetails',
        author: 'adam',
        url: 'www.example.com',
        likes: '100'
    }

    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    // url and likes should be visible
    expect(screen.queryByText(/www.example.com/i)).toBeInTheDocument()
    expect(screen.queryByText(/likes 100/i)).toBeInTheDocument()
})

test('clicking like button twice calls event handler twice', async () => {
    const blog = {
        title: 'Testing for like button',
        author: 'adam',
        url: 'www.example.com',
        likes: '100'
    }
  
  const mockHandler = vi.fn()
  render(<Blog blog={blog} onLike={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

