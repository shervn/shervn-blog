# Quick Start Guide

## 5-Minute Setup

### Step 1: Create Telegram Bot (2 min)
1. Open Telegram, search for [@BotFather](https://t.me/botfather)
2. Send `/newbot`
3. Choose a name and username for your bot
4. **Copy the token** (looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Step 2: Get Your User ID (1 min)
1. Search for [@userinfobot](https://t.me/userinfobot) on Telegram
2. Start a conversation
3. **Copy your user ID** (looks like `123456789`)

### Step 3: Deploy to Lambda (2 min)

#### Using Serverless Framework (Terminal):

1. **Navigate to the lambda directory:**
   ```bash
   cd lambda/blog-admin-lambda
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set environment variables:**
   Create a `.env` file or export them:
   ```bash
   export TELEGRAM_BOT_TOKEN=your_bot_token_here
   export ALLOWED_USER_ID=your_user_id_here
   ```
   
   Or create a `.env` file:
   ```bash
   echo "TELEGRAM_BOT_TOKEN=your_bot_token_here" > .env
   echo "ALLOWED_USER_ID=your_user_id_here" >> .env
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```
   
   This will:
   - Create the Lambda function
   - Set up API Gateway endpoint
   - Configure IAM permissions for S3 access
   - Set environment variables

5. **Copy the endpoint URL** from the deployment output (look for `endpoints:` section)

### Step 4: Set Webhook (30 sec)
Run this command (replace with your values):
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_LAMBDA_URL>"
```

### Step 5: Test! (30 sec)
1. Open Telegram, find your bot
2. Send `/help`
3. You should get a list of commands!

## First Post

Try adding a test post:
```
/add blog Test Post
This is my first post via Telegram bot!
```

## Common Issues

**Bot not responding?**
- Check webhook: `curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"`
- Verify Lambda URL is correct
- Check CloudWatch logs in Lambda console

**Unauthorized error?**
- Double-check `ALLOWED_USER_ID` matches your Telegram user ID exactly
- No spaces or extra characters

**S3 errors?**
- Verify bucket name is `shervn-blog-media`
- Check IAM permissions include `s3:GetObject` and `s3:PutObject`
- Verify region is `us-east-1`

## Next Steps

- Read full documentation in `README.md`
- Try all commands: `/list`, `/add`, `/get`, `/update`, `/delete`
- Customize date format in `getCurrentDate()` function if needed

Happy blogging! 🎉

