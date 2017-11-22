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


When creating gists:

Bundle multiple files into a single gist

-b = --bundle

Gist description

-d="" = --desc="" = --description=""

Verbose logging

-v = --verbose
```

### Create a gist

Uploads one or more files as one or more gists to Github and saved a reference to those files into a local database-file.

`gist add <file1> <file2> ... [<-b (1 gist, n files)>] [<-d="" (Gist description)>] [<-v (Verbose logging)>]`

Example:  
`gist add myfile1.txt myfile2.txt --bundle -d="Gist description" -v`

### List gists

Lists references to gisted files, located in a local database-file.

`gist list`

### Find gists by description or filename

Find references to gisted files, located in a local database-file.

`gist find <search>`

Example:  
`gist find gulpfile`  
`gist find "math library"`

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
