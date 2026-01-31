import React, { useState, useEffect } from 'react';
import { useContracts } from '../hooks/useContracts';
import { useWeb3 } from '../hooks/useWeb3';
import { fromWei } from '../utils/web3';
import Loading from './Loading';
import './Analytics.css';

const Analytics = ({ showToast }) => {
  const { account } = useWeb3();
  const { marketplace, sellerNFT } = useContracts();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalEarnings: '0',
    totalGigs: 0,
    activeGigs: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    if (marketplace && sellerNFT && account) {
      loadAnalytics();
    }
  }, [marketplace, sellerNFT, account]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const hasProfile = await sellerNFT.methods.balanceOf(account).call();
      
      if (hasProfile === '0') {
        showToast('No seller profile found', 'info');
        setLoading(false);
        return;
      }

      let totalEarnings = BigInt(0);
      let totalGigs = 0;
      let activeGigs = 0;
      let totalOrders = 0;
      let completedOrders = 0;
      let pendingOrders = 0;

      const gigCount = await marketplace.methods.gigCounter().call();
      for (let i = 1; i <= gigCount; i++) {
        const gig = await marketplace.methods.getGig(i).call();
        if (gig.seller.toLowerCase() === account.toLowerCase()) {
          totalGigs++;
          if (gig.isActive) activeGigs++;
        }
      }

      const orderCount = await marketplace.methods.orderCounter().call();
      for (let i = 1; i <= orderCount; i++) {
        const order = await marketplace.methods.getOrder(i).call();
        if (order.seller.toLowerCase() === account.toLowerCase()) {
          totalOrders++;
          
          if (order.status === '2') {
            completedOrders++;
            const fee = BigInt(order.price) * BigInt(25) / BigInt(1000);
            const earnings = BigInt(order.price) - fee;
            totalEarnings += earnings;
          } else if (order.status === '0' || order.status === '1') {
            pendingOrders++;
          }
        }
      }

      setAnalytics({
        totalEarnings: fromWei(totalEarnings.toString()),
        totalGigs,
        activeGigs,
        totalOrders,
        completedOrders,
        pendingOrders
      });

      showToast('Analytics loaded successfully', 'success');
    } catch (error) {
      console.error('Error loading analytics:', error);
      showToast('Failed to load analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading analytics..." />;

  return (
    <div className="analytics">
      <h1>Seller Analytics</h1>

      <div className="stats-grid">
        <div className="stat-card earnings">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Earnings</h3>
            <p className="stat-value">{analytics.totalEarnings} DXIO</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Gigs</h3>
            <p className="stat-value">{analytics.totalGigs}</p>
            <p className="stat-subtitle">{analytics.activeGigs} active</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-value">{analytics.totalOrders}</p>
            <p className="stat-subtitle">{analytics.completedOrders} completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Orders</h3>
            <p className="stat-value">{analytics.pendingOrders}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
