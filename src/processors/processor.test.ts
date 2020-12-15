import Processor from "./Processor";

describe("processor", () => {
  it("allows subscriptions and pushed events to listeners", () => {
    const spy = jest.fn();
    Processor.subscribe(spy);
    Processor.publish("foo");
    expect(spy).toHaveBeenCalledWith("foo");
  });
});
