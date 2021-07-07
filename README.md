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

- You will need an .env file, Lance will provide this.

The app runs on node version 13.x and can safely be run up to node 14.x

A good way to manage different node verions is to use [nvm](https://github.com/nvm-sh/nvm)

### Installation

use `npm` to install the project dependencies:

```bash
npm install
```

## Development

### Start Allocations dashboard

```bash
npm run dev
```

## Creating Branches

We create branches from `staging` and make PRs using GitHub

### Use these conventions when creating a new branch

Bugs: fix/BRANCH-NAME

Features: feat/BRANCH-NAME

## Deployment

### Compiles and minifies for production

```bash
npm run build
```
