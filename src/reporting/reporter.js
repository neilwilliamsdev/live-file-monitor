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

function reportChanges(
    target,
    changes
) {

    console.log('');

    console.log(
        formatHeading(
            target.name
        )
    );


    if (!changes.length) {

        console.log(
            'No changes detected'
        );

        return;

    }


    let remoteNewer = 0;
    let remoteOnly = 0;


    changes.forEach(change => {

        if (
            change.status === 'remote-newer'
        ) {
            remoteNewer++;
        }


        if (
            change.status === 'remote-only'
        ) {
            remoteOnly++;
        }

    });


    console.log(
        `Changes: ${changes.length}`
    );

    console.log(
        `Remote newer: ${remoteNewer}`
    );

    console.log(
        `Remote only: ${remoteOnly}`
    );


    console.log('');


    changes.forEach(change => {

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