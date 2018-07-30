# Drill Sergeant

[![Build Status](https://travis-ci.org/zumba/drill-sergeant.png?branch=master)](https://travis-ci.org/zumba/drill-sergeant)

Keep track and get notified when github pull requests become stale. This is particularly useful for teams utilizing the github flow. `Drillsergeant` will send a notify of stale PRs via:

* Email
* Slack
* Github (attaching a `stale` label to the PR)

![Screen shot](https://raw.githubusercontent.com/zumba/drill-sergeant/master/label-screenshot.png)

## Install

```
npm install -g drill-sergeant
```

## Run

This is intended to be run via a crontab or other scheduled task runner.

A typical command line run:

```bash
$ GITHUB_TOKEN='<your token here>' drillsergeant -e "youremail@address" -r "user/repository,user/repository2"
```

If you want it to label the PR as stale:

```bash
$ drillsergeant -l -r "user/repository"
```

If you want to send it to slack:

```bash
$ drillsergeant -r "user/repository" --slack-webhook https://your-slack-channel-webhook-url
```

## Configuration

The environment variable `GITHUB_TOKEN` must be set with a valid github oauth token in order to read the pull requests.
For attaching labels, the token needs to have write access to the repo being scanned.

## Options

See `drillsergeant -h` for all available options.
