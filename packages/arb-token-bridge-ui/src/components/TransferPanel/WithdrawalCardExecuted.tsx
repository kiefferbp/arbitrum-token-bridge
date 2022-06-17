import { useEffect, useMemo, useState } from 'react'
import { BigNumber, utils } from 'ethers'
import Loader from 'react-loader-spinner'

import { useAppState } from '../../state'
import { MergedTransaction } from '../../state/app/state'
import { useAppContextDispatch } from '../App/AppContext'
import {
  WithdrawalCardContainer,
  WithdrawalL1TxStatus,
  WithdrawalL2TxStatus
} from './WithdrawalCard'

function formatForDisplay(value: number) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 6 })
}

function formatBalance(balance: BigNumber, decimals?: number) {
  if (balance.isZero()) {
    return '0'
  }

  return formatForDisplay(
    parseFloat(utils.formatUnits(balance, decimals || 18))
  )
}

export function WithdrawalCardExecuted({ tx }: { tx: MergedTransaction }) {
  const {
    app: { arbTokenBridge }
  } = useAppState()
  const dispatch = useAppContextDispatch()

  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Add token to bridge just in case
    if (tx.tokenAddress && !arbTokenBridge.bridgeTokens[tx.tokenAddress]) {
      arbTokenBridge.token.add(tx.tokenAddress)
    }
  }, [])

  const balance = useMemo(() => {
    if (tx.asset === 'eth') {
      return arbTokenBridge.balances.eth.balance
    }

    if (!tx.tokenAddress) {
      return null
    }

    return arbTokenBridge.balances.erc20[tx.tokenAddress]?.balance
  }, [tx, arbTokenBridge])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false)
      dispatch({ type: 'set_tx_as_seen', payload: tx.txId })
      // Disappears after 10 seconds
    }, 10 * 1000)

    return () => {
      clearTimeout(timeout)
    }
    // It's safe to omit `dispatch` from the dependency array: https://reactjs.org/docs/hooks-reference.html#usereducer
  }, [tx.txId])

  if (!isVisible) {
    return null
  }

  return (
    <WithdrawalCardContainer tx={tx}>
      <span className="text-4xl font-semibold text-blue-arbitrum">
        Success!
      </span>
      <span className="text-2xl font-light text-blue-arbitrum">
        {tx.value} {tx.asset.toUpperCase()} has been moved to your wallet.
        <br />
        <div className="flex flex-row items-center space-x-2">
          <span className="font-medium">New balance:</span>
          {balance ? (
            <span className="font-medium">
              {formatBalance(balance)} {tx.asset.toUpperCase()}
            </span>
          ) : (
            <Loader type="Oval" height={16} width={16} color="black" />
          )}
        </div>
      </span>
      <div className="flex flex-col font-light">
        <span className="text-lg text-lime-dark">
          L2 transaction: <WithdrawalL2TxStatus tx={tx} />
        </span>
        <span className="text-lg text-lime-dark">
          L1 transaction: <WithdrawalL1TxStatus tx={tx} />
        </span>
      </div>
    </WithdrawalCardContainer>
  )
}
