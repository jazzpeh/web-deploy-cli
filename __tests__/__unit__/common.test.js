const { ConsoleFontColors } = require('../../util/constants');
const { errorConsoleMsg, infoConsoleMsg } = require('../../util/common');

/**
 * 1. Common utilities
 */
describe('Common Utilities', () => {
  /**
   * 2. errorConsoleMsg
   */
  describe('errorConsoleMsg', () => {
    let color = '', msg = '';

    beforeEach(() => {
      color = ConsoleFontColors.RED;
      msg = 'Hello World!';
    });

    it('appends `color` to `msg`', () => {
      expect(errorConsoleMsg(msg)).toEqual(`${color}${msg}`);
    });
  });

  /**
   * 3. infoConsoleMsg
   */
  describe('infoConsoleMsg', () => {
    let color = '', msg = '';

    beforeEach(() => {
      color = ConsoleFontColors.CYAN;
      msg = 'Hello World!';
    });

    it('appends `color` to `msg`', () => {
      expect(infoConsoleMsg(msg)).toEqual(`${color}${msg}`);
    });
  });

});
