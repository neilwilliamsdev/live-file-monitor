// =====================================
// Project summary
// =====================================

const {
    formatHeading
} = require('./console');


/**
 * Build a summary of the scan results.
 *
 * @param {Object} results
 * @returns {Object}
 */
function buildSummary(results) {

    const summary = {

        targets: results.targets.length,

        localFiles: 0,

        remoteFiles: 0,

        changes: 0,

        remoteNewer: 0,

        remoteOnly: 0

    };


    results.targets.forEach(result => {

        summary.localFiles +=
            result.summary.localFiles;

        summary.remoteFiles +=
            result.summary.remoteFiles;

        summary.changes +=
            result.summary.changes;

        summary.remoteNewer +=
            result.summary.remoteNewer;

        summary.remoteOnly +=
            result.summary.remoteOnly;

    });


    return summary;

}


/**
 * Display project summary.
 *
 * @param {Object} summary
 * @returns {void}
 */
function reportSummary(summary) {

    console.log('');

    console.log(
        formatHeading('Summary')
    );

    console.log('');

    console.log(
        `Targets scanned : ${summary.targets}`
    );

    console.log(
        `Local files     : ${summary.localFiles}`
    );

    console.log(
        `Remote files    : ${summary.remoteFiles}`
    );

    console.log('');

    console.log(
        `Remote newer    : ${summary.remoteNewer}`
    );

    console.log(
        `Remote only     : ${summary.remoteOnly}`
    );

    console.log('');

    console.log(
        `${summary.changes} files require attention`
    );

}


module.exports = {

    buildSummary,

    reportSummary

};