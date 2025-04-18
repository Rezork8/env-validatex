import { describe, it, expect } from "bun:test";
import { EnvValidatex } from "../src/index";

describe("EnvValidatex", () => {
  it("returns an error when a required environment variable is missing", () => {
    const validator = new EnvValidatex({
      TEST_VAR: {
        type: "string",
        required: true,
      },
    }, {
      exitOnError: false,
    });
    delete process.env.TEST_VAR;
    const errors = validator.validate();
    expect(errors).toBeArray();
    expect(errors).toContain("Missing required environment variable: TEST_VAR");
  });

  it("returns an error when a boolean environment variable is invalid", () => {
    const validator = new EnvValidatex({
      TEST_VAR: {
        type: "boolean",
        required: true,
      },
    }, {
      exitOnError: false,
    });
    process.env.TEST_VAR = "invalid";
    const errors = validator.validate();
    expect(errors).toBeArray();
    expect(errors).toContain(
      'Invalid boolean for environment variable: TEST_VAR (got "invalid")'
    );
  });

  it("returns an error when an enum environment variable has an invalid value", () => {
    const validator = new EnvValidatex({
      TEST_VAR: {
        type: "enum",
        values: ["value1", "value2"],
        required: true,
      },
    }, {
      exitOnError: false,
    });
    process.env.TEST_VAR = "invalid";
    const errors = validator.validate();
    expect(errors).toBeArray();
    expect(errors).toContain(
      'Invalid value for environment variable: TEST_VAR (got "invalid")'
    );
  });

  it("returns an error when a string environment variable fails regex validation", () => {
    const validator = new EnvValidatex({
      TEST_VAR: {
        type: "string",
        regex: /^[a-z]+$/,
        required: true,
      },
    }, {
      exitOnError: false,
    });
    process.env.TEST_VAR = "Invalid123";
    const errors = validator.validate();
    expect(errors).toBeArray();
    expect(errors).toContain(
      "Invalid value for environment variable: TEST_VAR"
    );
  });

  it("returns an error when a number environment variable is below the minimum", () => {
    const validator = new EnvValidatex({
      TEST_VAR: {
        type: "number",
        min: 10,
        required: true,
      },
    }, {
      exitOnError: false,
    });
    process.env.TEST_VAR = "5";
    const errors = validator.validate();
    expect(errors).toBeArray();
    expect(errors).toContain("Value for TEST_VAR is below minimum: 10");
  });

  it("returns an error when a number environment variable exceeds the maximum", () => {
    const validator = new EnvValidatex({
      TEST_VAR: {
        type: "number",
        max: 20,
        required: true,
      },
    }, {
      exitOnError: false,
    });
    process.env.TEST_VAR = "25";
    const errors = validator.validate();
    expect(errors).toBeArray();
    expect(errors).toContain("Value for TEST_VAR exceeds maximum: 20");
  });

  it("returns an error when a number environment variable is outside the allowed range", () => {
    const validator = new EnvValidatex({
      TEST_VAR: {
        type: "number",
        min: 10,
        max: 20,
        required: true,
      },
    }, {
      exitOnError: false,
    });
    process.env.TEST_VAR = "25";
    const errors = validator.validate();
    expect(errors).toBeArray();
    expect(errors).toContain("Value for TEST_VAR exceeds maximum: 20");
  });

  it("passes validation when a required string environment variable is valid", () => {
    const validator = new EnvValidatex({
      TEST_VAR: {
        type: "string",
        required: true,
      },
    },{
      exitOnError: false,
    });
    process.env.TEST_VAR = "valid";
    const errors = validator.validate();
    expect(errors).toBeUndefined();
  });

  it("passes validation when a number environment variable is within the allowed range", () => {
    const validator = new EnvValidatex({
      TEST_VAR: {
        type: "number",
        min: 10,
        max: 20,
        required: true,
      },
    },{
      exitOnError: false,
    });
    process.env.TEST_VAR = "10";
    const errors = validator.validate();
    expect(errors).toBeUndefined();
  });

  it("passes validation when a boolean environment variable is valid", () => {
    const validator = new EnvValidatex({
      TEST_VAR: {
        type: "boolean",
        required: true,
      },
    },{
      exitOnError: false,
    });
    process.env.TEST_VAR = "true";
    const errors = validator.validate();
    expect(errors).toBeUndefined();
  });

  it("passes validation when an enum environment variable has a valid value", () => {
    const validator = new EnvValidatex({
      TEST_VAR: {
        type: "enum",
        values: ["value1", "value2"],
        required: true,
      },
    },{
      exitOnError: false,
    });
    process.env.TEST_VAR = "value1";
    const errors = validator.validate();
    expect(errors).toBeUndefined();
  });

  it("passes validation when a string environment variable matches the regex", () => {
    const validator = new EnvValidatex({
      TEST_VAR: {
        type: "string",
        regex: /^[a-z]+$/,
        required: true,
      },
    },{
      exitOnError: false,
    });
    process.env.TEST_VAR = "validstring";
    const errors = validator.validate();
    expect(errors).toBeUndefined();
  });

  it("passes validation when a non-required environment variable is missing", () => {
    const validator = new EnvValidatex({
      TEST_VAR: {
        type: "string",
        required: false,
      },
    },{
      exitOnError: false,
    });
    delete process.env.TEST_VAR;
    const errors = validator.validate();
    expect(errors).toBeUndefined();
  });

  it("returns an error when a required environment variable with a default value is missing", () => {
    const validator = new EnvValidatex({
      TEST_VAR: {
        type: "string",
        required: true,
        default: "default_value",
      },
    },{
      exitOnError: false,
    });
    delete process.env.TEST_VAR;
    const errors = validator.validate();
    expect(errors).toBeArray();
  });

  it("passes validation and applies the default value when not required", () => {
    const validator = new EnvValidatex({
      TEST_VAR: {
        type: "string",
        required: false,
        default: "default_value",
      },
    },{
      exitOnError: false,
      applyDefaults: true,
    });
    delete process.env.TEST_VAR;
    const errors = validator.validate();
    expect(errors).toBeUndefined();
  });

  it("sets the default value when the environment variable is missing and applyDefaults is true", () => {
    const validator = new EnvValidatex({
      TEST_VAR: {
        type: "string",
        required: false,
        default: "default_value",
      },
    }, {
      exitOnError: false,
      applyDefaults: true,
    });
    delete process.env.TEST_VAR;
    validator.validate();
    expect(process.env.TEST_VAR as string | undefined).toBe("default_value");
  });
});