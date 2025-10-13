// ClientTokenViewer.tsx
import {
  NFTWithMetadata,
  TokensQueryFullData,
} from 'src/shared/utils/ipfs/types'
import MarkdownRendererServer from '../Editor/MarkdownRendererServer'

interface Props {
  nft: NFTWithMetadata
  token: TokensQueryFullData
}

export default function ClientTokenViewer({ nft, token }: Props) {
  // const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
  //   null
  // )

  // const handleSelectSection = useCallback((sectionId: string) => {
  //   setSelectedSectionId(sectionId)
  // }, [])

  // const handleCloseDrawer = useCallback(() => {
  //   setSelectedSectionId(null)
  // }, [])

  return (
    <>
      {/* <MarkdownRenderer
        markdown={token.ipfsContent?.htmlContent || ''}
        showComments
        fullTokenId={token.id}
        onClickComment={handleSelectSection} // интерактивность
      /> */}
      <MarkdownRendererServer markdown={token.ipfsContent?.htmlContent || ''} />

      {/* <AttestationDrawer
        nft={nft}
        isOpen={!!selectedSectionId}
        fullTokenId={token.id}
        section={{
          id: selectedSectionId || '',
          htmlContent:
            (selectedSectionId &&
              document.getElementById(selectedSectionId)?.outerHTML) ||
            '',
        }}
        onClose={handleCloseDrawer}
      /> */}
    </>
  )
}
