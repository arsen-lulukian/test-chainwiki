import {
  NftQuery as NFTQueryGQL,
  NftQueryVariables,
} from 'src/queries/gql/graphql'
import {
  IpfsHeaderLinksContent,
  IpfsIndexPagesContent,
  IpfsNftContent,
  NFTWithMetadata,
} from 'src/shared/utils'
import {
  initialHeaderLinks,
  initialIndexPagesContent,
  initialNftContent,
} from 'src/shared/utils/ipfs/consts'
import defaultClient from '.'
import { fetchIpfsDataServer } from './fetchIpfsData'
import { NFTQuery } from 'src/queries'
import { ApolloClient } from '@apollo/client'

/**
 * Server-side version of useNFT.
 * Works without React and is suitable for SSR, SSG, and API routes.
 */

export async function getNft(
  id: string,
  options?: { fetchFullData?: boolean; client?: ApolloClient<any> }
): Promise<{
  nft: NFTWithMetadata | null
}> {
  if (!id) return { nft: null }

  try {
    const resolvedClient = options?.client || defaultClient
    const { data } = await resolvedClient.query<NFTQueryGQL, NftQueryVariables>(
      {
        query: NFTQuery,
        variables: { id },
        fetchPolicy: 'no-cache',
      }
    )

    const nft = data?.nft
    if (!nft) return { nft: null }

    if (!options?.fetchFullData) {
      return { nft: nft as NFTWithMetadata }
    }

    const [headerLinksContentRes, ipfsContentRes, indexPagesContentRes] =
      await Promise.all([
        nft.headerLinksUri
          ? fetchIpfsDataServer<IpfsHeaderLinksContent>([
              nft.headerLinksUri,
            ]).then(res => res.results[0])
          : Promise.resolve(initialHeaderLinks),
        nft.uri
          ? fetchIpfsDataServer<IpfsNftContent>([nft.uri]).then(
              res => res.results[0]
            )
          : Promise.resolve(initialNftContent),
        nft.indexPagesUri
          ? fetchIpfsDataServer<IpfsIndexPagesContent>([
              nft.indexPagesUri,
            ]).then(res => res.results[0])
          : Promise.resolve(initialIndexPagesContent),
      ])

    const nftWithMetadata: NFTWithMetadata = {
      ...nft,
      headerLinksContent: headerLinksContentRes || initialHeaderLinks,
      ipfsContent: ipfsContentRes || initialNftContent,
      indexPagesContent: indexPagesContentRes || initialIndexPagesContent,
    }

    return { nft: nftWithMetadata }
  } catch (err) {
    console.error('Error fetching NFT:', err)
    return { nft: null }
  }
}
