
const AWS = require('aws-sdk');
const fs = require('fs');
const os = require('os');
const colors = require('colors/safe');
const logSymbols = require('log-symbols');

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
    console.log(logSymbols.success, `Successfully uploaded file from ${dirPath} to ${result.location}`);
  } catch (err) {
    console.log(colors.red(`Error ${err}`));
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
  uploadDirToBucket,
  updateProfile
};