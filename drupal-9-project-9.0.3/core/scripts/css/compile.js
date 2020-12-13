const chalk = require('chalk');
const log = require('./log');
const fs = require('fs');
const postcss = require('postcss');
const postcssCustomProperties = require('postcss-custom-properties');
const postcssCalc = require("postcss-calc");
const postcssImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const postcssHeader = require('postcss-header');

module.exports = (filePath, callback) => {
  // Transform the file.
  fs.readFile(filePath, (err, css) => {
    postcss([
      postcssImport(),
      postcssCustomProperties({
        // Remove converted properties from the generated code. This needs to be
        // set to ensure that CSS minifiers don't remove the generated values.
        preserve: false,
      }),
      postcssCalc,
      autoprefixer({
        // Output without visual cascade for more consistency with existing
        // Drupal CSS.
        cascade: false
      }),
      postcssHeader({
        header: `/*\n * DO NOT EDIT THIS FILE.\n * See the following change record for more information,\n * https://www.drupal.org/node/3084859\n * @preserve\n */\n`,
      }),
    ])
    .process(css, { from: filePath })
    .then(result => {
      callback(result.css);
    })
    .catch(error => {
      log(chalk.red(error));
      process.exitCode = 1;
    });
  });
};
