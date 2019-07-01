
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
const convertToBucketKey = (filePath, dirPath) => {
  return filePath.replace(dirPath, '').replace(/^\/|\/$/g, '');
};

/**
 * Upload file in a directory into AWS S3 Bucket
 * @param {string} bucketName 
 * @param {string} filePath 
 */
const uploadFileToBucket = (bucketName, filePath, dirPath, successCallback, errorCallback) => {
  const s3 = new AWS.S3();
  const location = convertToBucketKey(filePath, dirPath);
  const params = {
    Bucket: bucketName,
    Body: fs.createReadStream(filePath),
    Key: location,
    ACL: 'public-read'
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        if (typeof errorCallback === 'function') errorCallback(err);
        reject(false);
        return;
      }

      if (data && typeof successCallback === 'function') {
        successCallback({ ...data, location });
      }

      resolve(true);
    });
  });
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