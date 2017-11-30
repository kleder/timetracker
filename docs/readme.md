# Development

For development we recommended to install last available version of Visual Studio Code.

## Requirements

* node (min 6.10.2)
* node-gyp (min 3.6.2)

Please follow the node gyp instalattion procedure for your operating system https://github.com/nodejs/node-gyp#installation

Clone timetracker repository and open folder in Visual Studio Code. Your current folder has to contain package.json file. Open integrated terminal in VS Code (Ctrl + `).

Enter command:  
 ```sh
npm install
```
### 1. Building versions
To build Windows version (x64) run:
```sh
npm run electron:windows
```
To build Mac version (x64) run:
```sh
npm run electron:mac
```
To build Linus version (x64) run:
```sh
npm run electron:Linux
```
Generated files are located in app-builds folder.
### 2. Developer run

To run application enter and run:
```sh
npm run start
```
