import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, ABI } from '../../config';

export function getProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
        return new ethers.providers.Web3Provider(window.ethereum);
    } else {
        throw new Error('MetaMask is not installed');
    }
}

export function getSigner() {
    const provider = getProvider();
    return provider.getSigner();
}

export function getContract() {
    const signer = getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
}
