# Production-Ready WebRTC Video Chat Application

A multi-peer video chat application built with **WebRTC**, **Next.js**, **TypeScript**, and **Socket.IO**. This application enables real-time peer-to-peer communication with support for up to 4 participants in a mesh topology, along with integrated text messaging.

## Features

- ✅ **Multi-peer Video Chat** - Support for up to 4 concurrent participants
- ✅ **Mesh Topology** - Each user connects directly to every other user
- ✅ **Real-time Text Chat** - Send messages to all participants instantly
- ✅ **Media Controls** - Mute microphone and toggle camera on/off
- ✅ **Status Indicators** - Display connection status (waiting, connecting, connected)
- ✅ **Responsive UI** - Dynamic grid layout using Tailwind CSS
- ✅ **Picture-in-Picture** - Local video in corner when in a multi-peer call
- ✅ **Graceful Disconnection** - Automatic cleanup when peers leave
- ✅ **Fully Containerized** - Docker and Docker Compose ready
- ✅ **WebSocket Signaling** - Custom Socket.IO signaling server

## Architecture

### Components

- **Server**: Custom WebSocket signaling server built with Socket.IO
- **Client**: Next.js frontend with React hooks for WebRTC management
- **Signaling Flow**: Implements WebRTC offer/answer model with ICE candidates
- **UI**: Tailwind CSS for responsive design with real-time controls

### Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Node.js with Socket.IO for WebSocket signaling
- **Real-time Communication**: WebRTC for P2P connections
- **Styling**: Tailwind CSS 4
- **Containerization**: Docker & Docker Compose
- **Icons**: Lucide React

## Project Structure

```
app/
├── page.tsx                    # Home page (room creation/joining)
├── room/
│   └── [roomId]/
│       └── page.tsx            # Room page with video chat
├── hooks/
│   ├── useSocket.ts            # Socket.IO connection hook
│   ├── useWebRTC.ts            # WebRTC peer connection hook
│   └── useChat.ts              # Text chat hook
├── components/
│   ├── VideoContainer.tsx      # Single video display component
│   ├── VideoGrid.tsx           # Multi-video grid layout
│   ├── CallControls.tsx        # Mute, camera, hangup buttons
│   ├── StatusIndicator.tsx     # Connection status display
│   └── ChatPanel.tsx           # Text messaging interface
├── globals.css                 # Global styles
└── layout.tsx                  # Root layout

server.ts                        # Custom WebSocket signaling server
Dockerfile                       # Docker image configuration
docker-compose.yml              # Docker Compose orchestration
.env.example                     # Environment variables template
package.json                     # Dependencies
tsconfig.json                    # TypeScript configuration
```

## Installation

### Prerequisites

- Node.js 18+ or Docker
- npm or yarn package manager
- Modern web browser with WebRTC support

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd -Production-Ready-WebRTC-Video-Chat-Application
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Open `http://localhost:3000` in your browser

3. **Stop the application**
   ```bash
   docker-compose down
   ```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Server Configuration
PORT=3000

# WebRTC STUN Server (for NAT/Firewall traversal)
NEXT_PUBLIC_STUN_SERVER=stun:stun.l.google.com:19302

# Node Environment
NODE_ENV=production
```

## Usage Guide

### Creating a Room

1. Visit the home page at `http://localhost:3000`
2. Click **"Create New Room"** to generate a unique room ID
3. You'll be redirected to the room page

### Joining a Room

1. Share the room ID with other participants
2. They can visit the home page and paste the room ID in the input field
3. Click **"Join Room"** to connect

### During a Call

- **Camera Toggle**: Click the camera icon to turn your video on/off
- **Mute Microphone**: Click the microphone icon to mute/unmute
- **Send Messages**: Type messages in the chat panel and hit Send
- **Hang Up**: Click the phone icon to end the call and disconnect

### Viewing Participants

- **Waiting**: When alone in a room, you'll see "Waiting for participants..."
- **Connecting**: Status changes to "Connecting..." when peers join
- **Connected**: Shows "Connected" when at least one peer is connected
- **Multi-view**: All participant videos display in a responsive grid
- **Picture-in-Picture**: Your local video appears in the bottom-right corner when multiple peers are present

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns: `{ status: 'healthy' }`
- Used by Docker healthcheck

## WebSocket Events

### Client → Server

- `join-room`: Notify server that user is joining a room
  ```json
  { "roomId": "uuid-string" }
  ```

- `offer`: Send WebRTC offer to a peer
  ```json
  { "to": "peer-id", "offer": {...} }
  ```

- `answer`: Send WebRTC answer to a peer
  ```json
  { "to": "peer-id", "answer": {...} }
  ```

