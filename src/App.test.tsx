import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the main archive sections", () => {
    render(<App />);

    expect(screen.getByText("What remains")).toBeInTheDocument();
    expect(screen.getAllByText("Photographs").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Listening").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Traces").length).toBeGreaterThan(0);
  });
});
