export class MessageHandler {
  private static instance: MessageHandler;
  private _errorsList: ErrorMessage[] = [];
  private _infoList: NonErrorMessage[] = [];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getMessageHandler(): MessageHandler {
    if (!MessageHandler.instance) {
      MessageHandler.instance = new MessageHandler();
    }
    return MessageHandler.instance;
  }

  get errorList(): ErrorMessage[] {
    return this._errorsList;
  }

  get infoList(): NonErrorMessage[] {
    return this._infoList;
  }

  public addWarning(...text: string[]): void {
    this._infoList.push(new WarningMessage(...text));
  }

  public addError(...text: string[]): void {
    this._errorsList.push(new ErrorMessage(...text));
  }

  public addImportant(...text: string[]): void {
    this._infoList.push(new ImportantMessage(...text));
  }

  public addInformational(...text: string[]): void {
    this._infoList.push(new InfoMessage(...text));
  }
}

class DiagnosticMessage {
  messageType: string;
  prefix = "";
  message: string[];
  constructor(...message: string[]) {
    this.message = message;
  }
}

export class WarningMessage extends DiagnosticMessage {
  messageType: "warning";
  prefix: "\n⚠️\t";
}

export class ImportantMessage extends DiagnosticMessage {
  messageType: "important";
  prefix: "\n❗\t";
}

export class InfoMessage extends DiagnosticMessage {
  messageType: "info";
}

export class ErrorMessage extends DiagnosticMessage {
  messageType: "error";
}

type NonErrorMessage = WarningMessage | ImportantMessage | InfoMessage;
