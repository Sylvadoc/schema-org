---
title: eCommerce
---

# Setting up Schema.org for eCommerce in Vue

::alert{type="warning"}
🔨 Documentation in progress
::

## Useful Links

- [defineProduct](/api/schema/product)
- [Product | Google Search Central](https://developers.google.com/search/docs/advanced/structured-data/product)
- [Product | Yoast](https://developer.yoast.com/features/schema/pieces/product)

## Marking up a Product

The [defineProduct](/api/schema/product) function and [SchemaOrgProduct](/components/) component are provided
to create Product Schema whilst handling relations for you.

Note that some fields may already be inferred, see [Route Meta Resolving](/guide/how-it-works.html#route-meta-resolving)

::code-group

```ts [Composition API]
useSchemaOrg([
  defineProduct({
    name: 'Schema.org Book',
    description: 'Discover how to use Schema.org',
    image: [
      'https://example.com/photos/16x9/photo.jpg'
    ],
    offer: {
      price: '$10.00',
    },
  })
])
```
::
