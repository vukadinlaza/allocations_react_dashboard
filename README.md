# Allocations

## Pre-Commit hooks

You should first install `pre-commit` via `brew` if you haven't already:

```bash
brew install pre-commit
```

Then from the project root of our app run:

```bash
pre-commit install
```

## Project setup

The app runs on node version 13.x and can safely be run up to node 14.x

A good way to manage different node versions is to use [nvm](https://github.com/nvm-sh/nvm)

### Installation

We use aws to manage our environment secrets. In order to get your env secrets you'll need to log in through the [cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

You'll need to input two aws secrets: AWS Access Key ID and AWS Secret Access Key

```
$ aws configure
```

These can be found in the Secure Notes of [1Password](https://my.1password.com/vaults/yex6mw6d7e4sskjmkliea6fjya/003/pnfp5v3prg77wwstn67o5mzd5m).

After AWS CLI has been setup, you'll need to run this command to pull these secrets and write them to a `.env.local` file.

```
yarn predev
```

use `yarn` to install the project dependencies:

```bash
yarn install
```

## Development

### Start Allocations dashboard

```bash
yarn run dev
```

## Creating Branches

We create branches from `staging` and make PRs using GitHub

### Use these conventions when creating a new branch

Bugs: fix/BRANCH-NAME

Features: feat/BRANCH-NAME

## Deployment

### Compiles and minifies for production

```bash
yarn run build
```
