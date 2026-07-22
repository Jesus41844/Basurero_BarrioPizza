import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Input from "@/components/Input";

describe("Input", () => {
  it("renderiza con label y asociación", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("muestra mensaje de error", () => {
    render(<Input label="Email" error="Campo requerido" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Campo requerido");
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  it("muestra hint cuando no hay error", () => {
    render(<Input label="Email" hint="Ingresa tu email" />);
    expect(screen.getByText("Ingresa tu email")).toBeInTheDocument();
  });

  it("actualiza valor al escribir", async () => {
    render(<Input label="Nombre" />);
    const input = screen.getByLabelText("Nombre");
    await userEvent.type(input, "Juan");
    expect(input).toHaveValue("Juan");
  });
});
