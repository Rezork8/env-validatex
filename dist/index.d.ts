export type Constraint = {
    type: "number";
    required: boolean;
    min?: number | null;
    max?: number | null;
    default?: number | null;
} | {
    type: "string";
    required: boolean;
    regex?: RegExp | null;
    default?: string | null;
} | {
    type: "boolean";
    required: boolean;
    default?: boolean | null;
} | {
    type: "enum";
    required: boolean;
    values: string[];
    default?: string | null;
};
export type Constraints = Record<string, Constraint>;
export type EnvValidatexConfig = {
    basePath?: string;
    files?: string[] | ((env: NodeJS.ProcessEnv) => string[]);
    exitOnError?: boolean;
    applyDefaults?: boolean;
    silent?: boolean;
};
export declare class EnvValidatex {
    private readonly config;
    private readonly constraints;
    constructor(constraints: Constraints, config: EnvValidatexConfig);
    loadAndValidate(): void | string[];
    validate(): void | string[];
}
