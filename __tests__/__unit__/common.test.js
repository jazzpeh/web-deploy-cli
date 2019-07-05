const { readDir, readJsonFile, inbetweenSquareBrackets } = require('../../util/common');
const fsmock = require('mock-fs');

/**
 * 1. Common
 */
describe('Common', () => {
  /**
   * 2. readDir
   */
  describe('readDir', () => {
    let dir = '';

    beforeEach(() => {
      dir = '/Users/johndoe/Documents/Workspaces/hello_world/build';
      fsmock({
        [dir]: {
          'index.html': 'hello world!',
          'manifest.json': '{"test":"hello world"}',
          'static' : {
            'css': {
              'main.css': 'html{font-size:1rem;}',
              'sub.css': 'body{font-size:1rem;}'
            },
            'js': {
              'main.js': 'alert("hello world!")',
              'sub.js': 'alert("hello world 2!")'
            }
          }
        }
      });
    });

    afterEach(() => {
      fsmock.restore();
    });

    it('should retrieve all files from a given existing directory path', () => {
      const files = readDir(dir);
      expect(files.length).toEqual(6);
    });

    it('should contains absolute paths of each file', () => {
      const files = readDir(dir);
      expect(files[0]).toContain(dir);
    });

    it('should not hit any errors for non-existent directory path', () => {
      const files = readDir(dir.replace('hello_world', 'not_hello_world'));
      expect(files.length).toEqual(0);
    });

    it('should ignore files from `ignoreList`', () => {
      fsmock({
        [dir]: {
          'index.html': 'hello world!',
          '.DS_Store': ''
        }
      });
      const files = readDir(dir);
      expect(files.length).toEqual(1);
    });
  });

  /**
   * 3. readJsonFile
   */
  describe('readJsonFile', () => {
    let file = '';
    let dir = '';
    let data;

    beforeEach(() => {
      dir = '/Users/johndoe/Documents/Workspaces/hello_world/';
      file = 'config.json';
      data = { test: 'hello world' };
      fsmock({
        [dir]: {
          [file]: JSON.stringify(data),
        }
      });
    });

    afterEach(() => {
      fsmock.restore();
    });

    it('should read json file successfully and return a json object', async () => {
      const result = await readJsonFile(`${dir}/${file}`);
      expect(result).toEqual(data);
    });
  });

  /**
   * 4. inbetweenSquareBrackets
   */
  describe('inbetweenSquareBrackets', () => {
    it('should extract text between brackets', () => {
      const value = 'Asia (Singapore) [ap-southeast-1]';
      expect(inbetweenSquareBrackets(value)).toEqual('ap-southeast-1');
    });
  });
});