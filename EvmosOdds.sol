pragma solidity ^0.4.18;

contract EvmosOdds{

    address public collector = 0x7Fb4B2b6540C5A9e3c1b81BFBC537816731DF8b8; //Evmos testnet
    uint8 public playerSpin;
    uint256 public betAmount;
    uint256 public winAmount;
    uint256 public houseBalance;
    uint80 constant None = uint80(0);
    string public lastresult;
    uint256 public lastWinAmount;
    uint8 public lastPlayerSpin;
    uint8 public lastOdds;
    uint256 public maxBet = 10000000000000000;
    uint8 public beforeS;
    uint8 public afterS;



    //Generate random number between 1 and 100
    function Spin(address player) internal view returns (uint8) {
        uint b = block.number;
        uint timestamp = block.timestamp;
        uint256 random = uint256(block.blockhash(b)) + uint256(player) + uint256(timestamp);
        return uint8(random%100);
    }

    function play(uint8 house) public payable {
        winAmount = (95 * msg.value) / house;
        lastWinAmount = winAmount;
        lastOdds = house;
    	if(winAmount > houseBalance){
    		msg.sender.transfer(msg.value);
    	}else{
          betAmount = msg.value;
          //playerSpin = Spin(msg.sender);
          playerSpin = 5;
          checkAndFundWinner(house);
    	  lastPlayerSpin = playerSpin;

		}
    clean();

	}

    //Reset fields
    function clean() private{
        betAmount = 0;
        winAmount = 0;
        playerSpin = 0;
    }

    //Check if winner
    function checkAndFundWinner(uint8 house) private{
        if (playerSpin < house){
            msg.sender.transfer(winAmount);
			houseBalance -= (winAmount - msg.value);
		    lastresult = "Player Wins";
        }else{
		    houseBalance += betAmount;
		    lastresult = "House Wins";

	    }
    }


    function() public payable{
         houseBalance += msg.value;
    }

	//Withdraw funds
    function collectFunds() public payable{
        if(msg.sender == collector){
			     msg.sender.transfer(houseBalance);
			     houseBalance =0;
		}
    }

    function changeMaxBet(uint256 newMaxBet) public payable{
        if(msg.sender == collector){
			     maxBet = newMaxBet;
		}
    }
}
