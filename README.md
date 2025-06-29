# hmpl-dom

[![npm-version](https://img.shields.io/npm/v/hmpl-dom?logo=npm&color=fff)](https://www.npmjs.com/package/hmpl-dom)

`hmpl-dom` is a library for integrating HMPL templates directly into the DOM. It allows you to use templates written with [hmpl-js](https://www.npmjs.com/package/hmpl-js) right in your HTML documents using the `<template>` tag, and automatically mounts them into the DOM.

> Requires `hmpl-js` version 3.0.0 or higher.

## Installation

```bash
npm install hmpl-dom
```

## Usage

Add a template to your HTML file using the `<template>` tag and the `data-hmpl` or `hmpl` attribute:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example</title>
</head>
<body>
  <main>
    <template data-hmpl data-option-id="my-component-option">
      <div>
        {{#request src="/api/my-component.html"}}
          {{#indicator trigger="pending"}}
            Loading...
          {{/indicator}}
        {{/request}}
      </div>
    </template>
  </main>
  <script src="https://unpkg.com/json5/dist/index.min.js"></script>
  <script src="https://unpkg.com/dompurify/dist/purify.min.js"></script>
  <script src="https://unpkg.com/hmpl-js/dist/hmpl.min.js"></script>
  <script src="https://unpkg.com/hmpl-dom/dist/hmpl-dom.min.js"></script>
</body>
</html>
```

## Options

Each option object for `init` can contain:

- **id**: (string) — Unique identifier for the template, must match the `data-option-id` in HTML.
- **value**: (object)
  - **compile**: (object) — Compile options for HMPL (e.g., `{ memo: true }`).
  - **templateFunction**: (object) — Data or parameters to be passed to the template function.

Example:

```javascript
init([
  {
    id: "1",
    value: {
      compile: { memo: true },
      templateFunction: { credentials: "include" }
    }
  }
]);
```

## Important Notes

- Each `<template>` must contain exactly one root element.
- The `data-option-id` attribute is required and cannot be empty.
- For every `optionId`, a corresponding option must be defined in the `init` call.

## Example

```html
<template data-hmpl data-option-id="clicker-option">
  <div>
    <button data-action="increment" id="btn">Click!</button>
    <div>Clicks: {{#request src="/api/clicks" after="click:#btn"}}{{/request}}</div>
  </div>
</template>
```

```javascript
import { init } from "hmpl-dom";

init([
  {
    id: "clicker-option",
    value: {
      compile: { memo: true },
      templateFunction: ({ request: { event } }) => ({
         body: JSON.stringify({ action: event.target.getAttribute("data-action") })
    })
    }
  }
]);
```

## Changelog

See the [GitHub releases page](https://github.com/hmpl-language/hmpl-dom/releases) for changes.

## Contributing

We have a [Contributing Guide](https://github.com/hmpl-language/hmpl/blob/main/CONTRIBUTING.md) that describes the main steps for contributing to the project.

Thank you to all the people who have already contributed to HMPL, or related projects!

## License

This project is licensed under the [MIT License](https://github.com/hmpl-language/hmpl-dom/blob/main/LICENSE).
