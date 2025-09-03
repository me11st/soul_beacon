# Soul Beacon 🌟

An AI-driven resonance matching platform that connects souls through meaningful interactions on the Algorand blockchain.

## ✨ Core Concept

Soul Beacon creates ephemeral, glowing ASA tokens that represent "asks" or beacon signals from users seeking meaningful connections. AI analyzes user "soul shadows" (resonance data) to find matches, unlocking chats and activating tokens only when mutual connection is confirmed.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 with TypeScript, TailwindCSS, Framer Motion
- **Backend**: Node.js with Express, Socket.io for real-time chat
- **Blockchain**: Algorand with AlgoKit, ASA token creation
- **Auth**: Auth0 with OpenAI credential integration
- **Wallet**: Pera, MyAlgo, WalletConnect support
- **AI/ML**: OpenAI GPT for resonance matching

### Project Structure
```
c_soul/
├── frontend/          # Next.js React app
├── backend/           # Express.js API server  
├── smart-contracts/   # Algorand smart contracts (AlgoKit)
├── shared/           # Shared types and utilities
└── docs/             # Documentation
```

## 🔥 Key Features

### 1. Identity & Authentication
- Auth0 integration with OpenAI credential support
- "Soul Shadow" profile creation for resonance data
- Algorand wallet connection (Pera/MyAlgo/WalletConnect)

### 2. Soul Beacon Flow
- User creates an "ask" → ASA token minted (inactive)
- AI evaluates resonance data for matching
- Match found → Chat unlocks, ASAs activate
- Mutual consent required for token distribution

### 3. Token Economics
- **Match Found**: 0.5 to each user, 0.5 to protocol
- **No Match (6 months)**: 0.7 back to user, 0.3 to protocol
- Configurable expiry periods based on network growth

### 4. Real-time Features
- Live chat interface for matched users
- Shimmer/glow effects for activated tokens
- Real-time resonance updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+ (for AlgoKit)
- Algorand Sandbox or TestNet access

### Setup
```bash
# Install dependencies
npm run setup

# Start development servers
npm run dev

# Deploy smart contracts
npm run deploy:contracts
```

### Environment Setup
```bash
# Copy environment templates
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# Configure your:
# - Auth0 credentials
# - OpenAI API keys  
# - Algorand network settings
# - Database connections
```

## 🎯 Development Roadmap

### Phase 1: Foundation (Hackathon)
- [x] Project structure setup
- [ ] Auth0 + OpenAI integration
- [ ] Algorand wallet connection
- [ ] Basic ASA minting
- [ ] Simple matching algorithm

### Phase 2: Core Features  
- [ ] Advanced AI resonance matching
- [ ] Real-time chat implementation
- [ ] Token lifecycle management
- [ ] UI/UX with animations

### Phase 3: Polish
- [ ] Performance optimization
- [ ] Advanced matching algorithms
- [ ] Mobile responsiveness
- [ ] Security audits

## 🔧 Development

Each workspace has its own README with specific setup instructions:
- [`frontend/README.md`](./frontend/README.md) - Next.js app setup
- [`backend/README.md`](./backend/README.md) - Express server setup  
- [`smart-contracts/README.md`](./smart-contracts/README.md) - AlgoKit setup
- [`shared/README.md`](./shared/README.md) - Shared utilities

## 🤝 Contributing

This is a hackathon project built with love and caffeine //and some wine// ☕. Feel free to contribute ideas, code, or soul energy! 

## 📜 License

MIT - Built for the souls, by a soul and two others 💫
