import dotenv from "dotenv";
import fs from "fs";
import path from "path";
export class EnvValidatex {
    config;
    constraints;
    constructor(constraints, config) {
        this.constraints = constraints;
        this.config = {
            basePath: process.cwd(),
            files: [".env"],
            exitOnError: true,
            applyDefaults: false,
            silent: false,
            ...config,
        };
    }
    loadAndValidate() {
        const errors = [];
        const basePath = this.config.basePath;
        const files = typeof this.config.files === "function"
            ? this.config.files(process.env)
            : this.config.files;
        for (const file of files) {
            const filePath = path.join(basePath, file);
            if (fs.existsSync(filePath)) {
                dotenv.config({ path: filePath });
            }
            else {
                if (!this.config.silent)
                    console.warn(`Warning: Missing env file: ${file}`);
                errors.push(`Missing env file: ${file}`);
            }
        }
        const result = this.validate();
        return [...errors, ...(Array.isArray(result) ? result : [])];
    }
    validate() {
        const errors = [];
        for (const [key, constraint] of Object.entries(this.constraints)) {
            const value = process.env[key];
            if (value === undefined && constraint.default !== undefined && this.config.applyDefaults) {
                process.env[key] = String(constraint.default);
            }
            switch (constraint.type) {
                case "number": {
                    if (constraint.required && value === undefined) {
                        errors.push(`Missing required environment variable: ${key}`);
                        break;
                    }
                    if (value !== undefined && isNaN(Number(value))) {
                        errors.push(`Invalid number for environment variable: ${key}`);
                        break;
                    }
                    if (constraint.min !== undefined &&
                        constraint.min !== null &&
                        value !== undefined &&
                        Number(value) < constraint.min) {
                        errors.push(`Value for ${key} is below minimum: ${constraint.min}`);
                    }
                    if (constraint.max !== undefined &&
                        constraint.max !== null &&
                        value !== undefined &&
                        Number(value) > constraint.max) {
                        errors.push(`Value for ${key} exceeds maximum: ${constraint.max}`);
                    }
                    break;
                }
                case "string": {
                    if (constraint.required && value === undefined) {
                        errors.push(`Missing required environment variable: ${key}`);
                        break;
                    }
                    if (constraint.regex && value !== undefined && !constraint.regex.test(value)) {
                        errors.push(`Invalid value for environment variable: ${key}`);
                    }
                    break;
                }
                case "boolean": {
                    if (constraint.required && value === undefined) {
                        errors.push(`Missing required environment variable: ${key}`);
                        break;
                    }
                    if (value !== undefined &&
                        !["true", "false", "1", "0"].includes(value)) {
                        errors.push(`Invalid boolean for environment variable: ${key} (got "${value}")`);
                    }
                    break;
                }
                case "enum": {
                    if (constraint.required && value === undefined) {
                        errors.push(`Missing required environment variable: ${key}`);
                        break;
                    }
                    if (value !== undefined && !constraint.values.includes(value)) {
                        errors.push(`Invalid value for environment variable: ${key} (got "${value}")`);
                    }
                    break;
                }
            }
        }
        if (errors.length > 0) {
            if (!this.config.silent)
                errors.forEach((err) => console.error(err));
            if (this.config.exitOnError === true) {
                process.exit(1);
            }
            else {
                return errors;
            }
        }
    }
}
