const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, viewBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen'
            }
        })
        await request.post('/api/users', {
            data: {
                name: 'adam',
                username: 'adam',
                password: 'password'
            }
        })

        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /log in to application/i})).toBeVisible()

        await expect(page.getByLabel(/username/i)).toBeVisible()
        await expect(page.getByLabel(/password/i)).toBeVisible()
        await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
            await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'mluukkai', 'wrong')

            const errorDiv = page.locator('.error')
            await expect(errorDiv).toContainText('wrong username or password')
            await expect(errorDiv).toHaveCSS('border-style', 'solid')
            await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

            await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
        })
  })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
        })

        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'TITLE', 'USER', 'www.TEST.com')
            await expect(page.getByText(`a new blog TITLE by USER added`)).toBeVisible()
        })

        test('a blog can be liked', async ({ page }) => {
            await createBlog(page, 'TITLE', 'USER', 'www.TEST.com')
            await viewBlog(page, 'TITLE by USER')
            await page.getByRole('button', {name: 'like'}).click()
            await expect(page.getByText('likes 1')).toBeVisible()
        })

        test('user can delete blog that they created', async ({ page }) => {
            await createBlog(page, 'TITLE', 'USER', 'www.TEST.com')
            await viewBlog(page, 'TITLE by USER')

            const blogElement = page.locator('.blog', { hasText: 'TITLE by USER' })

            page.once('dialog', async dialog => {
                expect(dialog.type()).toBe('confirm')
                await dialog.accept()
            })

            await blogElement.getByRole('button', {name: 'delete'}).click()            

            await expect(blogElement).not.toBeVisible()
        })

        test('other users cannot see delete', async ({ page }) => {
            await createBlog(page, 'TITLE', 'USER', 'www.TEST.com')
            await page.getByRole('button', {name: 'logout'}).click()  
            await loginWith(page, 'adam', 'password')

            const blogElement = page.locator('.blog', { hasText: 'TITLE by USER' })
            await viewBlog(page, 'TITLE by USER')

            await expect(blogElement.getByText('delete')).not.toBeVisible() 
        })

        test('blogs are ordered by likes', async ({ page }) => {
            // create three blogs
            await createBlog(page, 'First Blog', 'UserA', 'a.com')
            await createBlog(page, 'Second Blog', 'UserB', 'b.com')
            await createBlog(page, 'Third Blog', 'UserC', 'c.com')

            // like the second blog 2 times
            await viewBlog(page, 'Second Blog by UserB')
            await page.getByRole('button', { name: 'like' }).click()
            await page.getByRole('button', { name: 'like' }).click()

            // like the third blog 1 time
            await viewBlog(page, 'Third Blog by UserC')
            await page.getByRole('button', { name: 'like' }).click()

            // now check the order in the DOM
            const blogs = page.locator('.blog')
            const firstBlogText = await blogs.nth(0).innerText()
            const secondBlogText = await blogs.nth(1).innerText()
            const thirdBlogText = await blogs.nth(2).innerText()

            // most liked should come first
            expect(firstBlogText).toContain('Second Blog')
            expect(secondBlogText).toContain('Third Blog')
            expect(thirdBlogText).toContain('First Blog')
        })
    })

})