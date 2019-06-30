
const AWS = require('aws-sdk');
const fs = require('fs');
const os = require('os');

/**
 * Credentials file path based on OS
 * @enum {string}
 */
const CredentialsFilePath = {
  WINDOWS: `${os.homedir()}\.aws\credentials`,
  OSX: `${os.homedir()}/.aws/credentials`,
  LINUX: `${os.homedir()}/.aws/credentials`
};

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
const uploadFileToBucket = async (bucketName, filePath, successCallback, errorCallback) => {
  const s3 = new AWS.S3();

  const params = {
    Bucket: bucketName,
    Body: fs.createReadStream(filePath),
    Key: convertToBucketKey(filePath),
    ACL: 'public-read'
  };

  try {
    const data = await s3.upload(params);
    if (typeof successCallback === 'function') successCallback(data);
    return true;
  } catch (err) {
    if (typeof errorCallback === 'function') errorCallback(err);
    return false;
  }
};

/**
 * Update AWS profile name in credentials configuration
 * @param {*} profile 
 */
const updateProfile = profile => {
  const credentials = new AWS.SharedIniFileCredentials({ profile });
  AWS.config.credentials = credentials;
};

module.exports = {
  CredentialsFilePath,
  convertToBucketKey,
  uploadFileToBucket,
  updateProfile
};