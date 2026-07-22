// =====================================
// Change reporting
// =====================================

const {
    formatStatus,
    formatHeading
} = require('./console');


const {
    formatDate
} = require('./dateFormatter');


// =====================================
// Report target changes
// =====================================

function reportChanges(result) {

    const {
        target,
        differences,
        summary
    } = result;

    console.log('');

    console.log(
        formatHeading(
            target.name
        )
    );


    if (!differences.length) {

        console.log(
            'No changes detected'
        );

        return;

    }

    console.log(
        `Changes: ${summary.changes}`
    );

    console.log(
        `Remote newer: ${summary.remoteNewer}`
    );

    console.log(
        `Remote only: ${summary.remoteOnly}`
    );


    console.log('');


    differences.forEach(change => {

        console.log(
            formatStatus(
                change.status,
                change.path
            )
        );


        if (change.local) {

            console.log(
                `  Local : ${formatDate(change.local)}`
            );

            console.log(
                `  Remote: ${formatDate(change.remote)}`
            );

        }

        console.log('');

    });

}


module.exports = {
    reportChanges
};