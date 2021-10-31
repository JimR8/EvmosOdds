const env = "testnet";
const chainId = 9000;//test net
const price = 0;
let address;

const contractAddress = "0x79F1E8205A355501ECfac0b4eaa3bA931D679aA1";
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



		outputB.innerHTML = 0.005 + " PHOTON's"; // Display the default slider value
		// Update the current slider value (each time you drag the slider handle)
		sliderB.oninput = function() {
			bet = this.value / 1000;
			winnings = (95 / sliderO.value) * bet;
	  	outputB.innerHTML = bet + " PHOTON's";
			outputW.innerHTML = winnings.toFixed(14) + " PHOTON's";
		}


		outputO.innerHTML = "50%"; // Display the default slider value
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
    if (!provider) {
      connectWallet();
    } else {
      try {
        document.getElementById("spin").innerHTML = "Spinning...";
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        const amountRaw = (sliderB.value / 1000).toString();
        const ImageContract = new ethers.Contract(contractAddress, abi, signer);
        const balanceRaw = await provider.getBalance(account);
        const balance = ethers.utils.formatUnits(balanceRaw, 18);
        const estimateGas = await ImageContract.estimateGas.play(odds);
        const gasLimit = Math.floor(estimateGas.toNumber() * 2);
        const response = await ImageContract.play(odds,{value: ethers.utils.parseEther(amountRaw.toString())});
				document.getElementById("wheel").visibility = "visibile";
				$.toast({
          heading: "Wheel",
          text: "Spinning!",
          position: "top-center",
          showHideTransition: "fade",
          hideAfter: 10000,
          icon: "info",
        });
        const result = await response.wait();
				let tokenId = result.events[0].args._tokenId.toString();
				let txHash = result.transactionHash;
        let html ="<center><h2>You Minted NFT #" + tokenId +"</h2><div><h2>Your Evmos Testnet NFT</h2><img src='images/Evmos_AM.PNG'></div><div><a href='https://evm.evmos.org/tx/"+ txHash +"' target='_blank'> View on Block Explorer</a></center></div>";
        $('div#minted').html(html);
        $.toast().reset("all");
        $.toast({
          heading: "Success",
          text: "Minted Success!",
          showHideTransition: "slide",
          position: "top-center",
          icon: "success",
        });
        document.getElementById("spin").innerHTML = "Spin";
				document.getElementById("wheel").visibility = "visibile";
        // window.open(`${etherscanUrl}/${result.transactionHash}`);
      } catch (e) {}
    }
  };
  document.getElementById("spin").addEventListener("click", handleSpin);
	document.getElementById("wheel").visibility = "visibile";
};
