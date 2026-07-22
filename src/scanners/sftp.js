// =====================================
// Dependencies
// =====================================

const SftpClient = require('ssh2-sftp-client');


// =====================================
// Scan remote SFTP directory
// =====================================

async function scanRemoteDirectory(
    config,
    directory,
    ignore = []
) {

    const client = new SftpClient();

    const files = [];


    try {

        // Connect to SFTP server
        await client.connect({
            host: config.host,
            port: Number(config.port),
            username: config.username,
            password: config.password,

            readyTimeout: 30000,

            // debug: (message) => {
            //     console.log('SFTP:', message);
            // }
        });

        // Recursive directory scan
        async function scan(folder) {

            const listing = await client.list(folder);


            for (const item of listing) {

                const remotePath =
                    `${folder}/${item.name}`;


                // Ignore folders/files
                if (
                    ignore.some(rule =>
                        remotePath.includes(rule)
                    )
                ) {
                    continue;
                }


                if (item.type === 'd') {

                    await scan(remotePath);

                } else {

                    files.push({

                        // Make path relative
                        path: remotePath.replace(
                            directory + '/',
                            ''
                        ),

                        modified:
                            item.modifyTime
                                ? new Date(
                                    item.modifyTime
                                ).toISOString()
                                : null,

                        size: item.size

                    });

                }

            }

        }


        await scan(directory);


        return files;


    } finally {

        client.end();

    }

}


module.exports = {
    scanRemoteDirectory
};