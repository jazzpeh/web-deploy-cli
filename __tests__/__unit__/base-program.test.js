const BaseProgram = require('../../programs/base-program');

/**
 * 1. BaseProgram
 */
describe('BaseProgram', () => {
  let program;

  beforeEach(() => {
    program = new BaseProgram();
  });

  /**
   * 2. checkProjectDir
   */
  describe('checkProjectDir', () => {
    const projectDir = `${__dirname}/hello_world`;
    const projectFolder = 'build'

    beforeEach(() => {
      program.projectDir = projectDir;
      program.projectFolder = projectFolder
    });

    it('should show `deployDir` by appending `projectDir` and `projectFolder`', () => {
      program.checkProjectDir();
      expect(program.deployDir).toEqual(`${projectDir}/${projectFolder}`);
    });

    it('show show `deployDir` with same value as `projectDir` if `projectFolder` is empty', () => {
      program.projectFolder = '';
      program.checkProjectDir();
      expect(program.deployDir).toEqual(projectDir);
    });
  });
});