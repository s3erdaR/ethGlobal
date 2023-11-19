import { useState, useEffect,useMemo } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../Constant/addresses";
import { CONTRACT_ABI } from "../Constant/abi";

export const useDaoContract = () => {
    const [contract, setContract] = useState(null);

    useEffect(()=> {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    const _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer); //Tx işlemi yapmayacaksan signer yerine provider yaz.
    setContract(_contract);
    },[]);
    

    return contract;
    

};

export const useServerContract =  () => {
    return useMemo(() =>{
        const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/GRLIfZjmMsEsNXcIcydNE0S_2w28vKqe");
        const signer = new ethers.Wallet("af6c58447cdb700dd732f65f924b092240c65ee7c33f702ebe0433b283b58bd6", provider);
        
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer); //Tx işlemi yapmayacaksan signer yerine povider yaz.r
        
    
        return _contract;
    },[]);
    
    

};

