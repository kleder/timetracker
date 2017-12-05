# T-Rec time recording app 

![T-rec image](./src/assets/dino.png)

T-Rec is a desktop time recording app that helps you log your work time into Youtrack. Recorded time entries are automatically synced to InCloud or Standalone Youtrack. 


## Features 
* record time you spend on tasks assigned to you in youtrack
* track time of your tasks from multiple agile boards  
* detect your idle time and decide what to do with it
* autosync with youtrack

[![Build Status](https://travis-ci.org/kleder/timetracker.svg?branch=master)](https://travis-ci.org/kleder/timetracker)

## Downloads 
The Windows (x64) and Mac binaries are avaible on [Release](https://github.com/kleder/timetracker/releases) page.

## Getting started

### Obtain youtrack token for app 

To start using T-Rec you need to obtain the permament token for your personal youtrack account. Follow this instruction to get one: https://www.jetbrains.com/help/youtrack/standalone/Manage-Permanent-Token.html

In case you don't see the "New Token" button make sure that you have set **Create Service** privileges in one of your youtrack roles.  

### Before run

Before the first run of the app create an agile board with tasks assigned to you and schedule a sprint. Follow this instruction to get more info: https://www.jetbrains.com/help/youtrack/standalone/Agile-Board.html

### First run

Once you run T-rec add Youtrack account by entering your Youtrack URL and personal token.
Then select boards you'd like to work with. Finaly you may start recording the work you do with your tasks

## Development and contribution
To compile source code see [CONTRIBUTING](CONTRIBUTING.md) file

## License
Apache 2.0
