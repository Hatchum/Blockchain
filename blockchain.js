<<<<<<< HEAD
let CryptoJS = require("crypto-js");
let express = require("express");
let bodyParser = require('body-parser');
let WebSocket = require("ws");

let http_port = process.env.HTTP_PORT || 3001;
let p2p_port = process.env.P2P_PORT || 6001;
let initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class Block {
    /*
    public index: number;
    public previousHash: string;
    public timestamp: number;
    public data: string;
    public signature: string;
    public nonce: string;
    public hash: string;
    */
=======
class Block {
>>>>>>> Feature-1
    constructor(index, previousHash, timestamp, data, hash) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash.toString();
    }
<<<<<<< HEAD

    /*
    constructor(index, previousHash, timestamp, data, signature, nonce, hash) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = data;
        this.signature = signature;
        this.nonce = nonce;
        this.hash = hash.toString();
    }
    */
}

let sockets = [];
let MessageType = {
    QUERY_LATEST: 0,
    QUERY_ALL: 1,
    RESPONSE_BLOCKCHAIN: 2
};

let getGenesisBlock = () => {
    return new Block(0, "0", 1465154705, "Mon genesis block !", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
};

let blockchain = [getGenesisBlock];

let initHttpServer = () => {
    let app = express();
    app.use(bodyParser.json);

    app.get('/blocks', (req, res) => res.send(JSON.stringify(blockchain)));
    app.post('/mineBlock', (req, res) => {
        let newBlock = generateNextBlock(req.body.data);
        addBlock(newBlock);
        broadcast(responseLatestMessage());
        console.log('Block ajouté : ' + JSON.stringify(newBlock));
        res.send();
    });
    app.get('/peers', (req, res) => {
        res.send(sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    app.post('/addPeer', (req, res) => {
        connectToPeer([req.body.peerIdentity]);
        res.send();
    });
    app.listen(http_port, () => console.log('Ecoute HTTP sur le port : ' + http_port));
};

let initP2PServer = () => {
    let server = new WebSocket.Server({port: p2p_port});
    server.on('connection', ws => initConnection(ws));
    console.log('Ecoute du port websocket p2p sur : ' + p2p_port);
};

let initConnection = (ws) => {
    sockets.push(ws);
    initMessageHandler(ws);
    initErrorHandler(ws);
    write(ws, queryChainLengthMessage());
};

let initMessageHandler = (ws) => {
    ws.on('message', (data) => {
        let message = JSON.parse(data);
        console.log('Message Reçu' + JSON.stringify(message));
        switch (message.type) {
            case MessageType.QUERY_LATEST:
                write(ws, responseLatestMessage());
                break;
            case MessageType.QUERY_ALL:
                write(ws, responseChainMessage());
                break;
            case MessageType.RESPONSE_BLOCKCHAIN:
                handleBlockchainResponse(message);
                break;
        }
    });
};

let initErrorHandler = (ws) => {
    let closeConnection = (ws) => {
        console.log('Echec de la connexion au pair : ' + ws.url);
        sockets.splice(sockets.indexOf(ws), 1);
    };
    ws.on('close', () => closeConnection(ws));
    ws.on('error', () => closeConnection(ws));
};

let generateNextBlock = (blockData) => {
    let previousBlock = getLatestBlock();
    let nextIndex = previousBlock.index + 1;
    let nextTimestamp = new Date().getTime()/1000;
    let nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash);
};

let calculateHashForBlock = (block) => {
    return calculateHash(block.index, block.previousHash, block.timestamp, block.data);
};

let calculateHash = (index, previousHash, timestamp, data) => {
  const encoder = new TextEncoder();
  const encodingData = encoder.encode(data);
  const dataForHash = index + previousHash + timestamp + encodingData;
  return CryptoJS.SHA256(dataForHash).toString();
};

let addBlock = (newBlock) => {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
    }
};

let isValidNewBlock = (newBlock, previousBlock) => {
=======
}

var digestData = (index, previousHash, timestamp, data) => {
  const encoder = new TextEncoder();
  const encodingData = encoder.encode(data);
  const dataForHash = index + previousHash + timestamp + encodingData;
  const hash = crypto.subtle.digest('SHA-256', dataForHash);
  return hash;
};

var digestDataForBlock = (block) => {
    return digestData(block.index, block.previousHash, block.timestamp, block.data);
};

var getGenesisBlock = () => {
    return new Block(0, "0", 1465154705, "Mon genesis block !", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
};

var generateNextBlock = (blockData) => {
    var previousBlock = getLatestBlock();
    var nextIndex = previousBlock.index + 1;
    var nextTimestamp = new Date().getTime()/1000;
    var nextHash = digestData(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash);
};

var blockchain = [getGenesisBlock];

var isValidNewBlock = (newBlock, previousBlock) => {
>>>>>>> Feature-1
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('l\'index du nouveau block est incorrect.');
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('le previousHash du nouveau block ne correspond pas au hash du previous block.');
        return false;
<<<<<<< HEAD
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
        console.log('hash invalid: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
=======
    } else if (digestDataForBlock(newBlock) !== newBlock.hash) {
        console.log('Le hash du nouveau block est incoherent.');
>>>>>>> Feature-1
        return false;
    }
    return true;
};

<<<<<<< HEAD
let connectToPeer = (newPeers) => {
    newPeers.forEach((peer) => {
        let ws = new WebSocket(peer);
        ws.on('open', () => initConnection(ws));
        ws.on('error', () => {
            console.log('Echec de la connexion')
        });
    });
};

let handleBlockchainResponse = (message) => {
    let receivedBlocks = JSON.parse(message.data).sort((b1, b2) => (b1.index - b2.index));
    let latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
    let latestBlockHeld = getLatestBlock();
    if (latestBlockReceived.index > latestBlockHeld.index) {
        console.log('Dernier block de la blockchain : ' + latestBlockHeld.index + '. Block reçu par le pair : ' + latestBlockReceived.index);
        if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
            console.log("Nous ne pouvons appondre le block reçu à notre chaîne");
            blockchain.push(latestBlockReceived);
            broadcast(responseLatestMessage());
        } else if (receivedBlocks.length === 1) {
            console.log("Nous devons interroger notre chaîne depuis notre pair");
            broadcast(queryAllMessage());
        } else {
            console.log("La blockchain reçue est plus longue que la blockchain actuelle");
            replaceChain(receivedBlocks);
        }
    } else {
        console.log('La blockchain reçue est plus courte que la blockchain actuelle. Ne rien faire.');
    }
};

let replaceChain = (newBlocks) => {
    if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
        console.log('La blockchain reçue est valide. Remplacer la blockchain actuelle par la blockchain reçue.');
        blockchain = newBlocks;
        broadcast(responseLatestMessage());
    } else {
        console.log('La blockchain reçue est invalide.');
    }
};

let isValidChain = (blockchainToValidate) => {
    if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(getGenesisBlock())) {
        return false;
    }
    let tempBlocks = [blockchainToValidate[0]];
    for (let i = 1 ; i < blockchainToValidate.length ; i++) {
=======
var isValidBlockchain = (blockchainToValidate) => {
    if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(getGenesisBlock())) {
        return false;
    }
    var tempBlocks = [blockchainToValidate[0]];
    for (var i = 1 ; i < blockchainToValidate.length ; i++) {
>>>>>>> Feature-1
        if (isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
            tempBlocks.push(blockchainToValidate[i]);
        } else {
            return false;
        }
    }
    return true;
};

<<<<<<< HEAD
let getLatestBlock = () => blockchain[blockchain.length - 1];
let queryChainLengthMessage = () => ({'type': MessageType.QUERY_LATEST});
let queryAllMessage = () => ({'type': MessageType.QUERY_ALL});
let responseChainMessage = () =>({
    'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': JSON.stringify(blockchain)
});
let responseLatestMessage = () => ({
    'type': MessageType.RESPONSE_BLOCKCHAIN,
    'data': JSON.stringify([getLatestBlock()])
});

let write = (ws, message) => ws.send(JSON.stringify(message));
let broadcast = (message) => sockets.forEach(socket => write(socket, message));

connectToPeer(initialPeers);
initHttpServer();
initP2PServer();
=======
var replaceChain = (newBlocks) => {
    if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
        console.log('La blockchain reçue est valide. Remplacer la blockchain actuelle par la blockchain reçue.');
        blockchain = newBlocks;
        broadcast(responseLatestMsg());
    } else {
        console.log('La blockchain reçue est invalide.');
    }
};

var getLatestBlock = () => {
    return blockchain[-1];
};
>>>>>>> Feature-1
