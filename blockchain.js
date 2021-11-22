class Block {
    constructor(index, previousHash, timestamp, data, hash) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash.toString();
    }
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
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('l\'index du nouveau block est incorrect.');
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('le previousHash du nouveau block ne correspond pas au hash du previous block.');
        return false;
    } else if (digestDataForBlock(newBlock) !== newBlock.hash) {
        console.log('Le hash du nouveau block est incoherent.');
        return false;
    }
    return true;
};

var isValidBlockchain = (blockchainToValidate) => {
    if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(getGenesisBlock())) {
        return false;
    }
    var tempBlocks = [blockchainToValidate[0]];
    for (var i = 1 ; i < blockchainToValidate.length ; i++) {
        if (isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
            tempBlocks.push(blockchainToValidate[i]);
        } else {
            return false;
        }
    }
    return true;
};

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