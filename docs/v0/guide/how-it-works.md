# How it works

## Schema Inheritance

To simplify the configuration boilerplate, the plugin is built for inheritance. 
That is, you can define Schema at different levels of the Vue app and the most relevant node will be rendered.

In practice this means you can provide the "global" schema (`WebPage`, `WebSite` and an [identity](/guide/guides/identity)) within 
an `app.vue` (or a layout file) to have Schema propagated. 

Child components will inherent the parent Schema if nothing is defined, otherwise it will replace it.

The applications of this design can be used in creative ways, for example: if you have an article layout file, you can
make use of `defineBreadcrumb` to have all articles generate [Breadcrumbs](/api/schema/breadcrumb). 

## Global Resolves

The make managing Schema more enjoyable, logic is applied to many of the Schema fields to ensure their correct.

### URL Resolving

Any URL field allows a relevant link to be provided.
This link will either be prefixed with the canonical host or the canonical page URL.

```ts
defineComment({
  text: 'This is really cool!',
  author: {
    name: 'Harlan Wilton',
    url: '/user/harlan-wilton',
  }
})
```

```json
[
  {
    "@id": "https://example.com/#/schema/person/1230192103",
    "@type": "Person",
    "name": "Harlan Wilton",
    "url": "https://example.com/user/harlan-wilton"
  },
  {
    "@id": "https://example.com/#/schema/comment/2288441280",
    "@type": "Comment",
    "author": {
      "@id": "https://example.com/#/schema/person/1230192103"
    },
    "text": "This is really cool!"
  }
]
```


### Image Resolving

Image resolving uses the same relative link logic as above.

Additionally, single string images will be transformed to an [ImageObject](https://schema.org/ImageObject) and added as a root node and an 
applicable link to the `@id` will be added.

```ts
defineWebPage({
    image: '/my-image.png',
})
```

```json
 {
  "@id": "https://example.com/#/schema/image/1571960974",
  "@type": "ImageObject",
  "contentUrl": "https://example.com//my-image.png",
  "url": "https://example.com//my-image.png"
}
```

### ID Resolving

Providing an `@id` for a Schema node is sometimes useful to setup your own relations. When configuring the `@id` you can
provide it as a simple string beginning with `#`. 

The ID will be resolved to use the canonical host or the canonical page path as a prefix.

```ts
defineBreadcrumb({
  '@id': '#subbreadcrumb',
  'itemListElement': [
    { name: 'Sub breadcrumb link', item: '/blog/test' },
  ],
})
```

```json
{
  "@id": "https://example.com/#subbreadcrumb",
  "@type": "BreadcrumbList"
}
```

### Type Resolving

Providing a string of `@type` will be augmented with the default type. This is to allow fallbacks when the specific `@type`
is not supported by Google.

```ts
defineWebPage({
  '@type': 'FAQPage',
})
```

```json
{
  "@type": [
    "WebPage",
    "FAQPage"
  ]
}
```

### Date Resolving

Any date can be provided as a string or a js `Date` object. When a `Date` object is provided it will be transformed to the
[ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format.

```ts
defineWebPage({
  datePublished: new Date(2022, 1, 10, 0, 0, 0),
})
```

```json
{
  "datePublished": "2022-01-10T00:00:0+00:00"
}
```

## Route Meta Resolving

Route meta and document meta tags will be used to infer default Schema values.

For example, having a `document.title` can be inferred as the [WebPage](/api/schema/webpage) `title`.

The following meta keys are supported:

- **title**: `string` - The page title
- **description**: `string` - A short description of the page
- **dateModified**: `string|Date` - The date the page was last modified.
- **datePublished**: `string|Date` - The date the page was published
- **image**: `string` - Will be used as the primaryImage of the page
