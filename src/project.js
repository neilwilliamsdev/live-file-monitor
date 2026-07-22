const fs = require('fs');
const path = require('path');

function loadProject(projectPath) {

    const configPath = path.join(
        projectPath,
        '.vscode',
        'live-monitor.json'
    );

    if (!fs.existsSync(configPath)) {
        throw new Error(
            `No live-monitor.json found in ${projectPath}`
        );
    }

    const config = JSON.parse(
        fs.readFileSync(configPath, 'utf8')
    );

    return {
        path: projectPath,
        ...config
    };
}

module.exports = {
    loadProject
};