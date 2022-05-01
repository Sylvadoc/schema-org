import type { InjectionKey, Ref } from 'vue-demi'
import { createApp, defineComponent, h, provide, ref, watchEffect } from 'vue-demi'
import {createRouter, createWebHashHistory, RouteLocationNormalizedLoaded, useRoute} from 'vue-router'
import {createSchemaOrg, SchemaOrgOptions} from "../schema-org/createSchemaOrg";
import { createHead } from '@vueuse/head'

type InstanceType<V> = V extends { new (...arg: any[]): infer X } ? X : never
type VM<V> = InstanceType<V> & { unmount(): void }

let useRouteFacade = useRoute
let useCreateSchemaOrgArguments: SchemaOrgOptions = {
  canonicalHost: 'https://example.com/',
  useRoute: useRouteFacade,
  defaultLanguage: 'en-AU'
}

export function mount<V>(Comp: V) {
  const component = defineComponent({
    render() {
      return h('div', [])
    },
  })

  const el = document.createElement('div')
  const app = createApp(Comp)

  const router = createRouter({
    history: createWebHashHistory(),
    routes: [{ path: '/', component }]
  })

  app.use(router)

  const head = createHead()
  app.use(head)

  const schemaOrg = createSchemaOrg({
    ...useCreateSchemaOrgArguments,
    head
  })

  app.use(schemaOrg)

  schemaOrg.setupDOM()
  watchEffect(() => { schemaOrg.generateSchema() })

  const unmount = () => app.unmount()
  const comp = app.mount(el) as any as VM<V>
  comp.unmount = unmount
  return comp
}

export const mockRoute = (route: Partial<RouteLocationNormalizedLoaded>, fn: () => void) => {
  const currentRoute = useCreateSchemaOrgArguments.useRoute
  useRouteFacade = () => route as RouteLocationNormalizedLoaded
  useCreateSchemaOrgArguments.useRoute = useRouteFacade
  fn()
  useCreateSchemaOrgArguments.useRoute = currentRoute
}

export const mockCreateSchemaOptions = (options: Partial<SchemaOrgOptions>) => {
  useCreateSchemaOrgArguments = {
    ...useCreateSchemaOrgArguments,
    ...options
  }
}

export function useSetup<V>(setup: () => V) {
  const Comp = defineComponent({
    setup,
    render() {
      return h('div', [])
    },
  })

  return mount(Comp)
}

export const Key: InjectionKey<Ref<number>> = Symbol('num')

export function useInjectedSetup<V>(setup: () => V) {
  const Comp = defineComponent({
    setup,
    render() {
      return h('div', [])
    },
  })

  const Provider = defineComponent({
    components: Comp,
    setup() {
      provide(Key, ref(1))
    },
    render() {
      return h('div', [])
    },
  })

  return mount(Provider)
}
