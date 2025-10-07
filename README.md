# Index Stream

**The fastest, simplest way to stream your personal media collection. No subscriptions, no tracking, no limits.**

[![License: MPL-2.0](https://img.shields.io/badge/License-MPL--2.0-red.svg)](https://opensource.org/licenses/MPL-2.0) [![Discord](https://img.shields.io/badge/Discord-Join%20Community-blue.svg)](https://discord.gg/WamXjEhcaa)

## What is Index Stream?

Index Stream is a **privacy-first, open-source media streaming platform** designed for people who want complete control over their personal media without the complexity and overhead of traditional solutions.

### Why Index Stream vs Plex/Jellyfin/Emby?

**Index Stream is built for simplicity and speed.** While Plex, Jellyfin, and Emby are powerful, they often require extensive configuration, consume significant resources, and can be overwhelming for users who just want to stream their media quickly and securely.

We focus on three core principles:

- 🚀 **Ease of Use** - Simple configurations with a modern UI
- 🔒 **Privacy First** - No tracking, no cloud dependencies for local connections, no signups necessary 
- 💰 **Truly Free** - No subscriptions, no premium tiers, no hidden costs

**The Result:** Minutes to setup instead of hours and giving you complete peace of mind about your privacy.

## Repository Structure

This repository contains the **frontend streaming interface** for Index Stream. 

- **Frontend (this repo)**: Web-based streaming interface and landing page
- **Media Server**: [index-media-server](https://github.com/index-stream/index-media-server) - The Tauri desktop application that serves your media

## Developer Quick Start

### Prerequisites
- Node.js 23+ 
- npm

### Starting the local webserver

```bash
# Clone the repository
git clone https://github.com/index-stream/indexstream.org.git
cd indexstream.org

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:8000`

## Project Status

🚧 **Currently in Alpha** - Expect breaking changes and rapid iteration.

We're actively developing core features and refining the user experience.

**Frontend Roadmap:**
- ✅ Local access to media server
- ✅ Profile and index selection
- 📋 Video streaming interface
- 📋 Music streaming interface
- 📋 Photo viewing interface
- 📋 Remote access

## Community

💬 **Join our community on Discord** to discuss, ask questions, and contribute.

[![Discord](https://img.shields.io/badge/Discord-Join%20Community-blue.svg)](https://discord.gg/WamXjEhcaa)

We're building Index Stream with the community in mind. Whether you're a developer looking to contribute, a user with feedback, or someone interested in privacy-first media streaming, we'd love to have you join the conversation.

## Contributing

We welcome contributions! Whether you're fixing bugs, adding features, or improving documentation, your help makes Index Stream better for everyone.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the Mozilla Public License 2.0 - see the [LICENSE](LICENSE) file for details.

*Built with ❤️ for the privacy-conscious media streaming community.*