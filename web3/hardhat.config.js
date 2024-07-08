require('@nomiclabs/hardhat-ethers');
const AlCHEMY_API_KEY="";


module.exports = {
    solidity: '0.8.0',
    networks: {
        sepolia: {
            url: "https://eth-sepolia.g.alchemy.com/v2/qkpUGif8EnAxzVR4BBkYf2E2krm11DLy",
            accounts: ["91f377466477449e93cc94efbcbcf4a42947413ef13ffd6ef454bb7aadf83686"],
        },
    },
};
