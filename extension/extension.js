const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

// Add the child_process module to execute shell commands
const { exec } = require('child_process');


/**
 * @param {import('vscode').ExtensionContext} context
 */
function activate(context) {

    console.log(
        'Live Monitor activated'
    );


    checkWorkspace(context);


    const disposable = vscode.commands.registerCommand(
        'live-monitor.helloWorld',
        function () {

            vscode.window.showInformationMessage(
                'Live Monitor is running.'
            );

        }
    );


    context.subscriptions.push(
        disposable
    );
}

/**
 * @param {import('vscode').ExtensionContext} context
 * @returns 
 */
function checkWorkspace(context) {

    const workspace =
        vscode.workspace.workspaceFolders?.[0];


    if (!workspace) {
        return;
    }


    const configPath = path.join(
        workspace.uri.fsPath,
        '.vscode',
        'live-monitor.json'
    );


    if (!fs.existsSync(configPath)) {

        console.log(
            'Live Monitor config not found.'
        );

        return;
    }

	const today = new Date()
		.toISOString()
		.split('T')[0];


	const lastScan = context.globalState.get(
		'lastScan'
	);


	if (lastScan !== today) {

		vscode.window.showInformationMessage(
			'This project has not been checked today.',
			'Run Scan',
			'Later'
		).then(selection => {

			if (selection === 'Run Scan') {

				runScan(
					workspace.uri.fsPath
				);

			}

		});

	} else {

		vscode.window.showInformationMessage(
			'Live Monitor already checked today.'
		);

	}

}

/**
 * Run the Live Monitor CLI scan.
 *
 * @param {string} workspacePath
 */
function runScan(workspacePath) {

    const command =
        `node index.js "${workspacePath}"`;


    exec(
        command,
        {
            cwd: path.join(
                __dirname,
                '..'
            )
        },
        (error, stdout, stderr) => {

            if (error) {

                vscode.window.showErrorMessage(
                    `Live Monitor failed: ${error.message}`
                );

                return;
            }


            vscode.window.showInformationMessage(
                'Live Monitor scan complete.'
            );


            console.log(stdout);

            if (stderr) {
                console.error(stderr);
            }

        }
    );

}

function deactivate() {}


module.exports = {
    activate,
    deactivate
};