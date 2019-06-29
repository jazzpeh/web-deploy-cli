const fs = require('fs');
const readline = require('readline');
const logSymbols = require('log-symbols');
const { CredentialsFilePath, updateProfile } = require('./util/aws');
const { errorConsoleMsg } = require('./util/common');

class Program {
  constructor() {
    /**
     * Readline console
     * @type {readline}
     */
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    /**
     * Platform OS names
     * @type {Object}
     */
    this.platformOS = {
      win32: 'WINDOWS',
      darwin: 'OSX',
      linux: 'LINUX'
    };

    /**
     * OS platform
     * @type {string|null}
     */
    this.os = null;

    /**
     * AWS profile name
     * @type {string}
     */
    this.profile = '';

    /**
     * Project directory to deploy
     * @type {string}
     */
    this.projectDir = '';

    /**
     * Specify if there's any folder to go into to deploy
     * @type {string}
     */
    this.projectFolder = '';
  }

  /**
   * Run program storyboard
   */
  async run() {
    this.init();
  }

  /**
   * Initialise, set process variables
   */
  init() {
    this.profile = process.env.PROFILE || 'default';
    this.projectDir = process.env.DIR || process.cwd();
    this.projectFolder = process.env.FOLDER || '';
  }
}

module.exports = Program;