# gistr

**NOT YET READY**

Gistr. View, save and pull single files from Github's Gists.

[![Build Status](https://travis-ci.com/ahvonenj/gistr.svg?token=CTLNy9ndTqFfFx23p9q1&branch=master)](https://travis-ci.com/ahvonenj/gistr)

## Why?

gistr is designed to be a small and a simple tool to quickly pull files from Github's Gists. You may have that useful `index.css` or something else saved, which you always use as a base for all your projects, but it is a hassle to find and fetch all those various snippets, as well as utility- and base-files every time, as they have probably been scattered among various different projects and gists.

Simply put - the goal, when using this tool, is that you can start building your own "database" of different kinds of files, which you can then easily fetch for your other projects.

## Gists?

As I could not figure out anything better to use and I don't want to host files on a server of my own - I decided to use Github's Gists as a starting storage for files.

## Install

`npm install -g gistr`

## Usage

### Aliases

```
General

gistr = gstr = gist

gist -h = gist --help
gist -v = gist --version

gist add = gist create = gist creategist

gist list = gist gists
gist find = gist search
gist show = gist details
gist pull = gist get

gist add-token = gist save-token
gist remove-token = gist delete-token
gist show-token = gist display-token


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

```

### Create a gist

`gist add <file1> <file2> ... [<-b (1 gist, n files)>] [<-d="" (Gist description)>] [<-v (Verbose logging)>]`

Uploads one or more files as one or more gists to Github and saved a reference to those files into a local database-file.

Example:  
`gist add myfile1.txt myfile2.txt --bundle -d="Gist description" -v`

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

`gist pull <Gist #>`

Pulls a gist and all associated files to that gist from Github's Gists.

Example:  
`gist pull 3` (Pulls the gist and writes the files into cwd)  
`gist pull 2 -d="somefolder"` (Pulls the gist and writes the files into `cwd/somefolder/`)



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
