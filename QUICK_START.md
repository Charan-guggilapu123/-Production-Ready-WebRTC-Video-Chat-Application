# Quick Start Guide

## For Development

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- A modern web browser with WebRTC support

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Next.js Frontend (Terminal 1)
```bash
npm run dev
```
The frontend will be available at `http://localhost:3000`

### Step 3: Start Socket.IO Server (Terminal 2)
```bash
npm run dev-server
```
The WebSocket signaling server will be running on the same port

### Step 4: Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Create New Room" to generate a unique room ID
3. Open the same room URL in another browser tab/window or incognito window
4. Grant camera/microphone permissions when prompted
5. You should see both video streams
6. Try the controls:
   - Click the microphone icon to mute/unmute
   - Click the camera icon to turn video on/off
   - Type messages in the chat panel
   - Click the phone icon to hang up

## For Docker (Production)

### Prerequisites
- Docker and Docker Compose installed

### Step 1: Build and Run
```bash
docker-compose up --build
```

### Step 2: Access the Application
- Open http://localhost:3000 in your browser
- The application is fully containerized and ready for production

### Step 3: Stop the Application
```bash
docker-compose down
```

## Testing Scenarios

### Scenario 1: Two-Peer Call
1. Create a room on Peer 1
2. Copy the room ID
3. Join the same room on Peer 2
4. Verify both see each other's video
5. Test audio/video controls
6. Send chat messages
7. Hang up on Peer 1
8. Verify Peer 2 sees Peer 1's video disappear

### Scenario 2: Three-Peer Call
1. Create a room on Peer 1
2. Have Peer 2 and Peer 3 join the same room
3. All three should see each other in a grid
4. Verify status changes from "waiting" to "connected"
5. Test media controls
6. Have Peer 2 disconnect
7. Verify Peer 1 and 3 still see each other

### Scenario 3: Four-Peer Call (Maximum)
1. Four separate browser instances join the same room
2. Each should see 3 other participants
3. Status should show "connected"
4. Grid layout should auto-adjust for 4 videos + PiP
5. Chat messages should broadcast to all 4 peers

## Environment Variables

If you want to customize the STUN server, create a `.env.local` file:

```env
PORT=3000
NEXT_PUBLIC_STUN_SERVER=stun:stun.l.google.com:19302
```

Available public STUN servers:
- `stun:stun.l.google.com:19302`
- `stun:stun1.l.google.com:19302`
- `stun:stun.stunprotocol.org:3478`
- `stun:stun.twilio.com:3478`

## Troubleshooting

### No Video/Audio
- Check browser console for permission errors
- Ensure you granted camera/microphone permissions
- Check firewall settings
- Try a different STUN server

### WebSocket Connection Failed
- Ensure dev-server is running
- Check that port 3000 is not in use
- Try clearing browser cache
- Check browser console for errors

### Peers Can't See Each Other
- Verify both are in the same room
- Check Network tab for WebSocket messages
- Ensure ICE candidates are exchanged
- Try with different network (avoid VPN if possible)

### Chat Messages Not Appearing
- Verify WebSocket connection is active
- Check browser console for errors
- Reload the page and try again

## Performance Tips

- Close other applications to free up resources
- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Ensure good network connection
- Reduce video resolution if experiencing lag
- Limit to 4 participants (mesh topology limitation)

## Development Tips

### Debugging
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for WebSocket messages
- Check Application tab for local storage

### WebSocket Messages
Watch for these socket events in the Network tab:
- `join-room` - User joining a room
- `peers` - List of existing peers
- `offer` - WebRTC offer
- `answer` - WebRTC answer
- `ice-candidate` - ICE candidate
- `user-joined` - New user notification
- `user-left` - User disconnection
- `chat-message` - Text message

### Console Logging
The application logs WebRTC and Socket.IO events to the console for debugging.

## Next Steps

1. **Customize Styling**: Edit `app/globals.css` and Tailwind classes
2. **Add Authentication**: Implement user login before joining rooms
3. **Add Screen Sharing**: Extend WebRTC implementation
4. **Add Recording**: Use MediaRecorder API
5. **Scale to SFU**: For more than 4 participants, implement Selective Forwarding Unit

## Support

For detailed documentation, see:
- [README.md](./README.md) - Complete documentation
- [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) - Feature checklist

## License

This project is MIT licensed - see LICENSE file for details.
