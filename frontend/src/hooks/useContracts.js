import { useState, useEffect } from 'react';

const useContracts = (web3) => {
  const [marketplace, setMarketplace] = useState(null);
  const [token, setToken] = useState(null);
  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContracts = async () => {
      if (!web3) {
        setLoading(false);
        return;
      }

      try {
        const networkId = await web3.eth.net.getId();
        
        const DexiosMarketplace = require('../contracts/DexiosMarketplace.json');
        const DexiosToken = require('../contracts/DexiosToken.json');
        const SellerProfileNFT = require('../contracts/SellerProfileNFT.json');

        const marketplaceNetwork = DexiosMarketplace.networks[networkId];
        const tokenNetwork = DexiosToken.networks[networkId];
        const nftNetwork = SellerProfileNFT.networks[networkId];

        if (marketplaceNetwork && tokenNetwork && nftNetwork) {
          const marketplaceInstance = new web3.eth.Contract(
            DexiosMarketplace.abi,
            marketplaceNetwork.address
          );
          
          const tokenInstance = new web3.eth.Contract(
            DexiosToken.abi,
            tokenNetwork.address
          );
          
          const nftInstance = new web3.eth.Contract(
            SellerProfileNFT.abi,
            nftNetwork.address
          );

          setMarketplace(marketplaceInstance);
          setToken(tokenInstance);
          setNft(nftInstance);
        } else {
          alert('Contracts not deployed on this network');
        }
      } catch (error) {
        console.error('Error loading contracts:', error);
        alert('Failed to load contracts');
      } finally {
        setLoading(false);
      }
    };

    loadContracts();
  }, [web3]);

  return { marketplace, token, nft, loading };
};

export default useContracts;
