import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import NftList, { NFTWithChain } from 'src/components/Nft/NftList'
import Button from 'src/components/ui-kit/Button/Button'
import Routes from 'src/shared/consts/routes'

interface ChooseSiteNetwork {
  nfts: NFTWithChain[]
  loading: boolean
  onSelect: (nft: NFTWithChain) => void
}

const ChooseSiteNetwork: React.FC<ChooseSiteNetwork> = ({
  nfts,
  loading,
  onSelect,
}) => {
  const { t } = useTranslation('layout', { keyPrefix: 'chooseNetwork' })

  const noNfts = !loading && (!nfts || nfts?.length === 0)

  const handleCardClick = (nft: NFTWithChain) => {
    onSelect?.(nft)
  }

  return (
    <div
      className='h-screen flex flex-col items-center'
      style={{ background: 'rgb(249, 249, 249)' }}
    >
      <div className='w-full max-w-screen-lg mt-10'>
        <div
          className='rounded-full w-full px-5 py-2.5 flex items-center justify-between'
          style={{ boxShadow: 'rgba(0, 0, 0, 0.25) 0px 0px 10px 0px' }}
        >
          <div className='p-2.5'>
            <img className='max-h-7' src='assets/logo.png' alt='ChainWiki' />
          </div>
          <Link href={Routes.manager.home}>
            <Button size='md' style={{ borderRadius: '50px', height: 43 }}>
              {t('home')}
            </Button>
          </Link>
        </div>

        <div className='px-20 mt-9'>
          <h1 className='typo-heading1 text-main-accent font-medium'>
            {t('title')}
          </h1>
          <h3 className='heading-md'>{t('description')}</h3>
          {noNfts ? (
            <div className='text-center mt-14 typo-title2'>{t('noNfts')}</div>
          ) : (
            <NftList
              showChain
              loading={loading}
              nfts={nfts}
              skeletonLength={10}
              className='mt-7'
              onClick={handleCardClick}
              to={nft => Routes.read.nft(nft.slug)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ChooseSiteNetwork
