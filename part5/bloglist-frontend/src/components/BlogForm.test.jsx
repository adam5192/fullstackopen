import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('Blog form', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')

    await user.type(titleInput, 'testing')
    await user.type(authorInput, 'adam')
    await user.type(urlInput, 'test.com')

    const submitButton = screen.getByText('create')
    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog).toHaveBeenCalledWith({
    title: 'testing',
    author: 'adam',
    url: 'test.com',
    }, expect.any(String) ) // any string refers to the extra messageText paremeter
})