# Blog Admin Lambda - Telegram Bot

A serverless Lambda function that allows you to manage blog posts stored in S3 via a Telegram bot.

## Features

- ✅ Add new posts
- ✅ List recent posts
- ✅ Get post details by UUID
- ✅ Update post fields (title, date, description, order, body)
- ✅ Delete posts
- ✅ Supports multiple post types (blog, review, noises)

## Setup Instructions

### 1. Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` and follow the instructions
3. Copy the bot token (e.g., `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Get Your Telegram User ID

1. Search for [@userinfobot](https://t.me/userinfobot) on Telegram
2. Start a conversation - it will reply with your user ID
3. Copy your user ID (e.g., `123456789`)

### 3. Deploy Lambda Function

#### Option A: Using AWS Console

1. Go to AWS Lambda Console
2. Create a new function
3. Upload the code from `index.js`
4. Set the following environment variables:
   - `TELEGRAM_BOT_TOKEN`: Your bot token from BotFather
   - `ALLOWED_USER_ID`: Your Telegram user ID
5. Set up an API Gateway trigger (HTTP API or REST API)
6. Copy the webhook URL

#### Option B: Using Serverless Framework (Recommended)

Create a `serverless.yml`:

```yaml
service: blog-admin-lambda

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  environment:
    TELEGRAM_BOT_TOKEN: ${env:TELEGRAM_BOT_TOKEN}
    ALLOWED_USER_ID: ${env:ALLOWED_USER_ID}

functions:
  telegramBot:
    handler: index.handler
    events:
      - http:
          path: telegram-webhook
          method: post

iamRoleStatements:
  - Effect: Allow
    Action:
      - s3:GetObject
      - s3:PutObject
    Resource: arn:aws:s3:::shervn-blog-media/data/*
```

Then deploy:
```bash
npm install -g serverless
npm install
serverless deploy
```

### 4. Set Telegram Webhook

Replace `YOUR_WEBHOOK_URL` with your Lambda function URL:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_WEBHOOK_URL>"
```

Or use the Telegram API directly:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "<YOUR_WEBHOOK_URL>"}'
```

### 5. Configure IAM Permissions

Ensure your Lambda execution role has permissions to read/write to S3:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::shervn-blog-media/data/*"
    }
  ]
}
```

## Usage

Start a conversation with your bot on Telegram and use these commands:

### List Posts
```
/list blog
/list review 5
/list noises 20
```

### Add New Post
```
/add blog My Post Title
This is the post body.
It can span multiple lines.
```

### Get Post Details
```
/get blog abc123
```

### Update Post
```
/update blog abc123 title=New Title
/update blog abc123 date=تابستان ۰۳
/update blog abc123 order=30
/update blog abc123 body
New body content here...
```

### Delete Post
```
/delete blog abc123
```

### Help
```
/help
```

## Command Format

All commands follow this pattern:
```
/command [type] [args]
[body content if needed]
```

- `type` can be: `blog`, `review`, or `noises` (defaults to `blog`)
- Commands that need a body (like `/add`) should have the body on new lines after the command

## Notes

- Posts are automatically sorted by `order` field (descending)
- New posts get the next available order number
- UUIDs are auto-generated (8 characters)
- Date defaults to current Persian date if not specified
- Only the authorized user (ALLOWED_USER_ID) can use the bot

## Troubleshooting

1. **Bot not responding**: Check webhook is set correctly
2. **Unauthorized error**: Verify ALLOWED_USER_ID matches your Telegram user ID
3. **S3 errors**: Check IAM permissions and bucket name
4. **Command not working**: Check command format matches examples above

