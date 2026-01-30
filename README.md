# 🚀 DEXIOS - Decentralized AI Services Marketplace

> **Fiverr meets Blockchain - A fully decentralized marketplace for AI-powered services**

[![Solidity](https://img.shields.io/badge/Solidity-0.8.25-blue)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 📋 Overview

DEXIOS is a **zero-backend blockchain marketplace** connecting AI service providers (sellers) with clients (buyers). Smart contracts handle payments, escrow, and reputation - no central server required.

### ✨ Key Features

- 🎯 **Fully Decentralized** - No backend servers
- 💰 **Smart Escrow** - Secure payments via smart contracts
- 🏆 **NFT Reputation** - Tamper-proof seller profiles
- 📁 **IPFS Storage** - Decentralized file delivery
- ⚡ **Gas Optimized** - Efficient contract design
- 🔒 **Security First** - Audited patterns (CEI, reentrancy guards)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│      React Frontend (Web3)          │
│  - Modern UI components             │
│  - MetaMask integration             │
│  - State management with Hooks      │
└─────────────────────────────────────┘
              ↓ Web3.js
┌─────────────────────────────────────┐
│   Smart Contracts (Solidity 0.8+)   │
│  - DexiosMarketplace.sol            │
│  - DexiosToken.sol (ERC-20)         │
│  - SellerProfileNFT.sol (ERC-721)   │
└─────────────────────────────────────┘
              ↓ IPFS
┌─────────────────────────────────────┐
│         IPFS (Web3.Storage)         │
│  - Deliverable files                │
│  - Gig images/portfolios            │
└─────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Blockchain Layer
- **Solidity** ^0.8.25 - Smart contract language
- **OpenZeppelin** 5.0.2 - Battle-tested contract libraries
- **Truffle Suite** 5.11+ - Development framework
- **Ganache** - Local blockchain for testing

### Frontend Layer
- **React** 18+ - UI library
- **Web3.js** 4.x - Ethereum JavaScript API
- **React Hooks** - State management
- **CSS Modules** - Scoped styling

### Storage Layer
- **IPFS** - Decentralized file storage (Web3.Storage API)

---

## 📦 Project Structure

```
dexios-platform/
├── contracts/                    # Smart contracts
│   ├── DexiosMarketplace.sol    # Core marketplace logic
│   ├── DexiosToken.sol          # ERC-20 payment token
│   ├── SellerProfileNFT.sol     # ERC-721 reputation NFT
│   └── Migrations.sol           # Truffle deployment helper
│
├── migrations/                   # Deployment scripts
│   ├── 1_initial_migration.js
│   └── 2_deploy_contracts.js
│
├── test/                        # Contract tests
│   └── dexios_test.js
│
├── frontend/                    # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/         # UI components
│   │   │   ├── Marketplace/    # Browse gigs
│   │   │   ├── Gig/           # Gig details & creation
│   │   │   ├── Order/         # Order management
│   │   │   └── Profile/       # Seller profiles
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useWeb3.js     # Web3 connection
│   │   │   └── useContracts.js # Contract interactions
│   │   ├── utils/             # Helper functions
│   │   │   ├── ipfs.js        # IPFS utilities
│   │   │   └── web3.js        # Web3 helpers
│   │   ├── contracts/         # Contract ABIs (auto-generated)
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
├── truffle-config.js            # Truffle configuration
├── package.json                 # Root dependencies
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

Ensure you have installed:

```bash
node >= 16.0.0
npm >= 8.0.0
truffle >= 5.11.0
ganache-cli
MetaMask browser extension
```

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/dexios-platform.git
cd dexios-platform

# 2. Install root dependencies
npm install

# 3. Start local blockchain (separate terminal)
ganache-cli --deterministic --accounts 10 --port 7545

# 4. Compile and deploy contracts
truffle compile
truffle migrate --reset

# 5. Install frontend dependencies
cd frontend
npm install

# 6. Start React app
npm start
```

The app will open at `http://localhost:3000`

---

## 📜 Smart Contracts API

### DexiosMarketplace.sol

**Main marketplace logic for gigs and orders**

| Function | Parameters | Returns | Gas Est. | Description |
|----------|-----------|---------|----------|-------------|
| `createGig()` | title, description, aiModel, price, deliveryTime | gigId | ~180k | Create new service listing |
| `placeOrder()` | gigId, requirements | orderId | ~120k | Place order (locks payment) |
| `deliverWork()` | orderId, ipfsHash | - | ~80k | Submit deliverables |
| `approveOrder()` | orderId | - | ~100k | Approve & release payment |
| `rejectOrder()` | orderId, reason | - | ~90k | Reject & open dispute |
| `getGig()` | gigId | Gig struct | Free | View gig details |
| `getOrder()` | orderId | Order struct | Free | View order details |

**Data Structures:**

```solidity
struct Gig {
    uint256 id;
    address seller;
    string title;
    string description;
    string aiModel;           // "GPT-4", "DALL-E 3", etc.
    uint256 priceInTokens;
    uint256 deliveryTimeHours;
    bool isActive;
    uint256 ordersCompleted;
    uint256 totalRating;
    uint256 ratingCount;
}

struct Order {
    uint256 id;
    uint256 gigId;
    address buyer;
    address seller;
    string requirements;
    string ipfsHash;          // Delivered files
    uint256 paidAmount;
    OrderStatus status;
    uint256 createdAt;
}

enum OrderStatus { 
    Pending,    // Order placed, awaiting delivery
    Delivered,  // Work submitted by seller
    Approved,   // Buyer approved, payment released
    Rejected,   // Buyer rejected
    Disputed    // Under dispute resolution
}
```

---

### DexiosToken.sol (ERC-20)

**Platform currency for all transactions**

- **Symbol**: DXIO
- **Decimals**: 18
- **Initial Supply**: 1,000,000 DXIO

| Function | Access | Description | Gas Est. |
|----------|--------|-------------|----------|
| `mint()` | Owner | Create new tokens | ~50k |
| `transfer()` | Public | Send tokens | ~21k |
| `approve()` | Public | Allow spending | ~45k |
| `balanceOf()` | View | Check balance | Free |

---

### SellerProfileNFT.sol (ERC-721)

**Unique NFT for each seller representing reputation**

Each seller must mint a profile NFT (10 DXIO cost) to create gigs.

```solidity
struct SellerProfile {
    address owner;
    uint256 totalJobs;
    uint256 successfulJobs;
    uint256 totalEarned;
    uint256 averageRating;     // 1-5 stars
    string[] specialties;
    uint256 joinedAt;
}
```

| Function | Access | Description | Gas Est. |
|----------|--------|-------------|----------|
| `mintProfile()` | Public | Create seller profile (one-time) | ~200k |
| `updateReputation()` | Contract | Update stats after order | ~60k |
| `getProfile()` | View | Retrieve profile data | Free |

**Why NFT?**
- Portable reputation across platforms
- Cannot be deleted or censored
- Transferable (seller can sell their reputation)

---

## 🔄 User Flows

### Flow 1: Seller Creates Gig

```
1. Connect MetaMask
2. Mint Profile NFT (if first time) → Pay 10 DXIO
3. Click "Create Gig"
4. Fill form:
   - Title: "AI Logo Design with DALL-E 3"
   - Description: "Professional logos in any style"
   - AI Model: "DALL-E 3"
   - Price: 50 DXIO
   - Delivery: 24 hours
5. Call createGig() → Transaction sent
6. Gig appears in marketplace
```

---

### Flow 2: Buyer Orders Service

```
1. Browse marketplace
2. Select gig
3. Enter requirements
4. Approve DXIO spending: token.approve(marketplace, 50)
5. Call placeOrder() → 50 DXIO locked in escrow
6. Order status: Pending
```

---

### Flow 3: Seller Delivers Work

```
1. View pending orders
2. Create deliverables using AI tools
3. Upload files to IPFS → Get hash "QmX7Y8Z..."
4. Call deliverWork(orderId, "QmX7Y8Z...")
5. Order status: Delivered
```

---

### Flow 4: Buyer Reviews & Approves

```
1. Download files from IPFS
2. Review quality
3a. Satisfied → approveOrder()
    - 50 DXIO released to seller
    - Reputation updated
    - Status: Approved
3b. Not satisfied → rejectOrder()
    - Status: Disputed
    - Admin resolution required
```

---

## 🧪 Testing

### Run Smart Contract Tests

```bash
# All tests
truffle test

# Specific test file
truffle test test/dexios_test.js

# With gas reporting
truffle test --show-events
```

### Test Coverage

```bash
npm run coverage
```

Expected output:
```
Contract: DexiosMarketplace
  ✓ should create gig successfully
  ✓ should place order with sufficient tokens
  ✓ should reject order with insufficient tokens
  ✓ should deliver work and update status
  ✓ should approve order and release payment
  ✓ should handle reputation updates

15 passing (3.2s)
```

---

## 🔐 Security Features

### Implemented Protections

✅ **Checks-Effects-Interactions** - Prevent reentrancy
✅ **Access Control** - Role-based permissions
✅ **Integer Overflow** - Solidity 0.8+ built-in protection
✅ **Input Validation** - Sanitize all parameters
✅ **Escrow Pattern** - Secure payment handling
✅ **Custom Errors** - Gas-efficient error handling

### Security Audit Checklist

- [ ] External security audit
- [ ] Formal verification
- [ ] Bug bounty program
- [ ] Multi-sig admin controls
- [ ] Emergency pause mechanism

---

## 📊 Token Economics

### DXIO Token Distribution

- **Initial Supply**: 1,000,000 DXIO
- **Platform Fee**: 2.5% per transaction
- **Profile Minting**: 10 DXIO (one-time)

### Reward Structure

- Sellers earn DXIO per completed order
- Buyers purchase services with DXIO
- Platform collects 2.5% fee

---

## 🎯 Roadmap

### Phase 1: MVP (Current)
- [x] Core smart contracts
- [x] Basic React UI
- [ ] IPFS integration
- [ ] MetaMask connection
- [ ] Gig creation/browsing
- [ ] Order placement

### Phase 2: Enhancement
- [ ] Advanced search/filters
- [ ] Messaging system
- [ ] Dispute resolution
- [ ] Multiple deliveries
- [ ] Tiered service packages

### Phase 3: Scaling
- [ ] Layer 2 deployment
- [ ] Mobile app
- [ ] API for third-party integrations
- [ ] Governance token

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Coding Standards

- Follow Solidity style guide
- Write comprehensive tests
- Add inline comments
- Optimize for gas efficiency
- Use custom errors over require strings

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🔗 Resources

- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [React Documentation](https://react.dev/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [IPFS Documentation](https://docs.ipfs.tech/)

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/dexios-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/dexios-platform/discussions)
- **Email**: support@dexios.io

---

**Built with ❤️ for the decentralized future**