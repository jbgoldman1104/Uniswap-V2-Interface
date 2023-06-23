import {
    getStakingAddress,
    getApeAddress,
    getVariableAddress,
  } from "./addressHelper";
  import { useWeb3 } from "./useWeb3";
  
  import staking from "../config/stakingabi.json";
  import variable from "../config/variableabi.json";
  import ape from "../config/apeabi.json";
  
  const useContract = (abi: any, add: any) => {
    const web3 = useWeb3();
    return new web3.eth.Contract(abi, add);
  };
  /**
   * Helper hooks to get specific contracts (by ABI)
   */
  
  export const useApeContract = () => {
    return useContract(ape, getApeAddress());
  };
  
  export const useStakingContract = () => {
    return useContract(staking, getStakingAddress());
  };
  
  export const useVariableContract = () => {
    return useContract(variable, getVariableAddress());
  };
  
  export default useContract;
  