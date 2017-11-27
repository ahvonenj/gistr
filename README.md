# gistr

Gistr - View, save and pull files from Github's Gists.

[![Build Status](https://travis-ci.com/ahvonenj/gistr.svg?token=CTLNy9ndTqFfFx23p9q1&branch=master)](https://travis-ci.com/ahvonenj/gistr)

## Why?

gistr is designed to be a small and a simple tool to quickly push and pull files from Github's Gists. You may have that useful `index.css` or something else saved, which you always include for your projects, but it is a hassle to find and fetch all those various files, as they have probably been scattered among various different projects and gists.

Simply put - the goal, when using this tool, is that you can start building your own local "database" of different kinds of files, which you can then easily fetch for your other projects. This local database itself, can then be stored as a gist or a file and restored to other machines at will.

## Gists?

As I could not figure out anything better to use and I don't want to host files on a server of my own - I decided to use Github's Gists as a starting storage for files.

## Install

`npm install -g gistr`

## Usage

### Create a gist from file(s)

`gist add <file1> <file2> ... [<-b (1 gist, n files)>] [<-d="" (Gist description)>] [<-v (Verbose logging)>]`

Uploads one or more files as one or more gists to Github and saved a reference to those files into a local database-file.

Example:  
`gist add myfile1.txt myfile2.txt --bundle -d="Gist description" -v`

### Create a gist from folder

`gist add-dir <directory> [<-d="" (Gist description)>] [<-v (Verbose logging)>]`

Uploads all files in a folder as a single gist to Github and saves a reference to that gist into a local database-file.

Example:  
`gist add-dir "path/to/folder"`  
`gist add-dir folder -d="Folder full of files"`

### List gists

`gist list`

Lists references to gisted files, located in a local database-file.

### Find gists by description or filename

`gist find <search>`

Find references to gisted files, located in a local database-file.

Example:  
`gist find gulpfile`  
`gist find "math library"`

### Show gist details

`gist show <Gist #>`

Outputs details of a saved gist reference, located in a local database-file.

`Gist #`'s can be found by calling `gist list`.

Example:  
`gist show 5`  
`gist show 4 --tofile` (Creates a file named `gist-<gistID>.txt` to the cwd)

### Pull gist from Github's Gists

`gist pull <Gist #>  <[-v (Verbose logging)]>`

Pulls a gist and all associated files to that gist from Github's Gists.

Example:  
`gist pull 3` (Pulls the gist and writes the files into cwd)  
`gist pull 2 -d="somefolder"` (Pulls the gist and writes the files into `cwd/somefolder/`)

### Export local database

`gist export-db [<-f="path/to/file.ext">] <[-v (Verbose logging)]>`

Exports the local database to a file or as a gist if -f or --tofile -parameter is not given.

To export the local database as a gist, `access-token` has to be set, as the database file could contain your Github access-token. Having the access-token being set as a requirement guarantees that the gist is made under your Github profile as a secret gist.

File-export does not require the access-token to be set, but be careful as the exported file might still contain your access-token if it is set.

### Import local database

`gist import-db <--file="path/to/db-export.gs"> <[-v (Verbose logging)]>`  
`gist import-db <--id="yourdbexportgistid"> <[-v (Verbose logging)]>`

Import local database from a file or from an exported gist. 

If importing from a file, --file parameter is expected and needs to point to an exported .gs-file.

If importing from a gist, --id parameter is expected and needs to be an id of the gist that has the storage file.

### Purge / delete local database

`gist purge-db`

Deletes the local database file and performs a runtime unlink of the database-file. Basically factory resets the program.

## Aliases

```
General

gistr = gstr = gist

gist -h = gist --help = gist help
gist -v = gist --version = gist version

gist add = gist create = gist creategist
gist add-dir = gist add-folder = gist add-directory

gist list = gist gists
gist find = gist search
gist show = gist details
gist pull = gist get

gist add-token = gist save-token = gist set-token
gist remove-token = gist delete-token = gist unset-token
gist show-token = gist display-token = gist view-token

gist import-db = gist get-db

gist purge-db = gist remove-db = gist delete-db


When creating gists:

Bundle multiple files into a single gist

-b = --bundle

Gist description

-d="" = --desc="" = --description=""

Verbose logging

-v = --verbose


When showing gist details:

Output gist details to file (defaults to terminal output)

--tofile


When pulling gists:

To output pulled gists to some other directory than the current working directory

-d="" = --dir="" = --directory=""


When exporting database:

-f="" = --tofile=""


When importing database:

-f="" = --file=""

```

## Authentication

Optionally, or if 60 anonymous gists per hour is not enough for you, you can use an access-token based authentication with gistr.

Simply generate a new access-token for your github account by following the instructions here: https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/

And use command `gist add-token --token="yourtokenhere"` to let gistr use it for gisting.

The only permission or scope you need to grant for the access-token is the `gist` one, obviously.

## NPM

https://www.npmjs.com/package/gistr

## Screenshots

### Gisting a file

![](https://i.imgur.com/cYEm3PT.png)

### Listing and searching for gists

![](https://i.imgur.com/cjLARbF.png)
