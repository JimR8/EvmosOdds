const env = "testnet";
const chainId = 9000;//test net
const price = 0;
let address;

const contractAddress = "0xFab962090Ff0754A515184d67Bd3522A71d16096";
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
			"outputs": [],
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
          heading: "Wheel",
          text: "Spinning!",
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
				if (e.data.message.includes('House')){
					$.toast({
						heading: "Error",
						text: "Contract does not have enough funds for that payout",
						position: "top-center",
						showHideTransition: "fade",
						hideAfter: 5000,
						icon: "error",
					});
				}else{
					$.toast({
						heading: "Error",
						text: "Transaction failed",
						position: "top-center",
						showHideTransition: "fade",
						hideAfter: 5000,
						icon: "error",
					});
				}

			}
    }
  };
  document.getElementById("spin").addEventListener("click", handleSpin);
};
