import React, { useState, useEffect } from 'react';
import { useContracts } from '../hooks/useContracts';
import { useWeb3 } from '../hooks/useWeb3';
import { fromWei } from '../utils/web3';
import Loading from './Loading';
import './BuyerDashboard.css';

const BuyerDashboard = ({ showToast }) => {
  const { account } = useWeb3();
  const { marketplace, token } = useContracts();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState({
    tokenBalance: '0',
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalSpent: '0'
  });

  useEffect(() => {
    if (marketplace && token && account) {
      loadDashboard();
    }
  }, [marketplace, token, account]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const balance = await token.methods.balanceOf(account).call();
      
      let totalOrders = 0;
      let completedOrders = 0;
      let pendingOrders = 0;
      let totalSpent = BigInt(0);

      const orderCount = await marketplace.methods.orderCounter().call();
      for (let i = 1; i <= orderCount; i++) {
        const order = await marketplace.methods.getOrder(i).call();
        if (order.buyer.toLowerCase() === account.toLowerCase()) {
          totalOrders++;
          totalSpent += BigInt(order.price);
          
          if (order.status === '2') {
            completedOrders++;
          } else if (order.status === '0' || order.status === '1') {
            pendingOrders++;
          }
        }
      }

      setDashboard({
        tokenBalance: fromWei(balance),
        totalOrders,
        completedOrders,
        pendingOrders,
        totalSpent: fromWei(totalSpent.toString())
      });

      showToast('Dashboard loaded successfully', 'success');
    } catch (error) {
      console.error('Error loading dashboard:', error);
      showToast('Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading dashboard..." />;

  return (
    <div className="buyer-dashboard">
      <h1>Buyer Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card balance">
          <div className="stat-icon">💎</div>
          <div className="stat-content">
            <h3>Token Balance</h3>
            <p className="stat-value">{dashboard.tokenBalance} DXIO</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-value">{dashboard.totalOrders}</p>
            <p className="stat-subtitle">{dashboard.completedOrders} completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Orders</h3>
            <p className="stat-value">{dashboard.pendingOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <h3>Total Spent</h3>
            <p className="stat-value">{dashboard.totalSpent} DXIO</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
