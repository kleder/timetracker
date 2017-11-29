
const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'app-builds')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'T-rec-win32-x64/'),
    authors: 'Kleder',
    description: "T-rec time tracker is built for speed and live work item update in youtrack system.",
    noMsi: false,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'T-rec.exe',
    setupExe: 'Setup.exe',
  })
}