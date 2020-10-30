export const errorsList: errorMessage[] = [];
export const infoList: diagnosticMessage[] = [];

class warningMessage {
  messageType: "warning";
  prefix: "\n⚠️\t";
  message: string[];
  constructor(...message: string[]) {
    this.message = message;
  }
}

class importantMessage {
  messageType: "important";
  prefix: "\n❗\t";
  message: string[];
  constructor(...message: string[]) {
    this.message = message;
  }
}

class infoMessage {
  messageType: "info";
  prefix: "";
  message: string[];
  constructor(...message: string[]) {
    this.message = message;
  }
}

class errorMessage {
  messageType: "error";
  prefix: "";
  message: string[];
  constructor(...message: string[]) {
    this.message = message;
  }
}

type diagnosticMessage = warningMessage | importantMessage | infoMessage;

export function warning(...text: string[]): void {
  infoList.push(new warningMessage(...text));
}

export function error(...text: string[]): void {
  errorsList.push(new errorMessage(...text));
}

export function important(...text: string[]): void {
  infoList.push(new importantMessage(...text));
}

export function info(...text: string[]): void {
  infoList.push(new infoMessage(...text));
}
