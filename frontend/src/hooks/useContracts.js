import { useState, useEffect } from 'react';
import { useWeb3 } from './useWeb3';
import DexiosMarketplace from '../contracts/DexiosMarketplace.json';
import DexiosToken from '../contracts/DexiosToken.json';
import SellerProfileNFT from '../contracts/SellerProfileNFT.json';

export const useContracts = () => {
  const { web3 } = useWeb3();
  const [marketplace, setMarketplace] = useState(null);
  const [token, setToken] = useState(null);
  const [sellerNFT, setSellerNFT] = useState(null);

  useEffect(() => {
    if (web3) {
      loadContracts();
    }
  }, [web3]);

  const loadContracts = async () => {
    try {
      const networkId = await web3.eth.net.getId();

      const marketplaceData = DexiosMarketplace.networks[networkId];
      const tokenData = DexiosToken.networks[networkId];
      const sellerNFTData = SellerProfileNFT.networks[networkId];

      if (marketplaceData && tokenData && sellerNFTData) {
        const marketplaceContract = new web3.eth.Contract(
          DexiosMarketplace.abi,
          marketplaceData.address
        );
        const tokenContract = new web3.eth.Contract(
          DexiosToken.abi,
          tokenData.address
        );
        const sellerNFTContract = new web3.eth.Contract(
          SellerProfileNFT.abi,
          sellerNFTData.address
        );

        setMarketplace(marketplaceContract);
        setToken(tokenContract);
        setSellerNFT(sellerNFTContract);
      }
    } catch (error) {
      console.error('Error loading contracts:', error);
    }
  };

  return { marketplace, token, sellerNFT };
};
