# Live File Monitor

Live File Monitor is a small Node.js utility for comparing a local project against one or more remote SFTP targets and reporting differences. It is designed for situations where you want to detect whether files on the remote server are newer than local files, or whether the remote has files that do not exist locally.

This project is still a working prototype, but the core scan-and-compare flow is implemented and runnable from the command line.

## What it does

The app does the following:

1. Reads a project config file from `.vscode/live-monitor.json`
2. Loads environment variables from a project-level `.env`
3. Scans the local project files
4. Connects to the configured SFTP host and scans the remote directory
5. Compares the two sets of files by path and timestamp
6. Prints a summary and a per-target list of discrepancies

The comparisons currently focus on:

- `remote-newer`: the remote version is newer than the local version
- `remote-only`: the file exists remotely but not locally

## How it runs

From the project root, run:

```bash
node index.js "/path/to/local/project"
```

The script expects the project path you pass in to contain a config file at:

```text
/path/to/local/project/.vscode/live-monitor.json
```

If no argument is supplied, it exits with usage output:

```bash
Usage: node index.js <local-site-path>
```

The default behavior is to resolve the supplied path, load the project environment variables, scan remote targets, and print a summary to the terminal.

## Required project config

The project config is a JSON file named `.vscode/live-monitor.json`.

Example:

```json
{
  "project": "My Site",
  "root": "",
  "ignore": [
    "node_modules",
    ".git",
    "wp-content/cache"
  ],
  "targets": [
    {
      "name": "Production",
      "localPath": "",
      "remotePath": "/public_html"
    }
  ]
}
```

### Config fields

- `project`: display name for the project
- `root`: optional root folder under the local project path
- `ignore`: list of path fragments to skip while scanning
- `targets`: one or more target definitions
  - `name`: label shown in output
  - `localPath`: local relative folder to scan
  - `remotePath`: remote SFTP directory to scan

## Required environment variables

The app loads a `.env` file from the project folder before scanning remote files. It expects SFTP credentials such as:

```env
SFTP_HOST=example.com
SFTP_PORT=22
SFTP_USER=myuser
SFTP_PASSWORD=secret
```

These values are used in `src/scanners/sftp.js` when creating the SSH/SFTP client connection.

## Runtime flow

The main execution flow in `index.js` is:

```js
const project = loadProject(projectPath);
const sftpConfig = {
  host: process.env.SFTP_HOST,
  port: process.env.SFTP_PORT || 22,
  username: process.env.SFTP_USER,
  password: process.env.SFTP_PASSWORD
};

for (const target of project.targets) {
  const localFiles = await scanDirectory(targetPath, project.ignore);
  const remoteFiles = await scanRemoteDirectory(sftpConfig, target.remotePath, project.ignore);
  const differences = compareFiles(localFiles, remoteFiles);
  results.targets.push({ ... });
}

results.summary = buildSummary(results);
reportSummary(results.summary);
results.targets.forEach(reportChanges);
```

In plain terms:

- local files are scanned recursively
- remote files are scanned recursively via SFTP
- each file is stored with its relative path, timestamp, and size
- remote vs local files are compared by matching path
- mismatches are reported to the console

## Project structure

```text
.
├── index.js                  # CLI entry point
├── package.json              # Node package config
├── reporter.js               # legacy or placeholder reporting file
├── src/
│   ├── comparison/
│   │   └── comparison.js     # file comparison logic
│   ├── config/
│   │   └── project.js        # project config loader
│   ├── reporting/
│   │   ├── console.js        # color/status formatting
│   │   ├── dateFormatter.js  # date formatting helper
│   │   ├── reporter.js       # change output
│   │   └── summary.js        # aggregate summary
│   ├── scanners/
│   │   ├── local.js          # local directory scan
│   │   └── sftp.js           # remote SFTP scan
│   └── utils/
└── extension/
    ├── extension.js          # VS Code extension scaffold
    ├── package.json          # extension manifest
    └── test/
```

## Example output

The script prints output such as:

```text
Project: My Site
Production: 121 local files
Production: 119 remote files
Summary
Targets scanned : 1
Local files     : 121
Remote files    : 119

Remote newer    : 2
Remote only     : 3

5 files require attention
```

Then it prints each problem in a target-specific section, such as:

```text
⚠ Remote newer: wp-content/themes/site/style.css
+ Remote only: wp-content/uploads/image.jpg
```

## VS Code extension status

There is also a VS Code extension scaffold under `extension/`. It watches for a workspace containing `.vscode/live-monitor.json` and offers a simple activation flow. At the moment it is not a full feature implementation; it currently contains a basic “Hello World” command and a “Run Scan” workflow that invokes the CLI from the extension host.

## Current status

This repository is at the prototype stage:

- the CLI scan flow works conceptually and in code
- remote/local comparison is implemented
- config loading and scan logic are present
- documentation and tests are still minimal
- the extension is only partially implemented

## Notes

The app is designed around a local project root plus one or more remote targets, where the remote files are treated as the source of truth when they are newer or missing locally. It is useful as a lightweight file-difference checker, especially for WordPress or similar CMS-style site structures.

## Quick start

1. Create `.vscode/live-monitor.json` in your local project
2. Add a matching `.env` file with SFTP credentials
3. Run:

```bash
node index.js "/absolute/path/to/project"
```

4. Review the summary and file-by-file differences printed in the terminal
