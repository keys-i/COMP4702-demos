import { render, screen } from "@testing-library/react";
import Week7 from "./Week7";

test("renders learn react link", () => {
  render(<Week7 />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
