# EnvValidatex

**EnvValidatex** is a simple, type-safe, and extensible environment variable validator for Node.js projects. It supports `.env` file loading, type checking, value constraints, default values, and more.

---

## Features

- **Type validation**: Supports `string`, `number`, `boolean`, and `enum` types.
- **Constraint validation**: Regex, min/max, enum values, required/optional.
- **Default values**: Optionally apply defaults to missing variables.
- **Multiple .env files**: Load and validate from one or more files.
- **Customizable behavior**: Control error handling, file loading, and output.

---

## Installation

```
npm install env-validatex
```

---

## Usage

### 1. Define your constraints

```
import { EnvValidatex } from "env-validatex";

const constraints = {
  PORT: { type: "number", required: true, min: 1024, max: 65535 },
  NODE_ENV: { type: "enum", required: true, values: ["development", "production", "test"] },
  DEBUG: { type: "boolean", required: false, default: false },
  API_KEY: { type: "string", required: true, regex: /^[A-Z0-9]{32}$/ },
};
```

### 2. Create the validator

```
const validator = new EnvValidatex(constraints, {
  basePath: process.cwd(), // optional, defaults to process.cwd()
  files: [".env"],         // optional, defaults to [".env"]
  exitOnError: true,       // optional, defaults to true
  applyDefaults: true,     // optional, defaults to false
  silent: false,           // optional, defaults to false
});
```

### 3. Load and validate

```
// Loads .env files and validates variables
validator.loadAndValidate();
```

Or, if you want to handle errors yourself:

```
const errors = validator.loadAndValidate();
if (errors && errors.length > 0) {
  // handle errors
}
```

---

## API

### `EnvValidatex(constraints, config)`

- **constraints**: An object describing each environment variable and its constraints.
- **config**: (optional) Configuration for file loading and validation.

#### Constraint Types

| Type     | Options                                                                                 |
|----------|----------------------------------------------------------------------------------------|
| number   | `required`, `min`, `max`, `default`                                                    |
| string   | `required`, `regex`, `default`                                                         |
| boolean  | `required`, `default`                                                                  |
| enum     | `required`, `values` (array of allowed strings), `default`                             |

#### Example

```
const constraints = {
  PORT: { type: "number", required: true, min: 1024, max: 65535 },
  DEBUG: { type: "boolean", required: false, default: false },
  MODE: { type: "enum", required: true, values: ["dev", "prod"] },
  SECRET: { type: "string", required: true, regex: /^[A-Z0-9]{32}$/ },
};
```

#### Config Options

| Option         | Type                       | Default           | Description                                 |
|----------------|---------------------------|-------------------|---------------------------------------------|
| basePath       | `string`                  | `process.cwd()`   | Base directory for .env files               |
| files          | `string[]` or function    | `[".env"]`        | .env files to load (or function returning array) |
| exitOnError    | `boolean`                 | `true`            | Exit process on validation error            |
| applyDefaults  | `boolean`                 | `false`           | Set default values in `process.env`         |
| silent         | `boolean`                 | `false`           | Suppress warnings and errors                |

---

### Methods

#### `loadAndValidate(): void | string[]`

- Loads `.env` files and validates variables.
- Returns `undefined` if all is valid, or an array of error messages.

#### `validate(): void | string[]`

- Validates current `process.env` against constraints.
- Returns `undefined` if all is valid, or an array of error messages.

---

## Boolean Handling

- Accepts: `"true"`, `"false"`, `"1"`, `"0"` (case-sensitive).
- **Note:** `"TRUE"`, `"False"`, etc. are **not** accepted.

---

## Example

```
import { EnvValidatex } from "env-validatex";

const constraints = {
  PORT: { type: "number", required: true, min: 3000, max: 9000 },
  DEBUG: { type: "boolean", required: false, default: false },
  ENV: { type: "enum", required: true, values: ["dev", "prod"] },
};

const validator = new EnvValidatex(constraints, {
  files: [".env", ".env.local"],
  applyDefaults: true,
});

const errors = validator.loadAndValidate();
if (errors && errors.length > 0) {
  console.error("Environment validation failed:", errors);
  process.exit(1);
}
```

---

## License

MIT

---

## Contributing

Pull requests and issues are welcome!

---

## FAQ

**Q: What happens if a required variable is missing?**  
A: An error is thrown (or returned), and the process exits unless `exitOnError: false` is set.

**Q: Can I use multiple .env files?**  
A: Yes! Use the `files` option.

**Q: Are default values applied to `process.env`?**  
A: Only if `applyDefaults: true` is set.