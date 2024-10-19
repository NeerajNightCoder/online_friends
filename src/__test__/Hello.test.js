// src/components/HelloDummy.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import HelloDummy from "../Hello";

describe("HelloDummy Component", () => {
  it("renders 'Hello Dummy'", () => {
    render(<HelloDummy />);
    const helloElement = screen.getByText(/hello dummy/i); // Use regex for case-insensitive matching
    expect(helloElement).toBeInTheDocument(); // Assert that the element is in the document
  });
});
