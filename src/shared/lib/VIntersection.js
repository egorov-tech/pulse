const observers = new WeakMap()

export default {
    mounted(el, binding) {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    binding.value()
                }
            },
            { rootMargin: '0px', threshold: 1.0 }
        )
        observer.observe(el)
        observers.set(el, observer)
    },
    unmounted(el) {
        observers.get(el)?.disconnect()
        observers.delete(el)
    },
    name: 'intersection'
}
