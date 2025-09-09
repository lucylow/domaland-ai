# DomainFi - Domain Tokenization Platform

## 🌐 Overview

DomainFi is a cutting-edge domain tokenization and trading platform that transforms traditional domain ownership into liquid digital assets on the blockchain. Built with modern web technologies, DomainFi enables domain fractionalization, secure peer-to-peer trading, and decentralized governance for the domain investment ecosystem.

## ✨ Key Features

- **🔗 Domain Tokenization**: Convert domains into ERC-721 NFTs with blockchain verification
- **📈 Fractional Ownership**: Split high-value domains into tradeable ERC-20 tokens
- **🏪 Decentralized Marketplace**: Peer-to-peer domain trading with escrow functionality
- **💰 Royalty Management**: Automated revenue distribution to fractional owners
- **🎯 Smart Analytics**: Real-time portfolio tracking and market insights
- **🔒 Secure Transactions**: Web3 wallet integration with MetaMask support
- **📱 Modern UI/UX**: Responsive design with shadcn/ui components
- **🌐 Cross-Chain Ready**: Built for multi-blockchain compatibility

## 🏗️ Technology Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible component library
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching

### Web3 Integration
- **Ethers.js** - Ethereum blockchain interaction
- **Web3 Context** - Wallet connection management
- **Smart Contract Integration** - Domain tokenization contracts

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn package manager
- Modern web browser with Web3 wallet (MetaMask recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/domaland.git
   cd domaland
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
npm run dev
```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui component library
│   ├── Dashboard.tsx    # Main dashboard interface
│   ├── DomainTokenization.tsx  # Domain tokenization form
│   ├── EnhancedMarketplace.tsx # Marketplace interface
│   └── ...
├── contexts/            # React context providers
│   ├── Web3Context.tsx  # Web3 wallet management
│   ├── DomaContext.tsx  # Domain data management
│   └── MetricsContext.tsx # Analytics and metrics
├── hooks/               # Custom React hooks
├── pages/               # Route components
│   ├── Landing.tsx      # Marketing landing page
│   ├── Index.tsx        # Main dashboard page
│   └── NotFound.tsx     # 404 error page
├── mockData/            # Development mock data
├── lib/                 # Utility functions
└── main.tsx            # Application entry point
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run build:dev` | Create development build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

## 🎨 UI Components

DomainFi uses a comprehensive component library built on shadcn/ui:

- **Layout**: Cards, Tabs, Accordions, Sidebars
- **Forms**: Inputs, Selects, Checkboxes, Radio Groups
- **Feedback**: Alerts, Toasts, Progress Bars, Skeletons
- **Navigation**: Menus, Breadcrumbs, Pagination
- **Data Display**: Tables, Charts, Badges, Avatars
- **Overlays**: Dialogs, Popovers, Tooltips, Hover Cards

## 🔗 Web3 Integration

### Wallet Connection
- MetaMask integration for Ethereum wallet connection
- Network detection and switching
- Account balance and transaction history

### Smart Contract Interaction
- Domain tokenization (ERC-721)
- Fractional ownership (ERC-20)
- Marketplace transactions
- Governance voting

### Supported Networks
- Ethereum Mainnet
- Polygon
- Arbitrum
- Optimism
- Local development networks

## 📊 Features Overview

### Dashboard
- Portfolio overview with real-time metrics
- Domain tokenization interface
- Transaction history and analytics
- Market trends and insights

### Marketplace
- Browse available domain tokens
- Advanced filtering and search
- Auction and fixed-price listings
- Offer management system

### Domain Management
- Tokenize new domains
- Configure fractional ownership
- Set royalty distribution
- Manage domain metadata

### Analytics
- Portfolio performance tracking
- Market trend analysis
- Revenue distribution reports
- Trading volume statistics

## 🎯 Mock Data System

The application includes a comprehensive mock data system for development:

- **Users**: Sample user profiles and wallet addresses
- **Domains**: Various domain categories and pricing data
- **Transactions**: Complete transaction history
- **Marketplace**: Active listings and auction data
- **Analytics**: Performance metrics and trends

## 🔒 Security Features

- **Input Validation**: Comprehensive form validation with Zod
- **Error Boundaries**: Graceful error handling and recovery
- **Type Safety**: Full TypeScript coverage
- **Secure Web3**: Safe wallet interaction patterns
- **XSS Protection**: Sanitized user inputs

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build the project
npm run build

# Deploy dist/ folder to Netlify
```

### Docker
```bash
# Build Docker image
docker build -t domainfi .

# Run container
docker run -p 3000:3000 domainfi
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful component and variable names
- Add proper error handling
- Include responsive design considerations
- Write clean, readable code

## 📚 Documentation

- [Component Library](https://ui.shadcn.com/) - shadcn/ui documentation
- [React Documentation](https://react.dev/) - Official React docs
- [Ethers.js](https://docs.ethers.io/) - Web3 library documentation
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 🐛 Troubleshooting

### Common Issues

1. **Wallet Connection Issues**
   - Ensure MetaMask is installed and unlocked
   - Check network configuration
   - Verify account permissions

2. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **Development Server Issues**
   - Check if port 5173 is available
   - Restart the development server
   - Clear browser cache

### Getting Help

- Check existing [Issues](https://github.com/your-username/domaland/issues)
- Create a new issue with detailed description
- Join our community discussions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Vite](https://vitejs.dev/) for the fast build tool
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Ethers.js](https://docs.ethers.io/) for Web3 integration
- [React](https://react.dev/) for the amazing UI framework

## 🔮 Roadmap

- [ ] Multi-chain support expansion
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] API integration for real blockchain data
- [ ] Governance token implementation
- [ ] Cross-platform wallet support
- [ ] Advanced trading features
- [ ] Social features and community tools

---

**Built with ❤️ for the decentralized web**

*Transform your domains into liquid digital assets with DomainFi*