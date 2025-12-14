const s3Service = require('../services/s3Service');
const cloudfrontService = require('../services/cloudfrontService');
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
  
  // Invalidate CloudFront cache
  await cloudfrontService.invalidateDataFiles();
  
  return `✅ Postbox image added!\n\n*City (EN):* ${cityEn}\n*City (FA):* ${cityFa}\n*Path:* \`${imagePath}\`\n*UUID:* \`${newEntry.uuid}\``;
}

// Delete postbox image by UUID
async function deletePostboxImage(uuid) {
  const data = await s3Service.readJSON('postboxdata');
  const index = data.findIndex(item => item.uuid === uuid);
  
  if (index === -1) {
    return `❌ Postbox image with UUID \`${uuid}\` not found.`;
  }
  
  const deleted = data.splice(index, 1)[0];
  await s3Service.writeJSON('postboxdata', data);
  
  // Invalidate CloudFront cache
  await cloudfrontService.invalidateDataFiles();
  
  return `✅ Postbox image deleted!\n\n*City (EN):* ${deleted.city.en}\n*City (FA):* ${deleted.city.fa}\n*UUID:* \`${uuid}\``;
}

// Delete train image by UUID
async function deleteTrainImage(uuid) {
  const data = await s3Service.readJSON('traindata');
  const index = data.findIndex(item => item.uuid === uuid);
  
  if (index === -1) {
    return `❌ Train image with UUID \`${uuid}\` not found.`;
  }
  
  const deleted = data.splice(index, 1)[0];
  await s3Service.writeJSON('traindata', data);
  
  // Invalidate CloudFront cache
  await cloudfrontService.invalidateDataFiles();
  
  return `✅ Train image deleted!\n\n*City (EN):* ${deleted.city.en}\n*City (FA):* ${deleted.city.fa}\n*UUID:* \`${uuid}\``;
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
  
  // Invalidate CloudFront cache
  await cloudfrontService.invalidateDataFiles();
  
  return `✅ Train image added!\n\n*City (EN):* ${cityEn}\n*City (FA):* ${cityFa}\n*Path:* \`${imagePath}\`\n*UUID:* \`${newEntry.uuid}\``;
}

// Handle photo upload (for postbox and train types)
async function handlePhotoUpload(type, args, fileId) {
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
    const folder = type === 'postbox' ? 'Postbox' : 'Trains';
    const imagePath = await s3Service.uploadImageToS3(buffer, folder, fileName);
    
    // Add to JSON
    let response;
    if (type === 'postbox') {
      response = await addPostboxImage(cityEn, cityFa, imagePath);
    } else if (type === 'train') {
      response = await addTrainImage(cityEn, cityFa, imagePath);
    } else {
      throw new Error(`Invalid type: ${type}. Allowed: postbox, train`);
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
  deletePostboxImage,
  deleteTrainImage,
  handlePhotoUpload
};

