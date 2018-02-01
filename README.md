# T-REC – Time RECording app 

![T-Rec image](./t-rec.jpg)

T-REC is a desktop time recording app that helps you log your work time into YouTrack. Recorded time entries are automatically synced to InCloud or Standalone YouTrack. 


## Features 
* record time you spend on tasks assigned to you in YouTrack
* track time of your tasks from multiple agile boards  
* detect your idle time and decide what to do with it
* autosync with YouTrack
* work with many YouTrack instances

[![Build Status](https://travis-ci.org/kleder/timetracker.svg?branch=master)](https://travis-ci.org/kleder/timetracker)

## Downloads 
The Windows (x64)/ Linux (x64) and Mac binaries are avaible on [Release](https://github.com/kleder/timetracker/releases/latest) page.

## Getting started

### Obtain YouTrack token for app 

To start using T-REC you need to obtain the permanent token for your personal YouTrack account. 
Follow this instruction to get one: 
1. Log-in into your YouTrack in web browser
1. Open http://[YOUTRACK_URL]/users/me page
1. Click on the **Update personal information and manage logins** link
1. Open the Authentication tab.
1. Click the **New token**... button.
1. Fill the name "T-rec"
1. Add scope "YouTrack"
1. Click **Create Token**
1. You must copy the token at this point, because as soon as you close the dialog you will not be able to access the token itself again. 

In case you don't see the "New Token" button make sure that you have **Read Service** and **Update self** permissions to issue a token in one of your YouTrack roles.  

### Before run

Before the first run of the app create an agile board with tasks assigned to you and schedule a sprint. Follow this instruction to get more info: https://www.jetbrains.com/help/youtrack/standalone/Agile-Board.html

### First run

Once you run T-REC add YouTrack account by entering your YouTrack URL and personal token.
Then select boards you'd like to work with. Finally you may start recording the work you do with your tasks

### Remarks
T-REC allows you to view your tasks which belong to the correctly scheduled current sprint on the agile board. T-REC will not display the task if it is not part of the sprint or is not assigned to you.

## Development and contribution
To compile source code see [CONTRIBUTING](CONTRIBUTING.md) file

## License
Apache 2.0
