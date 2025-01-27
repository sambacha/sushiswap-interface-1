import { Transactions } from 'app/features/transactions/types'
import { formatDateAgo, formatNumber } from 'app/functions'

export interface Mint {
  id: string
  token0: {
    symbol: string
    price: {
      derivedUSD: string
    }
  }
  token1: {
    symbol: string
    price: {
      derivedUSD: string
    }
  }
  amount0: string
  amount1: string
  transaction: {
    timestamp: string
  }
  sender: string
  recipient: string
  origin: string
}

export interface Burn {
  id: string
  token0: {
    symbol: string
    price: {
      derivedUSD: string
    }
  }
  token1: {
    symbol: string
    price: {
      derivedUSD: string
    }
  }
  amount0: string
  amount1: string
  transaction: {
    timestamp: string
  }
  sender: string
  recipient: string
  origin: string
}

export interface Swap {
  id: string
  amountIn: string
  amountOut: string
  // amountUSD: string // - Waiting on subgraph support
  transaction: {
    timestamp: string
  }
  recipient: string
  tokenIn: {
    symbol: string
    price: {
      derivedUSD: string
    }
  }
  tokenOut: {
    symbol: string
  }
}

export interface TridentTransactionRawData {
  mints: Mint[]
  burns: Burn[]
  swaps: Swap[]
}

export function tridentTransactionsRawDataFormatter(rawData: TridentTransactionRawData): Transactions[] {
  const swaps = rawData.swaps.map((tx) => ({
    address: tx.recipient,
    incomingAmt: `${formatNumber(tx.amountIn)} ${tx.tokenIn.symbol}`,
    outgoingAmt: `${formatNumber(tx.amountOut)} ${tx.tokenOut.symbol}`,
    time: formatDateAgo(new Date(Number(tx.transaction.timestamp) * 1000)),
    value: formatNumber(Number(tx.amountIn) * Number(tx.tokenIn.price.derivedUSD), true),
    type: `Swap ${tx.tokenIn.symbol} for ${tx.tokenOut.symbol}`,
  }))
  const mints = rawData.mints.map((tx) => ({
    address: tx.recipient,
    incomingAmt: `${formatNumber(tx.amount0)} ${tx.token0.symbol}`,
    outgoingAmt: `${formatNumber(tx.amount1)} ${tx.token1.symbol}`,
    time: formatDateAgo(new Date(Number(tx.transaction.timestamp) * 1000)),
    value: formatNumber(
      Number(tx.amount0) * Number(tx.token0.price.derivedUSD) + Number(tx.amount1) * Number(tx.token1.price.derivedUSD),
      true
    ),
    type: `Mint ${tx.token0.symbol} and ${tx.token1.symbol}`,
  }))

  const burns = rawData.burns.map((tx) => ({
    address: tx.recipient,
    incomingAmt: `${formatNumber(tx.amount0)} ${tx.token0.symbol}`,
    outgoingAmt: `${formatNumber(tx.amount1)} ${tx.token1.symbol}`,
    time: formatDateAgo(new Date(Number(tx.transaction.timestamp) * 1000)),
    value: formatNumber(
      Number(tx.token0) * Number(tx.token0.price.derivedUSD) + Number(tx.token1) * Number(tx.token1.price.derivedUSD),
      true
    ),
    type: `Burn ${tx.token0.symbol} and ${tx.token1.symbol}`,
  }))

  return [...swaps, ...mints, ...burns]
}
