import Web3 from 'web3';

export const fromWei = (value) => {
  return Web3.utils.fromWei(value.toString(), 'ether');
};

export const toWei = (value) => {
  return Web3.utils.toWei(value.toString(), 'ether');
};

export const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

export const getOrderStatus = (status) => {
  const statuses = ['Pending', 'Delivered', 'Approved', 'Rejected', 'Disputed'];
  return statuses[status] || 'Unknown';
};
