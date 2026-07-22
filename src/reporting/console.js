// =====================================
// Terminal output formatting
// =====================================

const chalk = require('chalk');


// =====================================
// Status formatting
// =====================================

function formatStatus(status, path) {

    switch(status) {

        case 'remote-newer':

            return chalk.yellow(
                `⚠ Remote newer: ${path}`
            );


        case 'remote-only':

            return chalk.red(
                `+ Remote only: ${path}`
            );


        default:

            return path;

    }

}


// =====================================
// Section headings
// =====================================

function formatHeading(text) {

    return chalk.cyan(text);

}


module.exports = {
    formatStatus,
    formatHeading
};