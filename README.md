# Strapi plugin json-gui

A custom Strapi field for managing complex JSON through an intuitive graphical user interface.

## Installation

To install this plugin, you need to add an NPM dependency to your Strapi application:

```
# Using Yarn
yarn add strapi-plugin-json-gui

# Or using NPM
npm i strapi-plugin-json-gui
```

Then, you'll need to build your admin panel:

```
# Using Yarn
yarn build

# Or using NPM
npm run build
```

## Configuration

After installation you need enable the plugin in your `./config/plugins.js` file:

```js
module.exports = ({ env }) => ({
  // ...
  'json-gui': {
    enabled: true,
  },
  // ...
});
```

## Usage

After installation and configuration you will find a new field type in the content type builder.

![json-gui screenshot](./screenshots/strapi-plugin-json-gui.png)

then you can add the JSON schema for the field. You can add/edit/clone/delete any valid JSON schema.

![json-gui screenshot](./screenshots/json-gui.png)

in this case the API will return

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "menu": {
        "menu": [
          {
              "title": "Home",
              "url": "/home"
          },
          {
              "title": "About",
              "url": "/about"
          }
        ]
      }
    }
  }
}
```

### Bug Reporting and Contributions

I'm committed to continual improvement. If you come across bugs, have suggestions, or want to request new features, please report them in my [GitHub repository](https://github.com/daniele-benedetto/strapi-plugin-json-gui/issues). Your input is incredibly valuable and helps me enhance the plugin for everyone.

## Upcoming Features in Development

I'm currently working on three new features for the plugin:

1. **Drag and Drop for JSON Elements:** Implementing the ability to drag and drop elements within the JSON for a more intuitive management.

2. **Expanding and Collapsing Objects:** Introducing options to expand or collapse objects within the JSON, improving readability and data management.

3. **Limiting Edit Permissions for Specific Users:** Providing the capability to set editing restrictions for specific users, offering greater control over data access and management.

4. **Import and Export JSON:** Adding the ability to import and export JSON files, allowing for easier data management.

These features will soon be available in the next plugin update.
