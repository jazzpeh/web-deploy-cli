const { readDir } = require('../../util/common');
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
});