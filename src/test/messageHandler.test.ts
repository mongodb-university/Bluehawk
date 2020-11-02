import {
  MessageHandler,
  WarningMessage,
  ImportantMessage,
  InfoMessage,
  ErrorMessage,
} from "../messageHandler";

describe("MessageHandler", () => {
  let handler1: MessageHandler;
  let handler2: MessageHandler;
  beforeAll(() => {
    handler1 = MessageHandler.getMessageHandler();
    handler2 = MessageHandler.getMessageHandler();
  });

  it("handles accepting error information", () => {
    const messageContent = "foo bar biz baz";
    const expectedErrorObject = new ErrorMessage(messageContent);
    handler1.addError(messageContent);
    expect(handler1.errorList.length).toEqual(1);
    expect(handler1.errorList.shift()).toEqual(expectedErrorObject);
  });

  it("handles information messages", () => {
    const messageContent = "foo bar biz baz";
    const expectedInformationObject = new InfoMessage(messageContent);
    const expectedWarningMessage = new WarningMessage(messageContent);
    const expectedImportantMessage = new ImportantMessage(messageContent);
    handler1.addImportant(messageContent);
    handler1.addWarning(messageContent);
    handler1.addInformational(messageContent);
    expect(handler1.infoList.length).toBe(3);
    expect(handler1.infoList).toContainEqual(expectedInformationObject);
    expect(handler1.infoList).toContainEqual(expectedImportantMessage);
    expect(handler1.infoList).toContainEqual(expectedWarningMessage);
  });
  it("is a singleton", () => {
    expect(handler1 === handler2).toBeTruthy();
  });
});
