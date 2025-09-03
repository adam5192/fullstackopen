const loginWith = async (page, username, password) => {
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByLabel('title:').fill(title)
    await page.getByLabel('author:').fill(author)
    await page.getByLabel('url:').fill(url)

    await page.getByRole('button', { name: 'create' }).click()
}

const viewBlog = async (page, blog) => {
    const blogText = await page.getByText(blog)
    const blogElement = await blogText.locator('..')
    await blogElement.getByRole('button', { name: 'view' }).click()
}

export { loginWith, createBlog, viewBlog }