#registry-switch

Utility to make it easy to switch between npm registries.

##Install
```sh
npm install registry-switch -g
```

##Usage
Run the programm with

```sh
registry-switch {command} {args}
```

-- or short version --

```sh
regsw {command} {args}
```

Accepted commands:

Command            | Description
-------------------|------------
[list](#list)      | Display a list of avaliable registries
[add](#add)        | Add a new registry
[use ](#use)       | A a registry
[remove](#remove)  | Removes a registry


###<a name="list"></a>list
Provides a listing of the registries you have in your .npmregs folder.
```sh
registry-switch list
```

###<a name="add"></a>add
Adds a new registry to you .npmregs folder. You can use the optional --name switch to specify a name for the registry e.g. npm-public. The default name will be derived from the url.

```sh
registry-switch add [--name reg-name] url
```

###<a name="use"></a>use
Uses a registry in your .npmregs folder by crreating a sym link from $HOME/.npmrc to the appropriate file in .npmregs. Name should be the name of a file that exists in ~/.npmregs

```sh
registry-switch use name
```

###<a name="remove"></a>remove
Deletes a registry file from your .npmregs folder
```sh
registry-switch remove name
```


