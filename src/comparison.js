// =====================================
// Compare local and remote files
// =====================================

function compareFiles(
    localFiles,
    remoteFiles
) {

    const changes = [];


    const localMap = new Map(
        localFiles.map(file => [
            file.path,
            file
        ])
    );


    const remoteMap = new Map(
        remoteFiles.map(file => [
            file.path,
            file
        ])
    );


    // Check remote files against local files
    for (const [path, remoteFile] of remoteMap) {

        const localFile = localMap.get(path);


        // New remote file
        if (!localFile) {

            changes.push({
                path,
                status: 'remote-only'
            });

            continue;
        }


        // Remote newer
        if (
            new Date(remoteFile.modified)
            >
            new Date(localFile.modified)
        ) {

            changes.push({
                path,
                status: 'remote-newer',
                local: localFile.modified,
                remote: remoteFile.modified
            });

        }

    }


    return changes;

}


module.exports = {
    compareFiles
};