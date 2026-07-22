// Node.js built-in modules
const path = require('path');

// Load project configuration
const { loadProject } = require('./src/project');

// Scan local directory
const { scanDirectory } = require('./src/scanner');

// Scan remote SFTP directory
const { scanRemoteDirectory } = require('./src/sftp');

// Compare local and remote files
const { compareFiles } = require('./src/comparison');

// Format dates for CLI output
const { formatDate } = require('./src/dateFormatter');

// Format console output
const {
    formatStatus,
    formatHeading
} = require('./src/console');

/**
 * Main application entry point
 * 
 * Usage: node index.js <local-site-path>
 * 
 * Example: node index.js /path/to/local/site
 * 
 * The local-site-path should contain a .vscode/live-monitor.json file
 * with the project configuration.
 */
async function main() {

    // Get project path from command line
    const projectArgument = process.argv[2];


    // Validate a project path was supplied
    if (!projectArgument) {
        console.log(
            'Usage: node index.js <local-site-path>'
        );

        process.exit(1);
    }


    try {

        // Resolve and load workspace config
        const projectPath = path.resolve(
            projectArgument
        );

        // Load project environment variables
        require('dotenv').config({
            path: path.join(
                projectPath,
                '.env'
            )
        });

        const project = loadProject(
            projectPath
        );


        // Display project information
        console.log(
            `Project: ${project.project}`
        );

        // SFTP connection settings
        const sftpConfig = {

            host: process.env.SFTP_HOST,

            port: process.env.SFTP_PORT || 22,

            username: process.env.SFTP_USER,

            password: process.env.SFTP_PASSWORD

        };

        // New: scan each configured target
        for (const target of project.targets) {

            const targetPath = path.join(
                project.path,
                project.root,
                target.localPath
            );

            const files = await scanDirectory(
                targetPath,
                project.ignore
            );

            // Local scan result
            console.log(
                `${target.name}: ${files.length} local files`
            );

            // Remote SFTP scan
            const remoteFiles = await scanRemoteDirectory(
                sftpConfig,
                target.remotePath,
                project.ignore
            );


            console.log(
                `${target.name}: ${remoteFiles.length} remote files`
            );

            const differences = compareFiles(
                files,
                remoteFiles
            );


            console.log('');
            console.log(
                formatHeading(
                    `${target.name} changes:`
                )
            );

            console.log('');

            // Display differences
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


    } catch(error) {

        console.error(error.message);

        process.exit(1);
    }
}


// Start application
main();