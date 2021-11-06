const env = "testnet";
const chainId = 9000;//test net
const price = 0;
let address;

const contractAddress = "0x89Ef7081957d68Bf3c902ab47fAcB96753eA783f";
const etherscanUrl = "https://evm.evmos.org/tx";
let provider = null;

const abi = [
	{
		"constant": true,
		"inputs": [],
		"name": "maxBet",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "playerSpin",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "house",
				"type": "uint8"
			}
		],
		"name": "play",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "collectFunds",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "houseBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "lastPlayerSpin",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "lastOdds",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "collector",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "lastWinAmount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newMaxBet",
				"type": "uint256"
			}
		],
		"name": "changeMaxBet",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "lastresult",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	}
];

window.onload = () => {
  var animateButton = function (e) {
    e.preventDefault;
    //reset animation
    e.target.classList.remove("animate");

    e.target.classList.add("animate");
    setTimeout(function () {
      e.target.classList.remove("animate");
    }, 700);
  };


	//bet slider
	//1 photon = 1000000000000000000
	// default bet = 5000000000000000 (0.005)
	//odds slider
	//odds including 5% house edge = bet (95 / odds) * bet
		var sliderO = document.getElementById("sliderOdds");
		var outputO = document.getElementById("oddsValue");
		var sliderB = document.getElementById("sliderBet");
		var outputB = document.getElementById("betValue");
		var outputW = document.getElementById("winValue");
		var outputOL = document.getElementById("oddsLabel");
		var bet = 0.005;
		var odds = 50;
		var winnings = (95 / 5) * bet;


		outputW.innerHTML = "0.0095 PHOTON's";
		outputB.innerHTML = 0.005 + " PHOTON's"; // Display the default slider value
		// Update the current slider value (each time you drag the slider handle)
		sliderB.oninput = function() {
			bet = this.value / 1000;
			winnings = (95 / sliderO.value) * bet;
	  	outputB.innerHTML = bet + " PHOTON's";
			outputW.innerHTML = winnings.toFixed(14) + " PHOTON's";
		}


		outputO.innerHTML = "50% chance of winning"; // Display the default slider value
		// Update the current slider value (each time you drag the slider handle)
		sliderO.oninput = function() {
			winnings = (95 / this.value) * (sliderB.value / 1000);
	  	outputO.innerHTML = this.value + "% chance of winning";
			odds = this.value;
			outputW.innerHTML = winnings.toFixed(14) + " PHOTON's";
			outputOL.innerHTML = this.value;
		}



  var bubblyButtons = document.getElementsByClassName("bubbly-button");

  for (var i = 0; i < bubblyButtons.length; i++) {
    bubblyButtons[i].addEventListener("click", animateButton, false);
  }

  window?.ethereum?.on("disconnect", () => {
    window.location.reload();
  });

  window?.ethereum?.on("networkChanged", () => {
    window.location.reload();
  });

  window?.ethereum?.on("chainChanged", () => {
    window.location.reload();
  });

  const connectWallet = async () => {
    await window.ethereum.enable();
    if (Number(window.ethereum.chainId) !== chainId) {
      return failedConnectWallet();
    }
    provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts");
    document.getElementById("button").innerHTML = accounts[0];
  };



  const failedConnectWallet = () => {
    document.getElementById("button").innerHTML = "Error Network, switch to Evmos";
  };

  const switchNetwork = async () => {
    if (env === "test") {
      window?.ethereum
        ?.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "9000",
              chainName: "Evmos Testnet",
              nativeCurrency: {
                name: "PHOTON",
                symbol: "PHOTON",
                decimals: 18,
              },
              rpcUrls: ["http://arsiamons.rpc.evmos.org:8545"],
              blockExplorerUrls: ["https://evm.evmos.org"],
            },
          ],
        })
        .then(() => {
          connectWallet();
        })
        .catch(() => {
          failedConnectWallet();
        });
    } else {
      window?.ethereum
        ?.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "9000",
              chainName: "Evmos Testnet",
              nativeCurrency: {
                name: "PHOTON",
                symbol: "PHOTON",
                decimals: 18,
              },
              rpcUrls: ["http://arsiamons.rpc.evmos.org:8545"],
              blockExplorerUrls: ["https://evm.evmos.org"],
            },
          ],
        })
        .then(() => {
          connectWallet();
        })
        .catch(() => {
          failedConnectWallet();
        });
    }
  };

  document.getElementById("button").addEventListener("click", switchNetwork);

  connectWallet();
