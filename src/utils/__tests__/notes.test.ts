import { getNotes } from "utils/notes";
import { ChainId } from "@celo-tools/use-contractkit";

describe("getNotes", () => {
  it("should work for 0", () => {
    const { notes, amount } = getNotes("0", "celo", ChainId.Alfajores);
    expect(notes.length).toBe(0);
    expect(amount).toBe(0);
  });

  it("should work for (0,1)", () => {
    for (let i = 1; i < 10; i++) {
      const { notes, amount } = getNotes(`0.${i}`, "celo", ChainId.Alfajores);
      expect(notes.length).toBe(i);
      expect(amount).toBe(`0.${i}`);
    }
  });

  it("should work for 16.9", () => {
    const { notes, amount } = getNotes("16.9", "celo", ChainId.Alfajores);
    expect(notes.length).toBe(25);
    expect(amount).toBe("16.9");
  });

  it("should work for 100", () => {
    const { notes, amount } = getNotes("100", "celo", ChainId.Alfajores);
    expect(notes.length).toBe(25);
    expect(amount).toBe("25");
  });

  it("should work for 0.99999999", () => {
    const { notes, amount } = getNotes("0.99999999", "celo", ChainId.Alfajores);
    expect(notes.length).toBe(9);
    expect(amount).toBe("0.9");
  });
});
