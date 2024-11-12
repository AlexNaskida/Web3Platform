// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract SmartContract {
    address payable public owner;

    // delete this later and move to transfering ETH,( this is what payable is for)
    // Create Total Supply 
    mapping(address => uint) public balances;

    event ConstructorCalled(address indexed _owner);
    event messageCreatedEvent(uint256 id, address author, string content, uint256 timestamp);
    event messageLikeEvent(address liker, address tweetAuthor, uint256 tweetId, uint256 newLikeCount);
    event messageUnlikeEvent(address unliker, address tweetAuthor, uint256 tweetId, uint256 newLikeCount);
    event Transcation(address sender, address receiver, uint256 amount);
    event Mint(address sender, address receiver, uint256 amount);
    event Burn(address sender, address receiver, uint256 amount);

    event FundsReceived(address sender, uint256 amount);

    
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
    function transfer(address _to, uint256 _amount) public payable {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
    
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;

        emit Transcation(msg.sender, _to, _amount);
    }

    function mint(address _account, uint256 _amount) public onlyOwner payable {
        require(_account != address(0), "Mint to the zero address");
        balances[_account] += _amount;

        emit Mint(msg.sender, address(0), _amount);

    }

    function burn(uint256 _amount) public onlyOwner {
        require(msg.sender != address(0), "Burn from the zero address");
        require(balances[msg.sender] >= _amount, "Burn amount exceeds balance");
        balances[msg.sender] -= _amount;
    
        emit Burn(msg.sender, address(0), _amount);
    }

    fallback() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }

    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }
}