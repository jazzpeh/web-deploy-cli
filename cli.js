#!/usr/bin/env node

const colors = require('colors');
const Program = require('./program');

const newProgram = new Program();

(async () => {
  try {
    await newProgram.run();
    process.exit();
  } catch (err) {
    console.log(colors.red('Unable to continue operation. Terminating program...'), colors.red(err));
    process.exit(1);
  }
})();