# Steps to generate installation msi file

### 1. Run in timetracker directory:
```sh
npm install
```

### 2. Run in timetracker directory
```sh
npm run electron:windows
```

### 3. Rebuild T-Rec_Installer project in Visual Studio 2017
- Go to Windows features ON or OFF and set .NET Framework 3.5 
- Go to http://wixtoolset.org/releases/ and install:
    - WiX Toolset build tools V3.11
    - WiX Toolset Visual Studio Extension for Visual Studio 2017
- Open solution file in Visual Studio 2017 and rebuild the T-Rec_Installer project

### 5. Builded installer you can find in *T-Rec_Installer/bin/Debug/en-us/T-Rec_Installer.msi*

