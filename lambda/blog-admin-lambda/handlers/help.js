function getHelpMessage() {
  return `*Blog Admin Bot Commands:*\n\n` +
    `*Posts:*\n` +
    `*/list [type]* - List recent posts\n` +
    `   Types: \`blog\`, \`review\`, \`noises\`\n` +
    `   Example: \`/list blog\` or \`/list review 5\`\n\n` +
    `*/add [type] [title] [date=value] [className=value]* - Add new post\n` +
    `   Types: \`blog\`, \`review\`, \`noises\`\n` +
    `   Date is required. className optional (default: farsiPost)\n` +
    `   *Example:*\n\`/add blog My Title date=تابستان ۰۳\nPost body here...\`\n` +
    `   *Example with className:*\n\`/add blog My Title date=تابستان ۰۳ className=englishPost\nPost body...\`\n\n` +
    `*/get [type] [uuid]* - Get post details\n` +
    `   Types: \`blog\`, \`review\`, \`noises\`\n` +
    `   Example: \`/get blog abc123\`\n\n` +
    `*/delete [type] [uuid]* - Delete a post\n` +
    `   Types: \`blog\`, \`review\`, \`noises\`\n` +
    `   Example: \`/delete blog abc123\`\n\n` +
    `*/update [type] [uuid] [field=value]* - Update post field\n` +
    `   Types: \`blog\`, \`review\`, \`noises\`\n` +
    `   *Example:*\n\`/update blog abc123 title=New Title\`\n\n` +
    `*Images:*\n` +
    `*/addpostbox [CityEN] [CityFA]* - Add postbox image (send photo with caption)\n` +
    `*Example:* Send photo with caption: \`/addpostbox Barcelona بارسِلونا\`\n\n` +
    `*/addtrain [CityEN] [CityFA]* - Add train image (send photo with caption)\n` +
    `*Example:* Send photo with caption: \`/addtrain London لَندَن\`\n\n` +
    `*Comments:*\n` +
    `*/addcomment [text]* - Add a comment\n` +
    `*Example:*\n\`/addcomment "Beautiful" People\`\n\n` +
    `*Toggle State:*\n` +
    `*/toggle* - Toggle the state (ON/OFF)\n` +
    `*/getstate* - Get current toggle state\n\n` +
    `*/help* - Show this help`;
}

module.exports = {
  getHelpMessage
};