//this function only works from the collectors account
const handleWithdraw = async () => {
	const signer = await provider.getSigner();
	const account = await signer.getAddress();
	const amountRaw = "0";
	const ImageContract1 = new ethers.Contract(contractAddress, abi, signer);
	const balanceRaw = await provider.getBalance(account);
	const balance = ethers.utils.formatUnits(balanceRaw, 18);
	const estimateGas = await ImageContract1.estimateGas.collectFunds();
	const gasLimit = Math.floor(estimateGas.toNumber() * 2);
	const response = await ImageContract1.collectFunds();
}


  const handleSpin = async () => {
		$.toast().reset("all");
		document.getElementById("winner").style.display = "none";
		document.getElementById("sorry").style.display = "none";
		document.getElementById("spun").innerHTML = "";
    if (!provider) {
      connectWallet();
    } else {
      try {
        document.getElementById("spin").innerHTML = "Spinning...";
				document.getElementById("spin").disabled = true;
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        const amountRaw = (sliderB.value / 1000).toString();
        const ImageContract = new ethers.Contract(contractAddress, abi, signer);
        const balanceRaw = await provider.getBalance(account);
        const balance = ethers.utils.formatUnits(balanceRaw, 18);
        const estimateGas = await ImageContract.estimateGas.play(odds);
        const gasLimit = Math.floor(estimateGas.toNumber() * 2);
        const response = await ImageContract.play(odds,{value: ethers.utils.parseEther(amountRaw.toString())});
				document.getElementById("wheel").style.display = "block";
				$.toast({
          heading: "Wheel Spinning",
          text: "Good luck!",
          position: "top-center",
          showHideTransition: "fade",
          hideAfter: 10000,
          icon: "info",
        });
        const result = await response.wait();
				const balanceRaw2 = await provider.getBalance(account);
				var playerResult = "lost";
				if (balanceRaw2 > balanceRaw){
					playerResult = "win";
					document.getElementById("winner").style.display = "block";
					$.toast().reset("all");
	        $.toast({
	          heading: "Winner!",
	          text: "Congratulations!",
	          showHideTransition: "slide",
	          position: "top-center",
	          icon: "success",
	        });

				}else{
					playerResult = "lost";
					document.getElementById("sorry").style.display = "block";
					$.toast().reset("all");
					$.toast({
						heading: "Lost",
						text: "Better luck next time",
						showHideTransition: "slide",
						position: "top-center",
						icon: "info",
					});
				};
				let txHash = result.transactionHash;
        document.getElementById("spun").innerHTML = "<div><a href='https://evm.evmos.org/tx/"+ txHash +"' target='_blank'> View on Block Explorer</a></center></div>";
        document.getElementById("spin").innerHTML = "Spin";
				document.getElementById("wheel").style.display = "none";
				document.getElementById("spin").disabled = false;
        // window.open(`${etherscanUrl}/${result.transactionHash}`);
      } catch (e) {
				document.getElementById("spin").innerHTML = "Spin";
				document.getElementById("wheel").style.display = "none";
				document.getElementById("spin").disabled = false;
					$.toast({
						heading: "Error",
						text: "Transaction failed - Something went wrong",
						position: "top-center",
						showHideTransition: "fade",
						hideAfter: 5000,
						icon: "error",
					});
			}
    }
  };
  document.getElementById("spin").addEventListener("click", handleSpin);
	document.getElementById("withdraw").addEventListener("click", handleWithdraw);
};
