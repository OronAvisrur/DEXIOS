import React, { useState, useEffect } from 'react';
import './MyOrders.css';
import { fromWei, getOrderStatus } from '../utils/web3';

const MyOrders = ({ marketplace, token, account }) => {
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('buyer');

  useEffect(() => {
    loadOrders();
  }, [marketplace, account]);

  const loadOrders = async () => {
    if (!marketplace || !account) return;

    try {
      const buyerOrderIds = await marketplace.methods.getBuyerOrders(account).call();
      const sellerOrderIds = await marketplace.methods.getSellerOrders(account).call();

      const loadedBuyerOrders = [];
      const loadedSellerOrders = [];

      for (let id of buyerOrderIds) {
        const order = await marketplace.methods.getOrder(id).call();
        loadedBuyerOrders.push(order);
      }

      for (let id of sellerOrderIds) {
        const order = await marketplace.methods.getOrder(id).call();
        loadedSellerOrders.push(order);
      }

      setBuyerOrders(loadedBuyerOrders);
      setSellerOrders(loadedSellerOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const deliverWork = async (orderId) => {
    const ipfsHash = prompt('Enter IPFS hash of delivered files:');
    if (!ipfsHash) return;

    try {
      await marketplace.methods.deliverWork(orderId, ipfsHash).send({ from: account });
      alert('Work delivered successfully!');
      loadOrders();
    } catch (error) {
      console.error('Error delivering work:', error);
      alert('Failed to deliver work');
    }
  };

  const approveOrder = async (orderId) => {
    const rating = prompt('Rate this order (1-5 stars):');
    if (!rating || rating < 1 || rating > 5) return;

    try {
      await marketplace.methods.approveOrder(orderId, rating).send({ from: account });
      alert('Order approved!');
      loadOrders();
    } catch (error) {
      console.error('Error approving order:', error);
      alert('Failed to approve order');
    }
  };

  const rejectOrder = async (orderId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await marketplace.methods.rejectOrder(orderId, reason).send({ from: account });
      alert('Order rejected. Dispute opened.');
      loadOrders();
    } catch (error) {
      console.error('Error rejecting order:', error);
      alert('Failed to reject order');
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  const orders = view === 'buyer' ? buyerOrders : sellerOrders;

  return (
    <div className="my-orders">
      <div className="orders-header">
        <h2>My Orders</h2>
        <div className="view-toggle">
          <button 
            className={view === 'buyer' ? 'active' : ''}
            onClick={() => setView('buyer')}
          >
            As Buyer ({buyerOrders.length})
          </button>
          <button 
            className={view === 'seller' ? 'active' : ''}
            onClick={() => setView('seller')}
          >
            As Seller ({sellerOrders.length})
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="no-orders">No orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>Order #{order.id}</h3>
                <span className={`order-status status-${order.status}`}>
                  {getOrderStatus(order.status)}
                </span>
              </div>
              <p className="order-requirements">{order.requirements}</p>
              <div className="order-details">
                <span>💰 {fromWei(order.paidAmount)} DXIO</span>
                {order.ipfsHash && <span>📁 {order.ipfsHash.substring(0, 20)}...</span>}
              </div>

              {view === 'seller' && order.status === '0' && (
                <button onClick={() => deliverWork(order.id)}>Deliver Work</button>
              )}

              {view === 'buyer' && order.status === '1' && (
                <div className="order-actions">
                  <button onClick={() => approveOrder(order.id)} className="approve">
                    Approve
                  </button>
                  <button onClick={() => rejectOrder(order.id)} className="reject">
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
