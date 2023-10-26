import type { InjectionKey } from 'vue'

interface CarouselContext {
  addItem: (item: HTMLDivElement) => void
}

export const CarouselKey: InjectionKey<CarouselContext> = Symbol('Carousel')
