import { getNftBySlugOrAddress } from 'src/services/apollo/getNftBySlugOrAddress'
import { getTokenBySlug } from 'src/services/apollo/getTokenBySlug'
import { ReadParams } from 'src/shared/consts/routes'
import { findFirstNonGroupVisibleNode } from 'src/shared/utils/treeHelpers'
import ClientTokenViewer from '../Token/ClientTokenViewer'
import initTranslations from 'src/config/i18n/i18n'

const NftReadPage: React.FC<{
  params?: Promise<ReadParams['token']>
}> = async ({ params: paramsProp }) => {
  // useUpdateRouteToSlug()
  const params = await paramsProp
  const nftIdOrSlug = params?.nftIdOrSlug || ''
  const tokenIdOrSlug = params?.tokenIdOrSlug || ''
  console.log(nftIdOrSlug, tokenIdOrSlug, 'PARAMS')
  const { t } = await initTranslations('en', ['token'])

  const { nft } = await getNftBySlugOrAddress(nftIdOrSlug)
  // const fullTokenId = useFullTokenIdParam()
  // const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
  //   null
  // )

  const firstToken = findFirstNonGroupVisibleNode(
    nft?.indexPagesContent?.indexPages
  )

  const { token } = await getTokenBySlug(
    nft?.id || '',
    tokenIdOrSlug || firstToken?.slug
  )

  // const tokenId = token?.id || firstToken?.tokenId || ''

  // const markdown = token?.ipfsContent?.htmlContent

  // console.log(token, 'TOKEN')

  // const { setContentElem } = useContentRef()

  // const handleSelectSection = useCallback((sectionId: string) => {
  // setSelectedSectionId(sectionId)
  // }, [])

  // const handleCloseDrawer = () => {
  //   setSelectedSectionId(null)
  // }

  // const loading =
  //   (loadingNft && !refetchingNft) || (loadingToken && !refetchingToken)

  // if (loading) {
  //   return <NftReadPageSkeleton />
  // }

  // if (!markdown) {
  //   return <p className='text-center'>{t('messages.noContent')}</p>
  // }

  if (!nft || !token) {
    return <p className='text-center'>{t('messages.noContent')}</p>
  }

  return <ClientTokenViewer nft={nft} token={token} />

  // return (
  //   <div>
  //     <MarkdownRenderer
  //       markdown={markdown}
  //       showComments
  //       // ref={setContentElem}
  //       // onClickComment={handleSelectSection}
  //       fullTokenId={tokenId}
  //     />

  //     {nft && (
  //       <AttestationDrawer
  //         nft={nft}
  //         // isOpen={!!selectedSectionId}
  //         isOpen={false}
  //         fullTokenId={tokenId}
  //         // section={{
  //         //   id: selectedSectionId,
  //         //   htmlContent:
  //         //     (selectedSectionId &&
  //         //       document.getElementById(selectedSectionId)?.outerHTML) ||
  //         //     '',
  //         // }}
  //         section={{
  //           id: '',
  //           htmlContent: '',
  //         }}
  //         // onClose={handleCloseDrawer}
  //       />
  //     )}
  //   </div>
  // )
}
export default NftReadPage
