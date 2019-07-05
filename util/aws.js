
const AWS = require('aws-sdk');
const fs = require('fs');
const os = require('os');
const mime = require('mime-types')

/**
 * Credentials file path based on OS
 * @enum {String}
 */
const CredentialsFilePath = {
  WINDOWS: `${os.homedir()}\\.aws\\credentials`,
  OSX: `${os.homedir()}/.aws/credentials`,
  LINUX: `${os.homedir()}/.aws/credentials`
};

/**
 * Convert absolute directory path to files to bucket key
 * Need to make sure that the project directory is uploaded
 * correctly to the S3 bucket
 * @param {String} dirPath 
 * @param {String} filePath
 */
const convertToBucketKey = (filePath, dirPath) => {
  return filePath.replace(dirPath, '').replace(/^\/|\/$/g, '');
};

/**
 * Handle similar callback functions for S3 methods
 * @param {Function} resolve 
 * @param {Function} reject 
 * @param {Object} err 
 * @param {Object} data 
 * @param {Function} successCallback 
 * @param {Function} errorCallback 
 */
const handleCallback = (resolve, reject ,err, data, successCallback, errorCallback) => {
  if (err) {
    if (typeof errorCallback === 'function') errorCallback(err);
    reject(false);
  } else {
    if (typeof successCallback === 'function') successCallback(data);
    resolve(true);
  }
};

/**
 * Upload file in a directory into AWS S3 Bucket
 * @param {String} bucketName 
 * @param {String} filePath 
 * @param {Function} successCallback
 * @param {Function} errorCallback
 */
const uploadFileToBucket = (bucketName, filePath, dirPath, successCallback, errorCallback) => {
  const s3 = new AWS.S3();
  const location = convertToBucketKey(filePath, dirPath);
  const params = {
    Bucket: bucketName,
    Body: fs.createReadStream(filePath),
    Key: location,
    ACL: 'public-read',
    ContentType: mime.lookup(filePath) || 'application/octet-stream'
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
 * @param {String} profile 
 */
const updateProfile = profile => {
  const credentials = new AWS.SharedIniFileCredentials({ profile });
  AWS.config.credentials = credentials;
};

/**
 * Checkif the given bucketName exists
 * @param {String} bucketName 
 */
const bucketExist = bucketName => {
  const s3 = new AWS.S3();
  const params = {
    Bucket: bucketName
  };
  
  return new Promise((resolve) => {
    s3.headBucket(params, (err) => {
      if (err) resolve(false);
      else  resolve(true);
    });  
  });
};

/**
 * Delete existing bucket
 * @param {String} bucketName 
 * @param {Function} successCallback 
 * @param {Function} errorCallback 
 */
const deleteBucket = (bucketName, successCallback, errorCallback) => {
  const s3 = new AWS.S3();
  const params = {
    Bucket: bucketName
  };

  return new Promise((resolve, reject) => {
    s3.deleteBucket(params, (err, data) => handleCallback(resolve, reject, err, data, successCallback, errorCallback));
  });
};

/**
 * Create new bucket
 * @param {String} bucketName 
 * @param {String} location 
 * @param {Function} successCallback 
 * @param {Function} errorCallback 
 */
const createBucket = (bucketName, location, successCallback, errorCallback) => {
  const s3 = new AWS.S3();

  const bucketParams = {
    Bucket: bucketName,
    ACL: 'public-read',
    CreateBucketConfiguration: {
      LocationConstraint: location
    }
  };

  return new Promise((resolve, reject) => {
    s3.createBucket(bucketParams, (err, data) => handleCallback(resolve, reject, err, data, successCallback, errorCallback));
  });
};

/**
 * Set static web hosting
 * @param {String} bucketName 
 * @param {String} indexDoc 
 * @param {String} errDoc 
 * @param {Function} successCallback 
 * @param {Function} errorCallback 
 */
const setBucketHosting = (bucketName, indexDoc, errDoc, successCallback, errorCallback) => {
  const s3 = new AWS.S3();

  const staticHostParams = {
    Bucket: bucketName,
    WebsiteConfiguration: {
      ErrorDocument: {
        Key: errDoc
      },
      IndexDocument: {
        Suffix: indexDoc
      }
    }
  };

  return new Promise((resolve, reject) => {
    s3.putBucketWebsite(staticHostParams, (err, data) => handleCallback(resolve, reject, err, data, successCallback, errorCallback));
  });
};

module.exports = {
  CredentialsFilePath,
  convertToBucketKey,
  uploadFileToBucket,
  updateProfile,
  bucketExist,
  deleteBucket,
  createBucket,
  setBucketHosting
};