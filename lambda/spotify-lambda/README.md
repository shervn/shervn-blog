# Spotify Lambda

A serverless Lambda function that provides Spotify API endpoints for your blog, including recent tracks, top artists/songs, currently playing track, and player controls.

## Features

- ✅ Recent tracks endpoint
- ✅ Top artists endpoint
- ✅ Top songs endpoint
- ✅ Currently playing track endpoint
- ✅ Player controls (play, pause, next, previous)
- ✅ Toggle state management (stored in S3)

## Prerequisites

1. **Spotify Developer Account**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Copy your `CLIENT_ID` and `CLIENT_SECRET`
   - Set redirect URI (e.g., `http://localhost:3000/callback`)
   - Generate a refresh token (see below)

2. **AWS Account**
   - AWS CLI configured with appropriate credentials
   - S3 bucket `shervn.com` (or update bucket name in `s3Toggle.js`)

3. **Node.js & Serverless Framework**
   ```bash
   npm install -g serverless
   ```

## Getting Spotify Refresh Token

1. Visit this URL (replace `CLIENT_ID` and `REDIRECT_URI`):
   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REDIRECT_URI&scope=user-read-recently-played%20user-top-read%20user-read-currently-playing%20user-modify-playback-state
   ```

2. Authorize the app and copy the `code` from the redirect URL

3. Exchange the code for refresh token:
   ```bash
   curl -X POST https://accounts.spotify.com/api/token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=authorization_code&code=YOUR_CODE&redirect_uri=YOUR_REDIRECT_URI&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET"
   ```

4. Copy the `refresh_token` from the response

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables:**
   ```bash
   export SPOTIFY_CLIENT_ID=your_client_id
   export SPOTIFY_CLIENT_SECRET=your_client_secret
   export SPOTIFY_REFRESH_TOKEN=your_refresh_token
   ```

   Or create a `.env` file (for local development only):
   ```
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   SPOTIFY_REFRESH_TOKEN=your_refresh_token
   ```

## Deployment

### Deploy to AWS Lambda

```bash
serverless deploy
```

This will:
- Create the Lambda function
- Set up API Gateway endpoints
- Configure IAM permissions for S3 access
- Set environment variables

### Deploy to specific stage

```bash
serverless deploy --stage production
```

### View logs

```bash
serverless logs -f api -t
```

### Remove deployment

```bash
serverless remove
```

## API Endpoints

After deployment, you'll get a base URL like:
```
https://xxxxx.execute-api.us-east-1.amazonaws.com/dev
```

### Recent Tracks
```
GET /recent-tracks?limit=5
```
Returns recently played tracks (limit: 1-10, default: 1)

### Top Artists
```
GET /top-artists?limit=10&time_range=long_term
```
- `time_range`: `short_term`, `medium_term`, or `long_term` (default: `long_term`)
- `limit`: 1-10 (default: 1)

### Top Songs
```
GET /top-songs?limit=10&time_range=short_term
```
- `time_range`: `short_term`, `medium_term`, or `long_term` (default: `short_term`)
- `limit`: 1-10 (default: 1)

### Currently Playing
```
GET /currently-playing
```
Returns the currently playing track with details

### Player Controls
```
GET /player?action=pause
GET /player?action=play
GET /player?action=next
GET /player?action=previous
```

### Toggle State
```
GET /toggle
GET /toggle-state
```
Toggle state management (stored in S3)

## Local Development

The same `index.js` file works for both local development and AWS Lambda deployment. For local development:

```bash
npm start
# or
node index.js
```

The server will run on `http://localhost:3001` (or the port specified in `PORT` environment variable).

**Note:** Make sure you have a `.env` file with your Spotify credentials:
```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token
```

The code automatically detects if it's running locally (not in Lambda) and:
- Loads environment variables from `.env` file
- Starts a local Express server on port 3001

## Configuration

### Update S3 Bucket

If you want to use a different S3 bucket for toggle state, edit `s3Toggle.js`:

```javascript
const BUCKET = 'your-bucket-name';
```

And update `serverless.yml` IAM permissions:

```yaml
Resource: arn:aws:s3:::your-bucket-name/toggleState.json
```

### Update Region

To deploy to a different AWS region, update `serverless.yml`:

```yaml
provider:
  region: us-west-2  # Change this
```

## Troubleshooting

1. **401 Unauthorized**: Check your Spotify credentials are correct
2. **403 Forbidden**: Verify S3 bucket permissions and IAM role
3. **500 Error**: Check CloudWatch logs for detailed error messages
4. **CORS issues**: CORS is enabled by default, but verify your frontend origin

## Notes

- Access tokens are automatically cached and refreshed
- Toggle state is persisted in S3 (`shervn.com/toggleState.json`)
- All endpoints support CORS
- Rate limits: Follow Spotify API rate limits

