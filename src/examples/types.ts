export interface ExampleFile {
  key: string;
  label: string;
  content: string;
}

export interface ExampleCategory {
  key: string;
  label: string;
  files: ExampleFile[];
}
