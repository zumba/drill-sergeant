# Drill Sergeant

[![Build Status](https://travis-ci.org/zumba/drill-sergeant.png?branch=master)](https://travis-ci.org/zumba/drill-sergeant)

Notify via email when github pull requests become stale. This is particularly useful for teams utilizing the github flow. This will send a report to a specified email (or emails) of any pull requests that are over the specified stale time.

## Install

```
npm install -g drill-sergeant
```

## Run

This is intended to be run via a crontab or other scheduled task runner.

A typical command line run:

```bash
$ export GITHUB_TOKEN='<your token here>'
$ drillsergeant -e "youremail@address" -r "user/repository,user/repository2"
```

## Configuration

The environment variable `GITHUB_TOKEN` must be set with a valid github oauth token in order to read the pull requests.

## Options

See `drillsergeant -h` for all available options.
