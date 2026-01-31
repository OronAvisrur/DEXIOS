import React, { useState, useEffect } from 'react';
import { useContracts } from '../hooks/useContracts';
import { useWeb3 } from '../hooks/useWeb3';
import { fromWei } from '../utils/web3';
import { uploadToIPFS } from '../utils/ipfs';
import FileUpload from './FileUpload';
import FilePreview from './FilePreview';
import './MyOrders.css';

const MyOrders = () => {
  const { account } = useWeb3();
  const { marketplace } = useContracts();
  const [activeTab, setActiveTab] = useState('buyer');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingOrder, setUploadingOrder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (marketplace && account) {
      loadOrders();
    }
  }, [marketplace, account, activeTab]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const orderCount = await marketplace.methods.orderCounter().call();
      const allOrders = [];

      for (let i = 1; i <= orderCount; i++) {
        const order = await marketplace.methods.getOrder(i).call();
        if (activeTab === 'buyer' && order.buyer.toLowerCase() === account.toLowerCase()) {
          allOrders.push({ id: i, ...order });
        } else if (activeTab === 'seller' && order.seller.toLowerCase() === account.toLowerCase()) {
          allOrders.push({ id: i, ...order });
        }
      }

      setOrders(allOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleDeliverWork = async (orderId) => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    setUploadingOrder(orderId);
    try {
      const ipfsHash = await uploadToIPFS(selectedFile);
      await marketplace.methods.deliverWork(orderId, ipfsHash).send({ from: account });
      alert('Work delivered successfully!');
      setSelectedFile(null);
      loadOrders();
    } catch (error) {
      console.error('Delivery error:', error);
      alert('Failed to deliver work: ' + error.message);
    } finally {
      setUploadingOrder(null);
    }
  };

  const handleApproveOrder = async (orderId) => {
    const rating = prompt('Rate the work (1-5 stars):');
    if (!rating || rating < 1 || rating > 5) {
      alert('Invalid rating');
      return;
    }

    try {
      await marketplace.methods.approveOrder(orderId, rating).send({ from: account });
      alert('Order approved and payment released!');
      loadOrders();
    } catch (error) {
      console.error('Approval error:', error);
      alert('Failed to approve order: ' + error.message);
    }
  };

  const handleRejectOrder = async (orderId) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;

    try {
      await marketplace.methods.rejectOrder(orderId, reason).send({ from: account });
      alert('Order rejected. Dispute opened.');
      loadOrders();
    } catch (error) {
      console.error('Rejection error:', error);
      alert('Failed to reject order: ' + error.message);
    }
  };

  const getStatusLabel = (status) => {
    const statuses = ['Pending', 'Delivered', 'Approved', 'Rejected'];
    return statuses[status] || 'Unknown';
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="my-orders">
      <h1>My Orders</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === 'buyer' ? 'active' : ''} 
          onClick={() => setActiveTab('buyer')}
        >
          As Buyer
        </button>
        <button 
          className={activeTab === 'seller' ? 'active' : ''} 
          onClick={() => setActiveTab('seller')}
        >
          As Seller
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">No orders found</div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>Order #{order.id}</h3>
                <span className={`status status-${order.status}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="order-details">
                <p><strong>Price:</strong> {fromWei(order.price)} DXIO</p>
                <p><strong>Requirements:</strong> {order.requirements}</p>
                {order.deliverable && (
                  <p><strong>IPFS Hash:</strong> {order.deliverable.substring(0, 20)}...</p>
                )}
              </div>

              {activeTab === 'seller' && order.status === '0' && (
                <div className="delivery-section">
                  <FileUpload onFileSelect={handleFileSelect} />
                  {selectedFile && (
                    <button 
                      onClick={() => handleDeliverWork(order.id)}
                      disabled={uploadingOrder === order.id}
                      className="deliver-btn"
                    >
                      {uploadingOrder === order.id ? 'Uploading...' : 'Deliver Work'}
                    </button>
                  )}
                </div>
              )}

              {order.status === '1' && order.deliverable && (
                <FilePreview ipfsHash={order.deliverable} />
              )}

              {activeTab === 'buyer' && order.status === '1' && (
                <div className="buyer-actions">
                  <button onClick={() => handleApproveOrder(order.id)} className="approve-btn">
                    Approve & Release Payment
                  </button>
                  <button onClick={() => handleRejectOrder(order.id)} className="reject-btn">
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
