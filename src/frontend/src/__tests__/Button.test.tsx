import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Button from "@/components/Button";

describe("Button", () => {
  it("renderiza el texto", () => {
    render(<Button>Canjear</Button>);
    expect(screen.getByRole("button", { name: "Canjear" })).toBeInTheDocument();
  });

  it("llama onClick al hacer clic", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("se deshabilita cuando loading", () => {
    render(<Button loading>Procesando</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });

  it("no llama onClick cuando está deshabilitado", async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>No</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });
});
