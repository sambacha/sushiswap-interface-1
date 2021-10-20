import Button from '../../../../components/Button'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from '../../../../components/Typography'
import React from 'react'
import ClassicStandardMode from '../../../../features/trident/remove/classic/ClassicStandardMode'
import ModeToggle from '../../../../features/trident/ModeToggle'
import { LiquidityMode } from '../../../../features/trident/types'
import { RecoilRoot, useRecoilValue } from 'recoil'
import { liquidityModeAtom, poolAtom } from '../../../../features/trident/context/atoms'
import TridentLayout, { TridentBody, TridentHeader } from '../../../../layouts/Trident'
import ClassicUnzapMode from '../../../../features/trident/remove/classic/ClassicUnzapMode'
import { useRouter } from 'next/router'
import { ConstantProductPoolState, useTridentClassicPool } from '../../../../hooks/useTridentClassicPools'
import WithdrawalSubmittedModal from '../../../../features/trident/WithdrawalSubmittedModal'
import RemoveTransactionReviewZapModal from '../../../../features/trident/remove/classic/RemoveTransactionReviewZapModal'
import RemoveTransactionReviewStandardModal from '../../../../features/trident/remove/classic/RemoveTransactionReviewStandardModal'
import { BREADCRUMBS } from '../../../../features/trident/Breadcrumb'
import Alert from '../../../../components/Alert'
import ClassicStandardAside from '../../../../features/trident/remove/classic/ClassicStandardAside'
import ClassicZapAside from '../../../../features/trident/remove/classic/ClassicZapAside'
import useInitClassicPoolState from '../../../../features/trident/context/hooks/useInitClassicPoolState'
import useCurrenciesFromURL from '../../../../features/trident/context/hooks/useCurrenciesFromURL'

const RemoveClassic = () => {
  useInitClassicPoolState()

  const { i18n } = useLingui()
  const { query } = useRouter()
  const { currencies, fee, twap } = useCurrenciesFromURL()
  const liquidityMode = useRecoilValue(liquidityModeAtom)
  const [, pool] = useRecoilValue(poolAtom)
  const classicPool = useTridentClassicPool(currencies[0], currencies[1], fee, twap)

  return (
    <>
      <TridentHeader pattern="bg-bars-pattern" className="pb-10">
        <div className="flex flex-col w-full mt-px gap-5 lg:justify-between relative lg:w-7/12">
          <div>
            <Button
              color="blue"
              variant="outlined"
              size="sm"
              className="py-1 pl-2 rounded-full"
              startIcon={<ChevronLeftIcon width={24} height={24} />}
            >
              <Link href={`/trident/pool/classic/${query.tokens[0]}/${query.tokens[1]}`}>
                {pool ? `${currencies?.[0]?.symbol}-${currencies?.[1]?.symbol}` : i18n._(t`Back`)}
              </Link>
            </Button>
          </div>
          <Typography variant="h2" weight={700} className="text-high-emphesis">
            {i18n._(t`Remove Liquidity`)}
          </Typography>
          <Typography variant="sm">
            {i18n._(
              t`Receive both pool tokens directly with Standard mode, or receive total investment as any asset in Zap mode.`
            )}
          </Typography>
        </div>
      </TridentHeader>

      <TridentBody>
        <div className="flex flex-row justify-between">
          <div className="lg:w-7/12 w-full flex flex-col gap-5">
            <ModeToggle />

            {[ConstantProductPoolState.NOT_EXISTS, ConstantProductPoolState.INVALID].includes(classicPool[0]) && (
              <Alert
                dismissable={false}
                type="error"
                showIcon
                message={i18n._(t`A Pool could not be found for provided currencies`)}
              />
            )}

            <>
              {liquidityMode === LiquidityMode.ZAP && (
                <>
                  <ClassicUnzapMode />
                  <RemoveTransactionReviewZapModal />
                </>
              )}
              {liquidityMode === LiquidityMode.STANDARD && (
                <>
                  <ClassicStandardMode />
                  <RemoveTransactionReviewStandardModal />
                </>
              )}
            </>

            <WithdrawalSubmittedModal />
          </div>

          <div className="flex flex-col hidden lg:block lg:w-4/12 -mt-36">
            {liquidityMode === LiquidityMode.STANDARD ? <ClassicStandardAside /> : <ClassicZapAside />}
          </div>
        </div>
      </TridentBody>
    </>
  )
}

RemoveClassic.Provider = RecoilRoot
RemoveClassic.Layout = (props) => (
  <TridentLayout
    {...props}
    breadcrumbs={[BREADCRUMBS['pools'], BREADCRUMBS['pool_classic'], BREADCRUMBS['remove_classic']]}
  />
)

export default RemoveClassic