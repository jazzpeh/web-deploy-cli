const colors = require('colors');
const Program = require('./program');

const newProgram = new Program();

(async () => {
  try {
    await newProgram.run();
  } catch (err) {
    console.log(colors.red('Unable to continue operation. Terminating program...'), colors.red(err));
  } finally {
    process.exit(1);
  }
})();