
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { ConsoleFontColors } = require('./constants');

/**
 * Convert absolute directory path to files to bucket key
 * Need to make sure that the project directory is uploaded
 * correctly to the S3 bucket
 * @param {string} dirPath 
 * @param {string} filePath
 */
const convertToBucketKey = (dirPath, filePath) => {
  return filePath.replace(dirPath, '').replace(/^\/|\/$/g, '');
};

/**
 * Upload file in a directory into AWS S3 Bucket
 * @param {string} bucketName 
 * @param {string} filePath 
 */
const uploadDirToBucket = async (bucketName, filePath) => {
  const s3 = new AWS.S3();

  const params = {
    Bucket: bucketName,
    Body: fs.createReadStream(filePath),
    Key: convertToBucketKey(filePath),
    ACL: 'public-read'
  };

  try {
    const result = await s3.upload(params);
    console.log(ConsoleFontColors.GREEN, `Successfully uploaded file from ${dirPath} to ${result.location}`);
  } catch (err) {
    console.log(ConsoleFontColors.RED, 'Error', err);
  }
};

module.exports = {
  convertToBucketKey,
  uploadDirToBucket
};