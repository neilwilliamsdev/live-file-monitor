// =====================================
// Dependencies
// =====================================

const path = require('path');
const { loadProject } = require('./src/project');
const { scanDirectory } = require('./src/scanner');


// =====================================
// Main application
// =====================================

async function main() {

    // Existing: get project path from command line
    const projectArgument = process.argv[2];


    // New: validate a project path was supplied
    if (!projectArgument) {
        console.log(
            'Usage: node index.js <local-site-path>'
        );

        process.exit(1);
    }


    try {

        // Existing: resolve and load workspace config
        const projectPath = path.resolve(
            projectArgument
        );

        const project = loadProject(
            projectPath
        );


        // Existing: display project information
        console.log(
            `Project: ${project.project}`
        );


        // New: scan each configured target
        for (const target of project.targets) {

            const targetPath = path.join(
                project.path,
                project.root,
                target.localPath
            );

            const files = await scanDirectory(
                targetPath,
                project.ignore,
            );

            // Temporary debug output
            console.log(
                files.slice(0, 3)
            );

            console.log(
                `${target.name}: ${files.length} files`
            );
        }


    } catch(error) {

        console.error(error.message);

        process.exit(1);
    }
}


// Start application
main();