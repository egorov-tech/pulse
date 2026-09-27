import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, withDirectives } from 'vue'
import { mount } from '@vue/test-utils'
import VIntersection from './VIntersection.js'

let instances

beforeEach(() => {
    instances = []
    vi.stubGlobal(
        'IntersectionObserver',
        class {
            constructor(callback) {
                this.callback = callback
                this.observe = vi.fn()
                this.disconnect = vi.fn()
                instances.push(this)
            }
        }
    )
})

afterEach(() => vi.unstubAllGlobals())

function mountWithDirective(onVisible) {
    return mount({ render: () => withDirectives(h('div'), [[VIntersection, onVisible]]) })
}

describe('v-intersection', () => {
    it('calls the handler only when the target becomes visible', () => {
        const onVisible = vi.fn()
        mountWithDirective(onVisible)

        instances[0].callback([{ isIntersecting: false }])
        expect(onVisible).not.toHaveBeenCalled()

        instances[0].callback([{ isIntersecting: true }])
        expect(onVisible).toHaveBeenCalledOnce()
    })

    it('disconnects the observer on unmount', () => {
        const wrapper = mountWithDirective(vi.fn())
        wrapper.unmount()
        expect(instances[0].disconnect).toHaveBeenCalledOnce()
    })
})
