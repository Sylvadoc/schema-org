import type { DeepPartial } from 'utility-types'
import type { SchemaNodeInput, Thing } from '../../types'
import {
  IdentityId,
  defineSchemaResolver,
  prefixId, resolveId,
} from '../../utils'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'
import type { PostalAddress, RelatedAddressInput } from '../PostalAddress'
import { resolveAddress } from '../PostalAddress'

export interface Place extends Thing {
  '@type': 'Place'
  address?: RelatedAddressInput | string
}

export const definePlacePartial = <K>(input?: DeepPartial<Place> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  definePlace(input as Place)

/**
 * Entities that have a somewhat fixed, physical extension.
 */
export function definePlace<T extends SchemaNodeInput<Place>>(input: T) {
  return defineSchemaResolver<T, Place>(input, {
    required: [
      'name',
    ],
    defaults({ canonicalHost }) {
      return {
        '@type': 'Place',
        '@id': prefixId(canonicalHost, IdentityId),
        'url': canonicalHost,
      }
    },
    resolve(node, client) {
      if (node.address && typeof node.address !== 'string')
        node.address = resolveAddress(client, node.address) as PostalAddress
      resolveId(node, client.canonicalHost)
      return node
    },
  })
}

export const SchemaOrgPlace = defineSchemaOrgComponent('SchemaOrgPlace', definePlace)
