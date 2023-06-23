import BigNumber from "bignumber.js";

export const setApprovalForAll = async (apeContract: any, stakingContract: any, account: any, approved: any) => {
  return apeContract.methods
    .setApprovalForAll(
        stakingContract.options.address,
        approved
    )
    .send({ from: account });
};

export const approve = async (apeContract: any, stakingContract: any, account: any, tokenId: any) => {
  return apeContract.methods
    .approve(
        stakingContract.options.address,
        tokenId
    )
    .send({ from: account });
};

export const stake = async (
  stakingContract: any,
  tokenIds: any,
  account: any
) => {
  return stakingContract.methods
    .stake(tokenIds)
    .send({ from: account });
};

export const unstake = async (stakingContract: any, tokenIds: any, account: any) => {
  return stakingContract.methods.unstake(tokenIds).send({ from: account });
};

export const claim = async (stakingContract: any, account: any) => {
  return stakingContract.methods.claim().send({ from: account });
};
