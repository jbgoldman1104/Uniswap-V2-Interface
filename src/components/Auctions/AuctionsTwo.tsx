import BigNumber from 'bignumber.js'
import React, { Fragment, useEffect, useState } from 'react'
import { useEthers } from '@usedapp/core'
import { useWeb3 } from '../useWeb3'
import { StakedInfo, UnStakedInfo } from '../types'
import {
  useApeContract,
  useStakingContract,
  useVariableContract,
} from '../useContracts'
import { claim, setApprovalForAll, stake, unstake } from '../callHelper'
import { getStakingAddress } from '../addressHelper'
import useRefresh from '../useRefresh'
import { getFullDisplayBalance } from '../formatBalance'

const initStakedInfo: UnStakedInfo = {
  balance: new BigNumber(0),
  tokenIds: [],
  metadatas: [],
}

const initUnStakedInfo: StakedInfo = {
  balance: new BigNumber(0),
  tokenIds: [],
  metadatas: [],
}

const space = <Fragment>&nbsp;&nbsp;&nbsp;</Fragment>;

const AuctionsTwo = () => {
  const web3 = useWeb3()
  const { account } = useEthers()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const apeContract = useApeContract()
  const stakingContract = useStakingContract()
  const variableContract = useVariableContract()
  const stakingAddress = getStakingAddress()

  const { slowRefresh, fastRefresh } = useRefresh()

  const [fetchFlag, setFetchFlag] = useState(true)
  const [redraw, setRedraw] = useState(false)

  const [unstakedinfo, setUnStakedInfo] = useState<UnStakedInfo>()
  const [stakedinfo, setStakedInfo] = useState<StakedInfo>()

  const [reward, setReward] = useState(new BigNumber(0))

  const [selectedUnStakedTokenIds, setSelectedUnStakedTokenIds] = useState<
    BigNumber[]
  >([])
  const [selectedStakedTokenIds, setSelectedStakedTokenIds] = useState<
    BigNumber[]
  >([])

  useEffect(() => {
    if (fetchFlag && account) {
      console.log('fetchFlag:  TRUE')
      fetchIsApprovedForAll()
      fetchUnStakedInfo()
      fetchStakedInfo()
      setFetchFlag(false)
    }
    if (stakingContract && account) fetchReward()
  }, [account, fetchFlag, slowRefresh])

  const fetchReward = async () => {
    const result = await stakingContract.methods
      .pendingTotalReward(account)
      .call()
    setReward(getFullDisplayBalance(new BigNumber(result)))
  }

  const fetchIsApprovedForAll = async () => {
    const isApp = await apeContract.methods
      .isApprovedForAll(account, stakingAddress)
      .call()
    setIsApproved(isApp)
  }

  async function fetchUnStakedInfo() {
    var result: UnStakedInfo = initUnStakedInfo
    result.tokenIds = []
    result.metadatas = []
    const balance = await apeContract.methods.balanceOf(account).call()
    let a1 = 0
    for (a1 = 0; a1 < balance; a1++) {
      const tokenId = await apeContract.methods
        .tokenOfOwnerByIndex(account, a1)
        .call()
      result.tokenIds.push(tokenId)
      result.metadatas.push('metadata')
    }

    var unstaked: StakedInfo = initUnStakedInfo
    unstaked.tokenIds = result.tokenIds.slice()
    unstaked.metadatas = result.metadatas.slice()
    setUnStakedInfo(unstaked)
    setSelectedUnStakedTokenIds([])
    setSelectedStakedTokenIds([])
  }

  const fetchStakedInfo = async () => {
    var result: StakedInfo = initStakedInfo
    result.tokenIds = []
    result.metadatas = []

    const balance = await stakingContract.methods.stakingAmount(account).call()
    let a = 0
    for (a = 0; a < balance; a++) {
      const tokenInfo = await stakingContract.methods
        .userInfo(account, a)
        .call()
      // const metadata = await apeContract.methods.tokenURI(tokenInfo.tokenId).call()
      // const response = await fetch(metadata);
      result.tokenIds.push(tokenInfo.tokenId)
      result.metadatas.push('metadata')
    }
    var staked: StakedInfo = initStakedInfo
    staked.tokenIds = result.tokenIds.slice()
    staked.metadatas = result.metadatas.slice()
    setStakedInfo(staked)
    setSelectedUnStakedTokenIds([])
    setSelectedStakedTokenIds([])
  }

  const IsSelected = (type: any, tokenId: any) => {
    var a = 0
    const list = type == 0 ? selectedUnStakedTokenIds : selectedStakedTokenIds
    for (a = 0; a < list.length; a++) {
      if (list[a] == tokenId) {
        return true
      }
    }
    return false
  }

  const removeItemFromArray = (
    oldlist: BigNumber[],
    tokenId: any,
  ): BigNumber[] => {
    var list: BigNumber[] = oldlist
    var i = 0
    for (i = 0; i < list.length; i++) {
      if (list[i] == tokenId) {
        list[i] = list[list.length - 1]
        list.pop()
        break
      }
    }
    return list
  }

  const unstakedImageClick = async (tokenId: BigNumber, index: any) => {
    console.log('unstakedimageclick')
    if (await IsSelected(0, tokenId)) {
      let newlist: BigNumber[] = await removeItemFromArray(
        selectedUnStakedTokenIds,
        tokenId,
      )
      setSelectedUnStakedTokenIds(newlist)
    } else {
      var newlist1: BigNumber[] = selectedUnStakedTokenIds
      newlist1.push(tokenId)
      setSelectedUnStakedTokenIds(newlist1)
    }
    setRedraw(!redraw)
  }

  const stakedImageClick = async (tokenId: BigNumber, index: any) => {
    if (await IsSelected(1, tokenId)) {
      const newlist: BigNumber[] = await removeItemFromArray(
        selectedStakedTokenIds,
        tokenId,
      )
      setSelectedStakedTokenIds(newlist)
    } else {
      var newlist1: BigNumber[] = selectedStakedTokenIds
      newlist1.push(tokenId)
      setSelectedStakedTokenIds(newlist1)
    }
    setRedraw(!redraw)
  }

  const handleStake = async () => {
    if (!isApproved) {
      try {
        setRequestedApproval(true)
        await setApprovalForAll(apeContract, stakingContract, account, true)
        setIsApproved(true)
        setRequestedApproval(false)
      } catch {
        console.log('Approve failed')
        setRequestedApproval(false)
      }
    } else {
      try {
        setRequestedApproval(true)
        await stake(stakingContract, selectedUnStakedTokenIds, account)
        setRequestedApproval(false)
        setFetchFlag(true)
      } catch {
        console.log('Stake failed')
        setRequestedApproval(false)
      }
    }
  }

  const handleClaim = async () => {
    try {
      setRequestedApproval(true)
      await claim(stakingContract, account)
      setIsApproved(true)
      setRequestedApproval(false)
    } catch {
      console.log('Claim failed')
      setRequestedApproval(false)
    }
  }

  const handleUnStake = async () => {
    try {
      setRequestedApproval(true)
      await unstake(stakingContract, selectedStakedTokenIds, account)
      setIsApproved(true)
      setRequestedApproval(false)
      setFetchFlag(true)
    } catch {
      console.log('UnStake failed')
      setRequestedApproval(false)
    }
  }

  return (
    <section className="">
      <div style={{ display: 'flex', justifyContent: 'space-between' , flexWrap:"wrap"}}>
        {/* **<!-- this is UNSTAKED part of Panel (LEFT)-->** */}
        <div
          className=""
          style={{
            width:'35%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            minWidth: '500px',
          }}
        >
          <div className="row text-center">
            <h3 className="">UNSTAKED</h3>
          </div>
          {/* <div className="row">                     */}
          <div
            className="radiuspanel"
            style={{
              height: 400,
              width: '100%',
              backgroundColor: 'rgb(188 186 199 / 23%)',
            }}
          >
            <div
              style={{
                height: '400px',
                overflowY: 'auto',
                scrollbarWidth: 'none',
              }}
            >
              <div className="card-caption col-12 p-0">
                {/* Card Body */}
                <div className="row justify-content-center" style={{ }}>
                  {unstakedinfo &&
                    unstakedinfo.tokenIds &&
                    unstakedinfo.tokenIds.map((tokenId: any, idx: any) => {
                      const image =
                        'https://messari.mypinata.cloud/ipfs/QmcAYrZS22UXBbo2K2y9Msj9GKsdGg88xRtNADCnhP4TQk/Ryan%20Selkis.jpg'
                      const isSelected = IsSelected(0, tokenId)
                      return (
                        <div
                          className="col-5 col-md-5 col-lg-5 col-xl-3 item"
                          style={{
                            marginLeft: 1,
                            marginRight: 1,
                            marginTop: 30                            
                          }}
                          onClick={() => unstakedImageClick(tokenId, idx)}
                        >
                          <img
                            className={isSelected ? 'withBorder' : 'noBorder'}
                            src={image}
                            alt=""
                            style={{ width: '100%' }}
                          />
                          {/* <img className="withBorder" src={image} alt="" style={{width:'100%'}}/> */}
                          <div style={{ color: 'white', textAlign: 'center' }}>
                            {tokenId}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
          {/* </div>                     */}
          <div className="row justify-content-center">
            <div className="text-center">
            <p style={{ color: 'white', fontSize: 15, marginTop: 20 , fontFamily: 'Montserrat'}}>
            SELECT THE APES YOU WOULD  LIKE TO STAKE AND<br/>
            CLICK THE BUTTON BELOW.
            </p>
            </div>
          </div>
          <div className="row" style={{ textAlign: 'center'}}>
            <button
              className="btn mt-4"
              disabled={requestedApproval}
              onClick={handleStake}
            >
              {isApproved ? 'STAKE' : 'APPROVE'}
            </button>
          </div>
        </div>

        {/* <div style={{ flex: 1 }}></div> */}

        {/* **<!-- this is STAKED part of Panel (RIGHT)-->** */}
        <div
          style={{
            width: '35%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            minWidth: '500px',
          }}
        >
          <div className="row text-center">
            <h3 className="">STAKED</h3>
          </div>
          <div
            className="radiuspanel"
            style={{
              height: 400,
              width: '100%',
              backgroundColor: 'rgb(188 186 199 / 23%)',
            }}
          >
            <div
              style={{
                height: '400px',
                overflowY: 'auto',
                scrollbarWidth: 'none',
              }}
            >
              <div className="card-caption col-12 p-0">
                {/* Card Body */}
                <div className="row" style={{ padding: 10 }}>
                  {stakedinfo &&
                    stakedinfo.tokenIds &&
                    stakedinfo.tokenIds.map((tokenId: any, idx: any) => {
                      const image =
                        'https://messari.mypinata.cloud/ipfs/QmcAYrZS22UXBbo2K2y9Msj9GKsdGg88xRtNADCnhP4TQk/Ryan%20Selkis.jpg'
                      const isSelected = IsSelected(1, tokenId)
                      return (
                        <div
                          className="col-5 col-md-5 col-lg-5 col-xl-3 item"
                          style={{
                            marginLeft: 1,
                            marginRight: 1,
                            marginTop: 30                            
                          }}
                          onClick={() => stakedImageClick(tokenId, idx)}
                        >
                          <img
                            className={isSelected ? 'withBorder' : 'noBorder'}
                            src={image}
                            alt=""
                            style={{ width: '100%' }}
                          />
                          {/* <img className="withBorder" src={image} alt="" style={{width:'100%'}}/> */}
                          <div style={{ color: 'white', textAlign: 'center' }}>
                            {tokenId}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">            
            {/* Intro */}
            <div className="text-center">
            <p style={{ color: 'white', fontSize: 15, marginTop: 20 , fontFamily: 'Montserrat'}}>
            SECLECT THE APES YOU WOULD  LIKE TO UNSTAKE AND<br/>
            CLICK THE BUTTON BELOW.
            </p>
            </div>        
          </div>
          <div className="row" style={{display:"flex", justifyContent:"center" }}>
              <button
                className="btn mt-4"
                style={{marginRight:"50px"}}
                disabled={requestedApproval}
                onClick={handleClaim}
              >
                {space}CLAIM{space}
              </button>
              <button
                className="btn mt-4"
                disabled={requestedApproval}
                onClick={handleUnStake}
              >
                UNSTAKE
              </button>
          </div>
        </div>
      </div>

      <div
        className="text-center row col-12"
        style={{ color: 'white', marginTop: 10 }}
      >
        <h5 style={{ textAlign: 'center', width: '100%' }}>
            $VARIABLE EARNED<br/>
            {reward.toString()}
        </h5>
      </div>
    </section>
  )
}

export default AuctionsTwo
