/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const { json } = require('body-parser');
const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {
    constructor() {
        this.db = level(chainDB);
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        return new Promise((resolve, reject) => {
            this.db.createReadStream().on('data', (data) => {

            }).on('error', (err) => {
                reject(err);
            }).on('close', () => {
                this.db.put(key, value, (err) => {
                    if (err) {
                        reject(err);
                    }
                })
                resolve(JSON.parse(value));
            });
        })
    }

    // Method that return the height
    getBlocksCount() {
        return new Promise((resolve, reject) => {
            let i = 0;
            this.db.createReadStream().on('data', (data) => {
                i++;
            }).on('error', (err) => {
                reject(err);
            }).on('close', () => {
                resolve(i);
            });
        });
    }
    
    // Get Block By Hash
    getBlockByHash(hash) {
        let block = null;
        return new Promise((resolve, reject) => {
            this.db.createReadStream().on('data', (data) => {
                if(JSON.parse(data.value).hash === hash){
                    block = data.value;
                }
            }).on('error', function (err) {
                reject(err)
            }).on('close', function () {
                resolve(block);
            });
        })
    }

    // Get Block By Wallet Address
    getBlockByWalletAddress(address) {
        let blocks = [];
        return new Promise((resolve, reject) => {
            this.db.createReadStream().on('data', (data) => {
                if(JSON.parse(data.value).body.address === address){
                    blocks.push(data.value);
                }
            }).on('error', function (err) {
                reject(err)
            }).on('close', function () {
                resolve(blocks);
            });
        })
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
        return new Promise((resolve, reject) => {
            this.db.get(key, (err, value) => {
                if (err) {
                    reject(err);
                }
                resolve(value);
            })
        });
    }
}

module.exports.LevelSandbox = LevelSandbox;