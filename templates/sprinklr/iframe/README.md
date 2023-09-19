# Create Sprinklr App

Create Sprinklr App provides a way to quickly get started on integrating custom components inside Sprinklr. To get started we simply need to run

```
$ npx @sprinklrjs/create-sprinklr-app
```

This will prompt you for some information needed to bootstrap your application. Once you are done this will create a folder with a basic hello world custom component. If you open this folder, you will see a `manifest.json` file at the root of your application which will look something like this -

```json
{
  "name": "my-custom-app",
  "version": "0.1.0",
  "basePath": "http://localhost:3000",
  "widgets": [
    {
      "id": "hello-world",
      "title": "Hello World",
      "url": "/hello-world"
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

Optional parameter indicating the base URL from where the application is being served. While developing your application set this to `localhost` to quickly test your changes. This can also be used if you want to self host your application from a custom domain.

#### `widgets`

Array of the custom components to be added. Each component config object looks something like this

```json
{
  "id": "hello-world",
  "title": "Hello World",
  "url": "/hello-world",
  "props": {
    "height": "500px"
  }
}
```

`id`: A unique id for your custom component.

`title`: Name of the component.

`Url`: Relative url of the component. This is appended to the basePath of where the application is hosted, to render the custom component.

`props`: Properties to be passed to the component. For eg to set a fixed height for your component set the height props as follows

```json
"props": {
    "height": "500px"
}
```
