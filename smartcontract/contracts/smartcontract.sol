// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract SmartContract {
    address payable public owner;

    // delete this later and move to transfering ETH,( this is what payable is for)
    // Create Total Supply 
    event ConstructorCalled(address indexed _owner);
    event messageCreatedEvent(uint256 id, address author, string content, uint256 timestamp);
    event messageLikeEvent(address liker, address tweetAuthor, uint256 tweetId, uint256 newLikeCount);
    event messageUnlikeEvent(address unliker, address tweetAuthor, uint256 tweetId, uint256 newLikeCount);
    event Transcation(address sender, address receiver, uint256 amount);
    event Mint(address sender, address receiver, uint256 amount);
    event Burn(address sender, address receiver, uint256 amount);

    event TransferReceived(address indexed sender, uint amount);
    event TransferSent(address indexed recipient, uint256 amount, string message);
    
    constructor() {
        owner = payable(msg.sender);
	    emit ConstructorCalled(owner);
    }

    struct Messages {
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
    }
    
    mapping(address => Messages[]) public messages;

    modifier onlyOwner() {
        require(msg.sender == owner, "You are Not the Owner!");
        _;
    }

    function createMessage(string memory _messages) public {
        Messages memory newMessage = Messages({
            id: messages[msg.sender].length,
            author: msg.sender,
            content: _messages,
            timestamp: block.timestamp,
            likes: 0
        });

        messages[msg.sender].push(newMessage);
        emit messageCreatedEvent(newMessage.id, newMessage.author, newMessage.content, newMessage.timestamp);
    }

    function getAllMessages(address _owner) public view onlyOwner returns (Messages[] memory )  {
        return messages[_owner];
    }

    function getSenderMessages(uint16 _i) public view returns (Messages memory) {
        return messages[msg.sender][_i];
    }   

    function likeMessage(address author, uint256 _message_number ) external {
        messages[author][_message_number].likes++;

        emit messageLikeEvent(msg.sender, author, _message_number, messages[author][_message_number].likes);
    }

    function unLikeMessage(address author, uint256 _message_number ) external {
        messages[author][_message_number].likes--;

        emit messageUnlikeEvent(msg.sender, author, _message_number, messages[author][_message_number].likes);        
    }

    // working with money
    function transferEth(address payable _recipient, string memory _message) public payable {
        require(msg.value > 0, "Transfer amount must be greater than 0");
        
        // Transfer ETH
        (bool success, ) = _recipient.call{value: msg.value}("");
        require(success, "Transfer failed");

        // Emit transfer event with the message
        emit TransferSent(_recipient, msg.value, _message);
    }

    receive() external payable {
        emit TransferReceived(msg.sender, msg.value);
    }
}