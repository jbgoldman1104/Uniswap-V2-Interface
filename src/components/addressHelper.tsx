import addresses from '../config/token'

const chainId = 4
// const chainId = 1

export const getStakingAddress = () => {
  return addresses.staking[chainId]
}

export const getVariableAddress = () => {
  return addresses.variable[chainId]
}

export const getApeAddress = () => {
  return addresses.ape[chainId]
}
