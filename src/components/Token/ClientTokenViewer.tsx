// ClientTokenViewer.tsx
'use client'

import { useState, useCallback } from 'react'
import MarkdownRenderer from 'src/components/Editor/MarkdownRenderer'
import AttestationDrawer from 'src/components/Token/Attestation/AttestationDrawer'
import {
  NFTWithMetadata,
  TokensQueryFullData,
} from 'src/shared/utils/ipfs/types'

interface Props {
  nft: NFTWithMetadata
  token: TokensQueryFullData
}

export default function ClientTokenViewer({ nft, token }: Props) {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  )

  const handleSelectSection = useCallback((sectionId: string) => {
    setSelectedSectionId(sectionId)
  }, [])

  const handleCloseDrawer = useCallback(() => {
    setSelectedSectionId(null)
  }, [])

  return (
    <>
      <MarkdownRenderer
        markdown={token.ipfsContent?.htmlContent || ''}
        showComments
        fullTokenId={token.id}
        onClickComment={handleSelectSection} // интерактивность
      />

      <AttestationDrawer
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
      />
    </>
  )
}