- `ice-candidate`: Send ICE candidate to a peer
  ```json
  { "to": "peer-id", "candidate": {...} }
  ```

- `chat-message`: Send text message to all peers in room
  ```json
  { "roomId": "uuid-string", "message": "text", "sender": "socket-id" }
  ```

### Server → Client

- `peers`: List of existing peers in the room
  ```json
  { "peers": ["peer-id-1", "peer-id-2"] }
  ```

- `user-joined`: Notification that a new user joined
  ```json
  { "userId": "peer-id" }
  ```

- `offer`: Receive WebRTC offer from a peer
  ```json
  { "from": "peer-id", "offer": {...} }
  ```

- `answer`: Receive WebRTC answer from a peer
  ```json
  { "from": "peer-id", "answer": {...} }
  ```

- `ice-candidate`: Receive ICE candidate from a peer
  ```json
  { "from": "peer-id", "candidate": {...} }
  ```

- `user-left`: Notification that a user disconnected
  ```json
  { "userId": "peer-id" }
  ```

- `chat-message`: Receive text message from a peer
  ```json
  { "sender": "peer-id", "message": "text", "timestamp": "ISO-8601" }
  ```

## Test IDs (for automated testing)

The application includes comprehensive `data-test-id` attributes for testing:

- `local-video` - Local user's video element
- `remote-video` - Remote peer's video element
- `remote-video-container` - Container for all remote videos
- `mute-mic-button` - Microphone toggle button
- `toggle-camera-button` - Camera toggle button
- `hangup-button` - Disconnect button
- `status-waiting` - Waiting status indicator
- `status-connecting` - Connecting status indicator
- `status-connected` - Connected status indicator
- `chat-input` - Message input field
- `chat-submit` - Message submit button
- `chat-log` - Chat message container
- `chat-message` - Individual chat message element

## Deployment

### Production Checklist

- [ ] Environment variables configured in `.env`
- [ ] STUN server URL set to a reliable service (Google, Twilio, etc.)
- [ ] SSL/TLS certificate configured for HTTPS
- [ ] WebSocket connection secured with WSS (WebSocket Secure)
- [ ] Docker image built and tested
- [ ] Health checks configured and passing
- [ ] Firewall rules allow WebRTC traffic (UDP/TCP)

### Scaling Considerations

- **Current Limit**: 4 participants per room (mesh topology)
- **For Larger Groups**: Consider SFU (Selective Forwarding Unit) architecture
- **Load Balancing**: Use reverse proxy (nginx) for horizontal scaling
- **TURN Server**: Add TURN server for restrictive network environments

## Troubleshooting

### No Video/Audio

1. Check browser console for permission errors
2. Ensure microphone/camera permissions are granted
3. Verify STUN server is accessible
4. Check firewall rules for UDP traffic

### WebSocket Connection Failed

1. Verify server is running on port 3000
2. Check CORS settings in socket configuration
3. Ensure WebSocket protocol is supported in network
4. Check browser console for connection errors

### Peers Cannot See Each Other

1. Verify both users are in the same room
2. Check WebRTC offer/answer exchange in console
3. Verify ICE candidates are being exchanged
4. Ensure STUN server is reachable

### Chat Messages Not Appearing

1. Confirm WebSocket connection is established
2. Check message payload in network tab
3. Verify socket event listeners are registered
4. Check browser console for errors

## Performance Optimization

- Lazy loading of video components
- Efficient state management with React hooks
- Minimal re-renders using memoization
- Optimized Tailwind CSS with purging
- Video element muting for local stream
- Automatic cleanup on component unmount

## Security Considerations

- WebSocket connections should use WSS (WebSocket Secure)
- Implement authentication before room access in production
- Validate and sanitize chat messages
- Use HTTPS for the entire application
- Implement rate limiting for chat messages
- Add CSRF protection for forms

## Future Enhancements

- [ ] Screen sharing capability
- [ ] Audio/Video recording
- [ ] Room persistence database
- [ ] User authentication and profiles
- [ ] Advanced chat features (mentions, reactions)
- [ ] SFU architecture for larger groups
- [ ] Network quality indicators
- [ ] Bandwidth adaptation
- [ ] Dark/Light theme toggle
- [ ] Mobile app (React Native)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please:
- Open an issue on GitHub
- Check existing documentation
- Review the troubleshooting section

## Acknowledgments

- WebRTC standards and browser APIs
- Next.js framework and ecosystem
- Socket.IO for real-time communication
- Tailwind CSS for styling
- Lucide React for icons

---

**Version**: 1.0.0  
**Last Updated**: May 2026  
**Maintainer**: Development Team
