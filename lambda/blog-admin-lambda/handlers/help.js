function getHelpMessage() {
  return `*Blog Admin Bot Commands:*\n\n` +
    `*/add type [title] date=[value] className=[value]* - Add post, image, place, or comment\n` +
    `   Post types: blog, review, noises\n` +
    `   Image types: postbox, train (send photo)\n` +
    `   Place type: place (see dedicated /add place section below)\n` +
    `   Comment type: comment\n` +
    `   Example: /add blog [My Title] date=[تابستان ۰۳]\nPost body...\n` +
    `   Example: /add blog [My Title] date=[تابستان ۰۳] spotifySongId=[2QwObYJWyJTiozvs0RI7CF]\nPost body...\n` +
    `   Example: /add blog [My Title] date=[تابستان ۰۳] soundCloudLink=[url]\nPost body...\n` +
    `   Example: /add review [My Review Title] date=[تابستان ۰۳]\nReview body...\n` +
    `   Example: /add noises [My Noise Title] date=[تابستان ۰۳] soundCloudLink=[url] playlist=[true]\nDescription...\n` +
    `   Example: Send photo with /add postbox [Barcelona] [بارسِلونا]\n` +
    `   Example: Send photo with /add train [Tokyo] [توکیو]\n` +
    `   Example: /add comment\nComment text here...\n\n` +
    `*/add place [Venue Name] city=[City] cityFa=[شهر] country=[Country] countryFa=[کشور] mapsQuery=[Google Maps link]* - Add a place, with a photo and note text attached\n` +
    `   What you give it: name of the place, city + country in English and Farsi, a photo, a short note, and a Google Maps link\n` +
    `   Required: Venue Name (in brackets), city, country — everything else is optional but recommended\n` +
    `   Note text goes on a new line after the command, just like a post body (no note=[...] tag needed)\n` +
    `   Example: Send photo with /add place [Café de Flore] city=[Paris] cityFa=[پاریس] country=[France] countryFa=[فرانسه] mapsQuery=[https://maps.app.goo.gl/xyz]\nGreat coffee, quiet corner table\n` +
    `   Advanced, rarely needed: year, love, continent, lat, lng (precise coordinates override mapsQuery)\n\n` +
    `*/get type uuid* - Get post or place details\n` +
    `   Example: /get blog abc123\n` +
    `   Example: /get place abc123\n\n` +
    `*/delete type uuid* - Delete post, image, or place\n` +
    `   Example: /delete blog abc123\n` +
    `   Example: /delete postbox xyz789\n` +
    `   Example: /delete place xyz789\n\n` +
    `*/update type uuid field=[value]* - Update post, place, or meta\n` +
    `   Post fields: title, date, description, order, body, soundCloudLink, playlist, spotifySongId\n` +
    `   Place fields: name, city, cityFa, country, countryFa, continent, year, love, lat, lng, mapsQuery, note\n` +
    `   Meta fields: name, subtitle\n` +
    `   Example: /update blog abc123 title=[فصل پنجم] date=[فصل دهم] spotifySongId=[2QwObYJWyJTiozvs0RI7CF]\n` +
    `   Example: /update blog abc123\nNew body text here... (updates body only)\n` +
    `   Example: Send photo with /update blog abc123 (updates image only)\n` +
    `   Example: /update place abc123 love=[5]\n` +
    `   Example: /update place abc123\nUpdated note text (updates note only)\n` +
    `   Example: Send photo with /update place abc123 (updates image only)\n` +
    `   Example: /update meta name=[New Name]\n` +
    `   Example: /update meta subtitle=[New Subtitle]\n\n` +
    `*/toggle* - Toggle state\n\n` +
    `*/spotifyauth* - Get link to re-authorize Spotify (needed every ~6 months when the refresh token expires)\n\n` +
    `*/scholarrefresh* - Re-scrape Google Scholar and update the publications list\n\n` +
    `*/help* - Show this help\n\n` +
    `*Note:* Always use [] brackets for field values in /add and /update commands. Attach photo to /add or /update to include image.`;
}

module.exports = {
  getHelpMessage
};