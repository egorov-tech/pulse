import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import newsService from '@/features/posts/services/newsService.js'
import store from '@/features/posts/store/index.js'
import components from '@/shared/ui'
import directives from '@/shared/lib/index.js'
import PostPage from './PostPage.vue'

vi.mock('@/features/posts/services/newsService.js', async (importOriginal) => {
    const original = (await importOriginal()).default
    return { default: { ...original, fetchArticles: vi.fn() } }
})

const article = (id, title) => ({
    id,
    title,
    body: 'Body',
    url: 'https://dev.to',
    source: 'DEV Community',
    publishedAt: new Date().toISOString(),
    author: null,
    authorAvatar: null,
    image: null,
    tags: ['vue'],
    category: 'vue',
    readingTime: 3,
    reactions: 0,
    comments: 0,
})

async function mountPage() {
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [{ path: '/', component: PostPage }],
    })
    await router.push('/')

    const wrapper = mount(PostPage, {
        global: {
            plugins: [router, store],
            components: Object.fromEntries(components.map((c) => [c.name, c])),
            directives: Object.fromEntries(directives.map((d) => [d.name, d])),
        },
    })
    await flushPromises()
    return wrapper
}

beforeEach(() => {
    vi.stubGlobal(
        'IntersectionObserver',
        class {
            observe() {}
            disconnect() {}
        }
    )
    store.commit('post/setPosts', [])
})

describe('PostPage', () => {
    it('renders articles returned by the API', async () => {
        newsService.fetchArticles.mockResolvedValue({
            articles: [article(1, 'First story'), article(2, 'Second story')],
            hasMore: false,
        })

        const wrapper = await mountPage()

        expect(wrapper.text()).toContain('First story')
        expect(wrapper.text()).toContain('Second story')
    })

    it('shows fallback articles when the API is down', async () => {
        newsService.fetchArticles.mockRejectedValue(new Error('Network Error'))

        const wrapper = await mountPage()

        expect(wrapper.text()).toContain('Breakthrough in Quantum Computing Achieved')
    })
})
