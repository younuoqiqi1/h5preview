export enum DeviceType {
  MOBILE = 'MOBILE',
  TABLET = 'TABLET',
  DESKTOP = 'DESKTOP'
}

export interface Device {
  id: string;
  name: string;
  width: number;
  height: number;
  type: DeviceType;
}

export interface CodeSnippet {
  html: string;
}

export interface GenerationConfig {
  prompt: string;
}