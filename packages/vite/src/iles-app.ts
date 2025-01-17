import type { UserConfig } from '@vueuse/schema-org'
import { createSchemaOrg, resolveUserConfig } from '@vueuse/schema-org'
import type { EnhanceAppContext } from 'iles'

export function installSchemaOrg(ctx: EnhanceAppContext, config: UserConfig) {
  if (!config.canonicalHost)
    config.canonicalHost = ctx.site.url
  const resolvedConfig = resolveUserConfig(config)

  const client = createSchemaOrg({
    position: 'head',
    updateHead(fn) {
      ctx.head.addHeadObjs(fn)
      if (typeof document !== 'undefined')
        ctx.head.updateDOM()
    },
    meta() {
      const inferredMeta: Record<string, any> = {}

      const tags = ctx.head.headTags?.reverse()
      if (tags) {
        const headTag = tags.filter(t => t.tag === 'title' && !!t.props.children)
        if (headTag.length)
          inferredMeta.title = headTag[0].props.children
        const descTag = tags.filter(t => t.tag === 'meta' && t.props.name === 'description' && !!t.props.content)
        if (descTag.length)
          inferredMeta.description = descTag[0].props.content
        const imageTag = tags.filter(t => t.tag === 'meta' && t.props.property === 'og:image' && !!t.props.content)
        if (imageTag.length)
          inferredMeta.image = imageTag[0].props.content
      }

      return {
        path: ctx.router?.currentRoute.value.path || '/',
        ...inferredMeta,
        ...resolvedConfig.meta,
        ...ctx.meta,
        ...ctx.frontmatter,
        ...ctx.router?.currentRoute.value.meta || {},
      }
    },
  })

  ctx.app.use(client)

  if (typeof document === 'undefined') {
    client.generateSchema()
    client.setupDOM()
    return
  }

  ctx.router.afterEach(() => {
    client.generateSchema()
    client.setupDOM()
  })
  return client
}
