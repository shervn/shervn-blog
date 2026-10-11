const s3Service = require('../services/s3Service');
const cloudfrontService = require('../services/cloudfrontService');
const telegramService = require('../services/telegramService');
const { generateUUID } = require('../utils/uuid');

const DATA_FILE = 'placesdata';
const IMAGE_FOLDER = 'Places';

async function uploadPlaceImage(fileId) {
  const { buffer, extension } = await telegramService.downloadFile(fileId);
  const fileName = `place_${Date.now()}.${extension}`;
  return await s3Service.uploadImageToS3(buffer, IMAGE_FOLDER, fileName);
}

// Add a new place
async function addPlace(fields, fileId) {
  const { name, city, cityFa, country, countryFa, continent, year, love, lat, lng, mapsQuery, note } = fields;

  if (!name) throw new Error('Name is required');
  if (!city) throw new Error('City is required');
  if (!country) throw new Error('Country is required');

  const places = await s3Service.readJSON(DATA_FILE);
  const imagePath = fileId ? await uploadPlaceImage(fileId) : null;

  const newPlace = {
    uuid: generateUUID(),
    name,
    city: { en: city, fa: cityFa || city },
    country: { en: country, fa: countryFa || country },
    continent: continent || null,
    year: year || null,
    love: love || null,
    note: note || null,
    image: imagePath
  };

  // Precise coordinates (resolved from a shared Google Maps link) take
  // priority over a text search when both would otherwise be set.
  if (lat != null && lng != null) {
    newPlace.lat = lat;
    newPlace.lng = lng;
  } else if (mapsQuery) {
    newPlace.mapsQuery = mapsQuery;
  }

  places.push(newPlace);
  await s3Service.writeJSON(DATA_FILE, places);
  await cloudfrontService.invalidateDataFiles();

  let response = `✅ Place added!\n\n*Name:* ${newPlace.name}\n*City:* ${city}, ${country}\n*UUID:* \`${newPlace.uuid}\``;
  if (imagePath) response += `\n*Image:* \`${imagePath}\``;
  return response;
}

// Delete place by UUID
async function deletePlace(uuid) {
  const places = await s3Service.readJSON(DATA_FILE);
  const index = places.findIndex(p => p.uuid === uuid);

  if (index === -1) {
    return `❌ Place with UUID \`${uuid}\` not found.`;
  }

  const deleted = places.splice(index, 1)[0];
  await s3Service.writeJSON(DATA_FILE, places);
  await cloudfrontService.invalidateDataFiles();

  return `✅ Place deleted!\n\n*Name:* ${deleted.name}\n*UUID:* \`${uuid}\``;
}

// Update place by UUID
async function updatePlace(uuid, updates, fileId) {
  const places = await s3Service.readJSON(DATA_FILE);
  const index = places.findIndex(p => p.uuid === uuid);

  if (index === -1) {
    return `❌ Place with UUID \`${uuid}\` not found.`;
  }

  const place = places[index];

  if (updates.name !== undefined) place.name = updates.name;
  if (updates.city !== undefined) place.city = { en: updates.city, fa: updates.cityFa || place.city.fa };
  else if (updates.cityFa !== undefined) place.city.fa = updates.cityFa;
  if (updates.country !== undefined) place.country = { en: updates.country, fa: updates.countryFa || place.country.fa };
  else if (updates.countryFa !== undefined) place.country.fa = updates.countryFa;
  if (updates.continent !== undefined) place.continent = updates.continent;
  if (updates.year !== undefined) place.year = updates.year;
  if (updates.love !== undefined) place.love = updates.love;
  if (updates.note !== undefined) place.note = updates.note;
  if (updates.lat !== undefined) place.lat = updates.lat;
  if (updates.lng !== undefined) place.lng = updates.lng;
  if (updates.mapsQuery !== undefined) place.mapsQuery = updates.mapsQuery;

  if (fileId) {
    place.image = await uploadPlaceImage(fileId);
  }

  await s3Service.writeJSON(DATA_FILE, places);
  await cloudfrontService.invalidateDataFiles();

  return `✅ Place updated!\n\n*UUID:* \`${uuid}\`\n*Name:* ${place.name}`;
}

// Get place by UUID
async function getPlace(uuid) {
  const places = await s3Service.readJSON(DATA_FILE);
  const place = places.find(p => p.uuid === uuid);

  if (!place) {
    return `❌ Place with UUID \`${uuid}\` not found.`;
  }

  let result = `*Place Details:*\n\n`;
  result += `Name: ${place.name}\n`;
  result += `City: ${place.city.en} (${place.city.fa})\n`;
  result += `Country: ${place.country.en} (${place.country.fa})\n`;
  result += `UUID: \`${place.uuid}\`\n`;
  result += `Year: ${place.year || '(none)'}\n`;
  result += `Love: ${place.love || '(none)'}\n`;
  result += `Image: ${place.image || '(none)'}\n`;
  result += `Maps: ${place.lat != null ? `${place.lat}, ${place.lng}` : (place.mapsQuery || '(search by name)')}\n`;
  result += `Note: ${place.note || '(none)'}\n`;
  return result;
}

module.exports = {
  addPlace,
  deletePlace,
  updatePlace,
  getPlace
};
