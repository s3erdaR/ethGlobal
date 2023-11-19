import { useState, useEffect,useMemo } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../Constant/addresses";
import { CONTRACT_ABI } from "../Constant/abi";
import { private_key, alchemy_rpc } from "../Constant/key";

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
        const provider = new ethers.providers.JsonRpcProvider(alchemy_rpc);
        const signer = new ethers.Wallet(private_key, provider);
        
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer); //Tx işlemi yapmayacaksan signer yerine povider yaz.r
        
    
        return _contract;
    },[]);
    
    

};

