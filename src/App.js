import './App1.css';
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
  const [movieTitle, setMovieTitle]= useState(null);
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState("");
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

  const[_movieId, setMovieId] = useState("");
  async function vote() {

    try {
      await daoContract?.UpVoteMovie(_movieId);
    } catch (error) {
      console.log(error)
    }
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
  let chosen_movie = null;



  async function Autonomous() {
    while (true) {

      try {
      
      const voteCounter = Array(10).fill(0);

      console.log("Loop başlıyor.");

      console.log(server_contract);

      const txnRes = await server_contract?.createProposal();
      const txnRec = await txnRes.wait();

      console.warn(txnRes,txnRec);

      await sleep(intervalTime);
      
      const txnRes1 = await server_contract?.finalizeProposal();
      const txnRec1 = await txnRes1.wait();

      await sleep(intervalTime);

      const chosen_mov = await server_contract?.getCurrentMovie();
      voteCounter[chosen_mov]++;
      chosen_movie = movies[chosen_mov];
      setYoutubeLink(movies[chosen_mov].trailer); 
      setMovieTitle(movies[chosen_mov].title);
      console.log("Chosen Movie:"+movies[chosen_mov]);

      await sleep(15);
      console.log("Loop finished");
      
        
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(()=>{
    Autonomous();
  },[]);
  
 
  async function sleep(seconds){
    return new Promise((resolve) => setTimeout(resolve,seconds*1000));
  }


  return (

    <div className="App1">
      <header>
        <h1>DATV</h1>
        <button onClick={() => {
        if(account) return;
        connect();
      }}
      >
       {account ? "Connected": "Connect Metamask"}{" "}
      </button>
      </header>

      <div className="content-container proposal">
        <h2>Today's Proposal</h2>
        <div>
          <h3>Which movie will we watch today?</h3>
          <select
            id="movieSelect"
            value={_movieId}
            onChange={(e) => setMovieId(ethers.BigNumber.from(e.target.value))}
          >
            <option value="1">Inception</option>
            <option value="2">The Shawshank Redemption</option>
            <option value="3">The Dark Knight</option>
            <option value="4">Pulp Fiction</option>
            <option value="5">Forrest Gump</option>
            <option value="6">The Matrix</option>
            <option value="7">Titanic</option>
            <option value="8">Avatar</option>
            <option value="9">The Godfather</option>
            <option value="10">Schindler\'s List</option>
          </select>
          <br />
          
          <button onClick={vote}>Submit Vote</button>
        </div>
      </div>

      <div className="content-container">
        <h2>Time to Watch !!!</h2>        
        <p>Movie: {movieTitle}</p>
        <Youtube youtubeLink={youtubeLink}></Youtube>
        <div id="player"></div>
      </div>
    </div>
  );
}

export default App;
