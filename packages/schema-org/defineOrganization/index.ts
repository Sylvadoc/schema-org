import type { IdReference, OptionalMeta, Thing } from '../types'
import { IdentityId, defineNodeResolverSchema, prefixId } from '../utils'
import { defineImage } from '../defineImage'

export interface Organization extends Thing {
  /**
   * A reference-by-ID to an image of the organization's logo.
   *
   * - The image must be 112x112px, at a minimum.
   * - Make sure the image looks how you intend it to look on a purely white background
   * (for example, if the logo is mostly white or gray,
   * it may not look how you want it to look when displayed on a white background).
   */
  logo: IdReference
  /**
   * The site's home URL.
   */
  url: string
  /**
   * The name of the Organization.
   */
  name: string
  /**
   * An array of URLs representing declared social/authoritative profiles of the organization
   * (e.g., a Wikipedia page, or Facebook profile).
   */
  sameAs?: string[]
  /**
   * An array of images which represent the organization (including the logo ), referenced by ID.
   */
  image?: string[]|IdReference
}

/**
 * Describes an organization (a company, business or institution).
 * Most commonly used to identify the publisher of a WebSite.
 *
 * May be transformed into a more specific type
 * (such as Corporation or LocalBusiness) if the required conditions are met.
 */
export function defineOrganization(organization: OptionalMeta<Organization, 'url'>) {
  return defineNodeResolverSchema(organization, {
    defaults({ canonicalHost }) {
      return {
        '@type': 'Organization',
        '@id': prefixId(canonicalHost, IdentityId),
        'url': canonicalHost,
      }
    },
    mergeRelations(organization, { addNode, canonicalHost }) {
      // move logo to root schema
      if (typeof organization.logo === 'string') {
        const id = prefixId(canonicalHost, '#logo')
        const image = defineImage({
          '@id': id,
          'url': organization.logo,
          'caption': organization.name,
        }).resolve()
        addNode(image)
        organization.logo = {
          '@id': id,
        }
      }
    },
    // @todo When location information is available, the Organization may be eligible for extension into a LocalBusiness type.
  })
}