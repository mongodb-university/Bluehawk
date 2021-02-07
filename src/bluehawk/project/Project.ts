// Project represents a directory of files to be processed by bluehawk.
export interface Project {
  // The root path into the project.
  rootPath: string;

  // An optional collection of patterns of files to be ignored, a la gitignore.
  ignores?: string[];
}
