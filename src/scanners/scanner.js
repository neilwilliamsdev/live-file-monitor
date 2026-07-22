const fg = require('fast-glob');
const fs = require('fs');
const path = require('path');


async function scanDirectory(directory, ignore = []) {

    const files = await fg('**/*', {
        cwd: directory,
        onlyFiles: true,
        ignore
    });

    // Convert file list into a consistent format
    return files.map(file => {

        const fullPath = path.join(
            directory,
            file
        );

        const stats = fs.statSync(
            fullPath
        );


        return {
            path: file,

            // Store as ISO string so local and FTP
            // can be compared consistently later
            modified: stats.mtime.toISOString(),

            size: stats.size
        };

    });

}


module.exports = {
    scanDirectory
};