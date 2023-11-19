import './App.css';
import { Form } from './video_player/Form';
import { Youtube } from './video_player/yt';
import { useEffect, useState } from 'react';
//import { BigNumber, Contract, ethers } from "ethers";
import { useDaoContract, useServerContract } from './hooks/useDaoContract';
import { movies } from './Constant/movies';
import { TaskTimer } from 'tasktimer';


function App() {
  const ethers = require("ethers")

  const [youtubeLink, setYoutubeLink]= useState(null);
  
  const [balance, setBalance] = useState("");

  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState("");

  const [lastLink, setLastLink] = useState("");

  const daoContract = useDaoContract();
  
  const server_contract = useServerContract();

  function connect() {
    if (!window.ethereum) {
      alert("Metamask is not installed");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    provider
      .send("eth_requestAccounts", [])
      .then((accounts) => setAccount(accounts[0]))
      .catch((err) => console.log(err));
    const signer = provider.getSigner();
    signer.getAddress().then((address) => console.log(address));
    console.log(signer);
    
  }

  async function getAccountBalance() {
    try {
      // Check if MetaMask is installed and connected
      if (!window.ethereum || !window.ethereum.isConnected()) {
        throw new Error('Please install MetaMask and connect to an Ethereum network');
      }

      const address = account;
      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.utils.formatEther(balance);
      setBalance(formattedBalance);
      console.log(balance);
      console.log(`Account balance: ${formattedBalance} ETH`);
    } catch (error) {
      console.error('Error occurred while fetching the account balance:', error);
    }
  }

  async function createProposal() {
    console.log("proposal created");
    await server_contract?.createProposal();
  }


  const[_movieId, setMovieId] = useState("");
  async function vote() {
    await daoContract?.UpVoteMovie(_movieId);
    console.log("Voted movie: " + movies[_movieId].title);

  }
  const[_currentVote, setVoteCount] = useState("");
  async function getCurrentVote() {
    setVoteCount(await server_contract?.getVoteNumber(_movieId));
    console.log("Current vote number is: " + _currentVote);
  }

  const[_intervalTime, setInterval] = useState(null);
  async function getIntervalTime() {
    setInterval(await server_contract?.getVotingInterval());
    console.log("Interval time: " + _intervalTime + "second")
  }
  const intervalTime = 70;
  
  const [_chosenMovie, setChosenMovie] = useState();



  async function Autonomous() {
    while (true) {
      console.log("Loop başlıyor.");

      console.log(server_contract);

      const txnRes = await server_contract?.createProposal();
      const txnRec = await txnRes.wait();

      console.warn(txnRes,txnRec);

      await sleep(intervalTime);
      
      const txnRes1 = await server_contract?.finalizeProposal();
      const txnRec1 = await txnRes1.wait();

      await sleep(intervalTime);

      const txnResMov = await server_contract?.getChosenMovie();
      const txnRecMov = await txnResMov.wait();

      console.log("Chosen Movie:"+ _chosenMovie);

      await sleep(30);
      console.log("Loop finished");
      
    }
  }

  useEffect(()=>{
    Autonomous();
  },[]);
  
 
  async function sleep(seconds){
    return new Promise((resolve) => setTimeout(resolve,seconds*1000));
  }

  return (

    <div className="App">
      <h1>DATV</h1>
      <div>
        <button onClick={() => {
          if(account) return;
          connect();
          // is_allowed();
        }}
        >
        {account ? "Connected": "Connect"}{" "}
        </button>
        <button onClick={getAccountBalance}>Get Balance</button>

        <h1>Show Proposal</h1>
        <h1>Vote</h1>
        <input placeholder = "Enter The Movie ID"value = {_movieId} onChange={(e) => setMovieId(e.target.value)} /><h1></h1>
        <button onClick={vote}> VoteUp </button>
        {/* <h1>Moive Name: {films[_movieId].title}, VoteUp: {_currentVote}</h1> */}
        <h1>Chosen Movie: {_chosenMovie}</h1>
        <h1>Last video is: {lastLink}</h1>
        <h1>Total amount is: {balance}</h1>
      </div>

      <h1>Watch The Film</h1>
      {/* <Form setYoutubeLink={setYoutubeLink}/> */}
        <br></br>
        {/* <Youtube youtubeLink={movies[_chosenMovie]}/> */}
        {/* <Youtube youtubeLink={lastLink}/> */}
    </div>
  );
}

export default App;
