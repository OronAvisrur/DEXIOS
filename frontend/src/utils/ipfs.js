import { create } from 'ipfs-http-client';

const projectId = process.env.REACT_APP_INFURA_PROJECT_ID || '2VvaFKQGTXUXGG9f3PC3AYvwTWn';
const projectSecret = process.env.REACT_APP_INFURA_PROJECT_SECRET || '5643866389bd7afe6c82b0c46be5e54f';
const auth = 'Basic ' + btoa(projectId + ':' + projectSecret);

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export const uploadToIPFS = async (file) => {
  if (!file) throw new Error('No file provided');
  
  const added = await client.add(file);
  return added.path;
};

export const getIPFSUrl = (hash) => {
  return `https://ipfs.io/ipfs/${hash}`;
};

export const downloadFromIPFS = async (hash) => {
  const url = getIPFSUrl(hash);
  const response = await fetch(url);
  return response.blob();
};
