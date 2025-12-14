const s3Service = require('../services/s3Service');
const telegramService = require('../services/telegramService');
const { generateUUID } = require('../utils/uuid');

// Add postbox image
async function addPostboxImage(cityEn, cityFa, imagePath) {
  const data = await s3Service.readJSON('postboxdata');
  const newEntry = {
    city: {
      en: cityEn,
      fa: cityFa
    },
    path: imagePath,
    uuid: generateUUID()
  };
  
  data.push(newEntry);
  await s3Service.writeJSON('postboxdata', data);
  
  return `✅ Postbox image added!\n\n*City (EN):* ${cityEn}\n*City (FA):* ${cityFa}\n*Path:* \`${imagePath}\`\n*UUID:* \`${newEntry.uuid}\``;
}

// Add train image
async function addTrainImage(cityEn, cityFa, imagePath) {
  const data = await s3Service.readJSON('traindata');
  const newEntry = {
    city: {
      en: cityEn,
      fa: cityFa
    },
    path: imagePath,
    uuid: generateUUID()
  };
  
  data.push(newEntry);
  await s3Service.writeJSON('traindata', data);
  
  return `✅ Train image added!\n\n*City (EN):* ${cityEn}\n*City (FA):* ${cityFa}\n*Path:* \`${imagePath}\`\n*UUID:* \`${newEntry.uuid}\``;
}

// Handle photo upload (for addpostbox and addtrain commands)
async function handlePhotoUpload(command, args, fileId) {
  try {
    // Download and upload image
    const { buffer, extension } = await telegramService.downloadFile(fileId);
    
    // Parse city names from args (format: "CityEN CityFA" or just "CityEN")
    const cityParts = args.trim().split(/\s+/);
    const cityEn = cityParts[0] || 'Unknown';
    const cityFa = cityParts.slice(1).join(' ') || cityEn;
    
    // Generate filename
    const timestamp = Date.now();
    const fileName = `${cityEn.replace(/\s+/g, '_')}_${timestamp}.${extension}`;
    
    // Upload to S3
    const folder = command === 'addpostbox' ? 'Postbox' : 'Trains';
    const imagePath = await s3Service.uploadImageToS3(buffer, folder, fileName);
    
    // Add to JSON
    let response;
    if (command === 'addpostbox') {
      response = await addPostboxImage(cityEn, cityFa, imagePath);
    } else {
      response = await addTrainImage(cityEn, cityFa, imagePath);
    }
    
    return response;
  } catch (err) {
    console.error('Error processing photo:', err);
    throw err;
  }
}

module.exports = {
  addPostboxImage,
  addTrainImage,
  handlePhotoUpload
};

