pragma solidity ^0.4.18;

contract EvmosOdds{

    address public collector = 0xEFa23c86891Dc7eeE29BB68Feb6358B1A9Fec5c9; //Evmos testnet
    uint8 public playerSpin;
    uint256 betAmount;
    uint256 winAmount;
    uint256 public houseBalance;
    uint80 constant None = uint80(0);

    //Generate random number between 1 and 100
    function Spin(address player) internal view returns (uint8) {
        uint b = block.number;
        uint timestamp = block.timestamp;
        uint256 random = uint256(blockhash(b)) + uint256(player) + uint256(timestamp);
        return uint8(random%100);
    }

    function play(uint8 house) public payable {
        if(msg.sender == collector){
			  houseBalance += msg.value;
		}else{
        winAmount = (95 / house) * msg.value;
    		if(winAmount*2 > houseBalance){
    			msg.sender.transfer(msg.value);
          clean();
    		}else{
          betAmount = msg.value;
          playerSpin = Spin(msg.sender);
    			checkAndFundWinner(house);
          clean();
    		}
		}

	}

    //Reset fields
    function clean() public{
        betAmount = None;
        winAmount = None;
        playerSpin = 0;
    }

    //Check if winner
    function checkAndFundWinner(uint8 house) public{
        while(playerSpin == house){
            Spin(msg.sender);
        }
        if (playerSpin < house){
            msg.sender.transfer(winAmount);
				    houseBalance -= winAmount;
        }else{
				    houseBalance += betAmount;
			  }
    }

	//Withdraw funds
    function collectFunds() public payable{
        if(msg.sender == collector){
			     msg.sender.transfer(houseBalance);
			     houseBalance =0;
		    }
    }
}
