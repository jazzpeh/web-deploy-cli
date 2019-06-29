const { ConsoleFontColors } = require('../../util/constants');
const { errorConsoleMsg } = require('../../util/common');

/**
 * Common utilities
 */
describe('Common Utilities', () => {
  /**
   * errorConsoleMsg
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

});
