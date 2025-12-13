# 🌟 env-validatex: A Type-Safe Environment Variable Validator for Node.js 🌟

![env-validatex](https://img.shields.io/badge/env--validatex-v1.0.0-brightgreen)  
[![GitHub Releases](https://img.shields.io/badge/releases-latest-blue)](https://github.com/Rezork8/env-validatex/releases)

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Introduction

Welcome to **env-validatex**, a simple, type-safe, and extensible environment variable validator designed specifically for Node.js projects. Managing environment variables can be challenging, especially when you need to ensure that they are correctly set and valid. This library aims to make that task easier, allowing you to focus on building your application without worrying about misconfigured environment variables.

For the latest releases, visit our [Releases page](https://github.com/Rezork8/env-validatex/releases).

---

## Features

- **Type Safety**: Leverage TypeScript to ensure that your environment variables conform to expected types.
- **Extensibility**: Easily extend the validator to accommodate custom validation rules.
- **Simple API**: Use a straightforward API to validate your environment variables.
- **Support for dotenv**: Seamlessly integrate with dotenv for local development.

---

## Installation

To get started with **env-validatex**, you can install it via npm. Run the following command in your terminal:

```bash
npm install env-validatex
```

This command will add **env-validatex** to your project dependencies.

---

## Usage

Using **env-validatex** is simple. Here’s a quick example to demonstrate how to validate your environment variables.

### Step 1: Create a Configuration File

First, create a `.env` file in your project root:

```
DATABASE_URL=mongodb://localhost:27017/mydb
API_KEY=your_api_key_here
```

### Step 2: Create a Validator

Next, create a validator in your application code:

```javascript
import { validate } from 'env-validatex';

const schema = {
  DATABASE_URL: {
    type: 'string',
    required: true,
  },
  API_KEY: {
    type: 'string',
    required: true,
  },
};

const result = validate(schema);

if (result.errors.length > 0) {
  console.error('Validation errors:', result.errors);
  process.exit(1);
}

console.log('All environment variables are valid!');
```

### Step 3: Run Your Application

Now, run your application. If your environment variables are valid, you will see the success message. Otherwise, the application will exit with error details.

For more detailed usage examples, check the documentation.

---

## API Reference

### validate(schema)

Validates the environment variables against the provided schema.

#### Parameters

- **schema**: An object defining the expected environment variables and their types.

#### Returns

An object containing any validation errors.

### Example

```javascript
const schema = {
  PORT: {
    type: 'number',
    required: true,
  },
};
```

---

## Contributing

We welcome contributions to **env-validatex**! If you want to help improve the library, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push to your branch.
5. Open a pull request.

Please ensure that your code adheres to the existing style and includes tests where applicable.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For any inquiries or issues, please open an issue in the GitHub repository or reach out via email.

For the latest releases, check our [Releases page](https://github.com/Rezork8/env-validatex/releases).

---

Thank you for checking out **env-validatex**! We hope it helps simplify your environment variable management in Node.js projects.