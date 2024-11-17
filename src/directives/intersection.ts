export const vIntersection = {
  mounted: (el: HTMLElement, binding: any) => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          binding.value()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    ;(el as any)._observer = observer
  },
  unmounted: (el: HTMLElement) => {
    if ((el as any)._observer) {
      (el as any)._observer.disconnect()
    }
  }
} 