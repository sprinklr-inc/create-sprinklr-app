# Create Sprinklr App

Create Sprinklr App provides a way to quickly get started on integrating custom components inside Sprinklr. To get started we simply need to run

```
$ npx @sprinklrjs/create-sprinklr-app
```

This will prompt you for some information needed to bootstrap the application. Once you are done this will create a folder with an application. If you open this folder, you will see a `manifest.json` file at the root of your application which will look something like this -

```json
{
  "name": "my-custom-app",
  "version": "0.1.0",
  "basePath": "http://localhost:3000",
  "integrationType": "VIRTUALIZED",
  "widgets": [
    {
      "id": "todo",
      "title": "Todo List",
      "url": "/todo",
      "scopes": ["RECORD_PAGE"]
    }
  ]
}
```

### Manifest.json

#### `name`

Name of your custom application

#### `version`

Current version of the application. Sprinklr follows [semantic versioning](https://semver.org/)

#### `basePath`

Optional parameter indicating the base URL from where the application is being served. This is useful while developing your application to quickly test your compoents.

#### `widgets`

Array of the custom components to be added. Each component config object looks something like this

```json
{
  "id": "todo",
  "title": "Todo List",
  "url": "/todo",
  "scopes": ["RECORD_PAGE"],
  "props": {
    "height": "500px"
  }
}
```

`id`
Id of the custom component.

`title`
Name of the component.

`url`
Relative url of the component. This is appended to the basePath of where the application is hosted, to render the custom component.

`scopes`
In what areas of application to surface this component. Currently only RECORD_PAGE is supported.

`props`
Properties to be passed to the component. For eg to set a fixed height for your component pass the height props as follows

```json
"props": {
  "height": "500px"
}
```
