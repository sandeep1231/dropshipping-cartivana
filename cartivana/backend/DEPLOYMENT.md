# Cartivana Backend Deployment

## Environment Variables Required
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production

## Railway Deployment
1. Connect your GitHub repo to Railway
2. Select the backend folder as root
3. Set environment variables in Railway dashboard
4. Deploy automatically

## Render Deployment
1. Connect your GitHub repo to Render
2. Create a new Web Service
3. Set root directory to 'backend'
4. Build command: npm install
5. Start command: npm start
6. Set environment variables
