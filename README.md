# 🚀 DEXIOS - Decentralized AI Services Marketplace

![Solidity](https://img.shields.io/badge/Solidity-0.8.25-blue?style=flat-square&logo=solidity)
![React](https://img.shields.io/badge/React-18+-61dafb?style=flat-square&logo=react)
![Web3](https://img.shields.io/badge/Web3.js-4.x-orange?style=flat-square&logo=web3.js)
![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-5.0.2-purple?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Tests](https://img.shields.io/badge/tests-15%20passed-brightgreen?style=flat-square&logo=truffle)
![Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)
![Maintained](https://img.shields.io/badge/maintained-yes-green?style=flat-square)

**Fiverr meets Blockchain** - A fully decentralized marketplace connecting AI service providers with clients using smart contracts for payments, escrow, and reputation.

---

## 🎯 Project Purpose

DEXIOS eliminates intermediaries in freelance marketplaces by leveraging blockchain technology. Service providers create gigs, buyers place orders with crypto payments locked in smart contract escrow, and deliverables are stored on IPFS. The platform features tamper-proof NFT-based reputation systems, ensuring trust without centralized control.

**Key Innovation:** Zero backend servers - everything runs on Ethereum/Polygon + IPFS.

---

## ✨ Features

### Core Functionality
- 🎯 **Fully Decentralized** - No backend servers or central database
- 💰 **Smart Escrow** - Secure payments via Solidity contracts
- 🏆 **NFT Reputation** - Portable, tamper-proof seller profiles (ERC-721)
- 📁 **IPFS Storage** - Decentralized file delivery
- ⚡ **Gas Optimized** - Custom errors, efficient storage patterns
- 🔒 **Security First** - CEI pattern, reentrancy guards, OpenZeppelin libraries

### Search & Discovery
- 🔍 **Keyword Search** - Search gigs by title, description, or AI model
- 🎚️ **Advanced Filters** - Filter by price range, delivery time, AI model
- 📊 **Smart Sorting** - Sort by newest, price (low/high), fastest delivery
- ⚡ **Real-time Updates** - Instant filter and search results

### User Experience
- 🎨 **Modern UI** - 2026 glassmorphism design with React 18
- 📤 **File Upload** - Drag & drop support for deliverables
- 🔔 **Toast Notifications** - Real-time feedback for all actions
- ⚙️ **Form Validation** - Client-side validation with sanitization
- 🛡️ **Error Boundaries** - Graceful error handling and recovery
- ⏳ **Loading States** - Animated spinners during transactions

### Analytics Dashboards
- 📈 **Seller Analytics** - Track earnings, gigs, orders, and performance
- 💎 **Buyer Dashboard** - Monitor spending, orders, and token balance
- 📊 **Real-time Stats** - Live updates from blockchain

---

## 🏗️ Architecture Overview
```
┌─────────────────────────────────────┐
│      React Frontend (Web3)          │
│  - MetaMask Integration             │
│  - Real-time Contract Updates       │
│  - IPFS File Handling               │
│  - Search & Filter Engine           │
│  - Toast Notifications              │
└─────────────────────────────────────┘
              ↓ Web3.js
┌─────────────────────────────────────┐
│   Smart Contracts (Solidity 0.8.25) │
│  - DexiosMarketplace.sol            │
│  - DexiosToken.sol (ERC-20)         │
│  - SellerProfileNFT.sol (ERC-721)   │
└─────────────────────────────────────┘
              ↓ Events
┌─────────────────────────────────────┐
│         IPFS (Infura Gateway)       │
│  - Deliverable Files                │
│  - Gig Images/Portfolios            │
└─────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Blockchain Layer
- **Solidity** 0.8.25 - Smart contract language
- **OpenZeppelin** 5.0.2 - Security-audited contract libraries
- **Truffle** 5.11+ - Development framework
- **Ganache** - Local blockchain testing

### Frontend Layer
- **React** 18+ - Modern UI library
- **React Router** 6.22.0 - Client-side routing
- **Web3.js** 4.x - Ethereum JavaScript API
- **Custom Hooks** - useWeb3, useContracts, useToast
- **Glassmorphism CSS** - 2026 design trends

### Storage Layer
- **IPFS** - Decentralized content addressing via Infura gateway

---

## 📦 Project Structure
```
DEXIOS/
├── contracts/                          # Solidity smart contracts
│   ├── DexiosMarketplace.sol          # Core marketplace logic
│   ├── DexiosToken.sol                # ERC-20 payment token
│   ├── SellerProfileNFT.sol           # ERC-721 reputation NFT
│   └── Migrations.sol                 # Deployment helper
│
├── migrations/                         # Truffle deployment scripts
│   ├── 1_initial_migration.js
│   └── 2_deploy_contracts.js
│
├── test/                              # Smart contract tests
│   └── dexios_test.js                # 15 comprehensive tests
│
├── frontend/                          # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/               # UI components
│   │   │   ├── Navbar.js            # Navigation with wallet
│   │   │   ├── Home.js              # Landing page
│   │   │   ├── Marketplace.js       # Browse & search gigs
│   │   │   ├── SearchBar.js         # Keyword search
│   │   │   ├── Filters.js           # Advanced filters
│   │   │   ├── CreateGig.js         # Seller creates gigs
│   │   │   ├── MyGigs.js            # Seller dashboard
│   │   │   ├── MyOrders.js          # Buyer/seller order tracking
│   │   │   ├── Analytics.js         # Seller analytics
│   │   │   ├── BuyerDashboard.js    # Buyer dashboard
│   │   │   ├── FileUpload.js        # Drag & drop component
│   │   │   ├── FilePreview.js       # File preview & download
│   │   │   ├── Loading.js           # Loading spinner
│   │   │   ├── Toast.js             # Notification component
│   │   │   ├── ToastContainer.js    # Toast wrapper
│   │   │   ├── ErrorBoundary.js     # Error recovery
│   │   │   └── [CSS files]          # Component styles
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useWeb3.js          # MetaMask connection
│   │   │   ├── useContracts.js     # Contract initialization
│   │   │   └── useToast.js         # Toast notifications
│   │   ├── utils/                   # Helper functions
│   │   │   ├── web3.js             # Web3 utilities (toWei, fromWei)
│   │   │   ├── ipfs.js             # IPFS upload/download
│   │   │   └── validation.js       # Form validation & sanitization
│   │   ├── contracts/               # Contract ABIs (auto-generated)
│   │   ├── App.js                   # Main app with routing
│   │   ├── App.css
│   │   ├── index.js                 # React entry point
│   │   └── index.css                # Global styles
│   └── package.json
│
├── truffle-config.js                  # Truffle configuration
├── package.json                       # Root dependencies
├── README.md                          # This file
├── PROJECT_CONTEXT.md                 # Development context
├── PROJECT_PROGRESS.md                # Progress tracker
└── .gitignore
```

---

## 🚀 Quick Start Guide

### Prerequisites Verification

Ensure the following are installed:
```bash
node --version    # Should be >= 16.0.0
npm --version     # Should be >= 8.0.0
truffle version   # Should be >= 5.11.0
```

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/dexios-platform.git
cd DEXIOS
```

### Step 2: Install Dependencies
```bash
npm install
cd frontend
npm install
cd ..
```

### Step 3: Start Local Blockchain

**Terminal 1:**
```bash
ganache-cli --deterministic --port 7545
```

Keep this terminal running. You should see:
```
Available Accounts
(0) 0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1 (1000 ETH)
(1) 0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0 (1000 ETH)
...
```

### Step 4: Deploy Smart Contracts

**Terminal 2:**
```bash
cd ~/DEXIOS
truffle compile
truffle migrate --reset
```

Expected output:
```
DexiosToken deployed at: 0xCfEB...
SellerProfileNFT deployed at: 0x254d...
DexiosMarketplace deployed at: 0xC89C...
```

### Step 5: Copy Contract ABIs
```bash
cp build/contracts/*.json frontend/src/contracts/
```

### Step 6: Configure MetaMask

1. Open MetaMask extension
2. **Add Network Manually:**
   - Network Name: `Ganache Local`
   - RPC URL: `http://127.0.0.1:7545`
   - Chain ID: `1337`
   - Currency: `ETH`

3. **Import Test Account:**
   - Click "Import Account"
   - Paste private key from Ganache terminal:
```
     0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
```
   - You should see ~999 ETH

### Step 7: Start Frontend

**Terminal 3:**
```bash
cd frontend
npm start
```

Application opens at: **http://localhost:3000**

---

## 🧪 Testing and Validation

### Run Smart Contract Tests
```bash
truffle test
```

**Expected Results:**
```
Contract: DEXIOS Platform Tests
  DexiosToken
    ✓ should deploy with correct initial supply
    ✓ should allow owner to mint tokens
    ✓ should allow token transfers
  SellerProfileNFT
    ✓ should mint seller profile
    ✓ should track seller reputation
  DexiosMarketplace - Gig Creation
    ✓ should create gig successfully
    ✓ should fail without seller profile
  DexiosMarketplace - Order Flow
    ✓ should place order successfully
    ✓ should deliver work
    ✓ should approve order and release payment
    ✓ should reject order
  DexiosMarketplace - Admin Functions
    ✓ should set platform fee
    ✓ should resolve dispute in favor of seller

15 passing (3.2s)
```

---

## 📜 Smart Contract API Reference

### DexiosMarketplace.sol

| Function | Parameters | Gas Est. | Description |
|----------|-----------|----------|-------------|
| `createGig()` | title, description, aiModel, price, deliveryTime | ~180k | Create service listing |
| `placeOrder()` | gigId, requirements | ~120k | Place order (locks payment) |
| `deliverWork()` | orderId, ipfsHash | ~80k | Submit deliverables |
| `approveOrder()` | orderId, rating | ~100k | Approve & release payment |
| `rejectOrder()` | orderId, reason | ~90k | Reject & open dispute |
| `getGig()` | gigId | Free | View gig details |
| `getOrder()` | orderId | Free | View order details |

### DexiosToken.sol (ERC-20)

- **Symbol:** DXIO
- **Decimals:** 18
- **Initial Supply:** 1,000,000 DXIO

### SellerProfileNFT.sol (ERC-721)

Each seller mints a unique profile NFT storing:
- Total jobs completed
- Success rate
- Total earnings
- Average rating (1-5 stars)
- Specialties array

---

## 🎯 User Workflows

### Workflow 1: Seller Creates Gig
```
1. Connect MetaMask → Account detected
2. Navigate to "Create Gig"
3. Fill form (validated in real-time):
   - Title: "AI Logo Design with DALL-E 3"
   - Description: "Professional logos in any style"
   - AI Model: "DALL-E 3"
   - Price: 50 DXIO
   - Delivery: 24 hours
4. Submit → Profile NFT auto-minted if first gig
5. Transaction confirmed → Gig live in marketplace
6. Toast notification: "Gig created successfully!"
```

### Workflow 2: Buyer Orders Service
```
1. Browse "Marketplace"
2. Use SearchBar to find "logo design"
3. Apply filters: Price 0-100 DXIO, Delivery < 48h
4. Sort by "Cheapest"
5. Select gig → Click "Order Now"
6. Enter requirements (validated, min 10 chars)
7. Approve 50 DXIO spending → Confirm
8. Place order → 50 DXIO locked in escrow
9. Toast notification: "Order placed successfully!"
```

### Workflow 3: Complete Order Cycle
```
Seller:
1. View "My Orders" → "As Seller" tab
2. See pending order
3. Create deliverables using AI tools
4. Drag & drop file to FileUpload component
5. Click "Deliver Work" → Upload to IPFS
6. Submit delivery with IPFS hash
7. Toast: "Work delivered successfully!"

Buyer:
8. View "My Orders" → "As Buyer" tab
9. See delivered order
10. Click file to preview or download
11. Review quality
12. Click "Approve & Release Payment"
13. Rate 1-5 stars (validated)
14. Smart contract releases payment (47.5 DXIO to seller, 2.5 DXIO fee)
15. Seller reputation NFT updates automatically
16. Toast: "Order approved and payment released!"
```

### Workflow 4: View Analytics
```
Seller:
1. Navigate to "Analytics"
2. View dashboard:
   - Total Earnings: 237.5 DXIO
   - Total Gigs: 5 (3 active)
   - Total Orders: 12 (10 completed)
   - Pending Orders: 2

Buyer:
1. Navigate to "Dashboard"
2. View statistics:
   - Token Balance: 450 DXIO
   - Total Orders: 8 (7 completed)
   - Pending Orders: 1
   - Total Spent: 350 DXIO
```

---

## 🔐 Security Features

### Implemented Protections

✅ **Checks-Effects-Interactions** - Prevents reentrancy attacks  
✅ **ReentrancyGuard** - OpenZeppelin protection on critical functions  
✅ **Access Control** - Ownable pattern for admin functions  
✅ **Integer Overflow** - Solidity 0.8+ built-in SafeMath  
✅ **Input Validation** - Client-side validation before transactions  
✅ **Input Sanitization** - XSS prevention on all user inputs  
✅ **Custom Errors** - Gas-efficient error handling  
✅ **File Validation** - Size and type checks before IPFS upload  

### Security Audit Checklist

- [ ] External security audit (Planned)
- [ ] Bug bounty program
- [ ] Formal verification
- [ ] Multi-sig wallet for admin

---

## 📊 Token Economics

### DXIO Distribution

- **Total Supply:** 1,000,000 DXIO (fixed)
- **Platform Fee:** 2.5% per transaction
- **Profile Minting:** Free (gas only)

### Fee Structure

| Action | Fee | Recipient |
|--------|-----|-----------|
| Order Completion | 2.5% | Platform |
| Gig Creation | Gas only | Network |
| Profile Minting | Gas only | Network |

---

## 🎨 Design System

### Color Palette

- **Background:** `#0a0a0f` (Near black)
- **Primary:** `#667eea` → `#764ba2` (Purple gradient)
- **Accent:** `#8b5cf6` (Vibrant purple)
- **Text:** `#ffffff` (White)
- **Surface:** `rgba(255, 255, 255, 0.05)` (Glassmorphism)

### Typography

- **Font:** Inter (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700, 800

---

## 🔧 Troubleshooting

### Issue: "Contracts not deployed on this network"

**Solution:**
```bash
# Ensure Ganache is running on port 7545
# Re-deploy contracts
truffle migrate --reset
# Copy ABIs
cp build/contracts/*.json frontend/src/contracts/
```

### Issue: MetaMask shows 0 ETH

**Solution:**
- Verify you're on "Ganache Local" network (Chain ID 1337)
- Import correct account using private key from Ganache terminal
- Check Ganache is still running

### Issue: npm start fails with module errors

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: IPFS upload fails

**Solution:**
- Check Infura project credentials in `frontend/src/utils/ipfs.js`
- Verify file size is under 50MB
- Ensure stable internet connection

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Write tests for new functionality
4. Ensure all tests pass: `truffle test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open Pull Request

### Coding Standards

- Follow Solidity style guide
- Use OpenZeppelin contracts where possible
- Write comprehensive inline comments
- Optimize for gas efficiency
- Include unit tests for all functions
- No comments in code - code must be self-explanatory

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🔗 Resources

- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [React Documentation](https://react.dev/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [Truffle Suite](https://trufflesuite.com/docs/)
- [IPFS Documentation](https://docs.ipfs.tech/)

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/dexios-platform/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/dexios-platform/discussions)

---

## 📈 Project Statistics

- **Total Files:** 60+
- **Smart Contracts:** 4 (fully tested)
- **Frontend Components:** 19
- **Custom Hooks:** 3
- **Utility Functions:** 3
- **Tests:** 15 (all passing)
- **Lines of Code:** ~4,500
- **Development Time:** ~40 hours
- **Features Completed:** 75%

---

**Built with ❤️ for the decentralized future**

*DEXIOS - Where AI meets Blockchain*
