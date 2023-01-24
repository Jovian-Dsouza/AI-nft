const { Duplex } = require('stream');
const pinataSDK = require('@pinata/sdk');

class IPFS {
    constructor(apiKey, apiSecret) {
        this.pinata = new pinataSDK(apiKey, apiSecret);
    }

    bufferToStream(myBuffer) {
        let tmp = new Duplex();
        tmp.push(myBuffer);
        tmp.push(null);
        return tmp;
    }

    async testAuthentication() {
        this.pinata.testAuthentication().then((result) => {
            //handle successful authentication here
            console.log("IPFS : ", result);
        }).catch((err) => {
            //handle error here
            console.log(err);
            process.exit(0);
        });
    }

    async addToIPFS(url, name) {
        const resp = await fetch(url);
        const blob = await resp.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const myReadableStream = this.bufferToStream(Buffer.from(arrayBuffer));

        const options = {
            pinataMetadata: {
                name: name
            }
        }
        const result = await this.pinata.pinFileToIPFS(myReadableStream, options).catch(err => {console.log(err);})
        return `https://gateway.pinata.cloud/ipfs/${result['IpfsHash']}`;
    }
}

exports.IPFS = IPFS;