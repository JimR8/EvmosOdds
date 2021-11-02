pragma solidity ^0.4.18;

contract EvmosOdds{

    address public collector = 0x7Fb4B2b6540C5A9e3c1b81BFBC537816731DF8b8; //Evmos testnet
    uint8 public playerSpin;
    uint256 betAmount;
    uint256 winAmount;
    uint256 public houseBalance;
    uint80 constant None = uint80(0);
    string public lastresult;
    uint256 public lastWinAmount;
    uint256 public lastPlayerSpin;
    uint256 public lastOdds;
    uint256 public maxBet = 10000000000000000;


    //Generate random number between 1 and 100
    function Spin(address player) internal view returns (uint8) {
        uint b = block.number;
        uint timestamp = block.timestamp;
        uint256 random = uint256(blockhash(b)) + uint256(player) + uint256(timestamp);
        return uint8(random%100);
    }

    function play(uint8 house) public payable {
        winAmount = (95 * msg.value) / house;
        lastWinAmount = winAmount;
        lastOdds = house;

    	if(winAmount > houseBalance || msg.value > maxBet){
    		msg.sender.transfer(msg.value);
    		revert("House cannot support that size bet at the moment.");
            clean();
    	}else{
          betAmount = msg.value;
          playerSpin = Spin(msg.sender);
    			checkAndFundWinner(house);
          clean();
		}

	}

    //Reset fields
    function clean() private{
        betAmount = None;
        winAmount = None;
        playerSpin = 0;
    }

    //Check if winner
    function checkAndFundWinner(uint8 house) private{
        while(playerSpin == house){
            Spin(msg.sender);
        }
        lastPlayerSpin = playerSpin;
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
