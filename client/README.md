# A ReactJS starter boilerplate

### Description

This is a boilerplate created using create-react-app, which was then ejected and added support for **CSS Modules**, **SASS** (.scss format), **MaterialUI** framework,**linting** during commit using a precommit hook and advanced inline-styles support using **Radium**

### Usage 

Install packages

```
npm i
```

Run

```
npm run start OR yarn start
```

NOTES

 * By default this was set to run on PORT 13339, you can change that in the **.env** file
 * The package.json file contains a `proxy` key-value pair which is used if you want to have a Backend. This is usefull so that in your code you can just have a path like `/api/users` instead of `http://localhost:3000/api/users`
