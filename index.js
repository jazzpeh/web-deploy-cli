const Program = require('./program');
const { errorConsoleMsg } = require('./util/common');

const newProgram = new Program();

(async () => {
  try {
    await newProgram.run();
  } catch (err) {
    console.log(errorConsoleMsg('Unable to continue operation. Terminating program...'), err);
    process.exit(1);
  }
})();