import BigNumber from 'bignumber.js'

export interface StakingItem {    
    tokenId?: BigNumber
    startTime?: BigNumber
    startBlock?: BigNumber
    reward?: BigNumber
    metadata?: string
}

export interface UserItem {
    tokenId?: BigNumber
    isApprove?: boolean
    metadata?: string
}

export interface StakedInfo {
    balance?: BigNumber
    tokenIds?: any
    metadatas?: any
}

export interface UnStakedInfo {
    balance?: BigNumber
    tokenIds?: any
    metadatas?: any
}