# Participatory Policymaking

![GitHub](https://img.shields.io/github/license/CodeForBuffalo/participatory-policy-making)

## How to Develop Locally

### Tech Stack

-   Django
-   Vue (Nuxt)

### Requirements

Make sure these are installed on your machine.

-   [Python](https://www.python.org/downloads/) **3.8**
-   [Node.js](https://nodejs.org/en/) with **npm 6.14**

We use **npm scripts** to speed up development. We suggest using the free code editor [Visual Studio Code](https://code.visualstudio.com/). The repo has a few recommended (though not essential) VSCode extensions and settings that aim for more harmonious and productive development.

### Clone repository onto your machine

Open terminal in project's root directory.

```
$ PATH\TO\REPO\participatory-policy-making>
```

### Setup environment automatically

```
npm run setup
```

This script automatically:

1. Installs [concurrently](https://www.npmjs.com/package/concurrently) using npm
    - Needed to optionally run both frontend and backend servers using a single command
1. Installs [pipenv](https://github.com/pypa/pipenv) using pip
    - Manages Python virtual environments and dependencies. [Learn more about pipenv.](https://realpython.com/pipenv-guide/)
1. Runs the Python and Django setup in the **backend directory**
    - Creates a Python virtual environment using pipenv
    - Installs dependencies from `backend/Pipfile.lock`
    - Migrates sqlite3 database for Django
1. Runs the Nuxt setup in the **frontend directory**
    - Installs dependencies from `frontend/package.json`

### Start servers

You can run the frontend and backend servers concurrently using a single command
`npm start`

**OR**

You can run the servers separately with different commands from two terminals.

`npm run backend` will start the Django API at [http://localhost:8000/](http://localhost:8000/)

`npm run frontend` will start the Nuxt app at [http://localhost:3000/](http://localhost:3000/)

## License

The project is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in this project’s codebase, issue trackers, chat rooms and mailing lists is expected to follow the Code for America [code of conduct](https://brigade.codeforamerica.org/about/code-of-conduct).
