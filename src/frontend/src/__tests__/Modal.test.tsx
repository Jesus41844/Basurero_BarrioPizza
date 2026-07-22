import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Modal from "@/components/Modal";

describe("Modal", () => {
  it("no se muestra cuando open=false", () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="Test">
        <p>Contenido</p>
      </Modal>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("muestra título y contenido cuando open=true", () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Mi Modal">
        <p>Contenido del modal</p>
      </Modal>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Mi Modal")).toBeInTheDocument();
    expect(screen.getByText("Contenido del modal")).toBeInTheDocument();
  });

  it("tiene botón de cerrar con aria-label", () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Test">
        <p>Ok</p>
      </Modal>
    );
    expect(screen.getByLabelText("Cerrar")).toBeInTheDocument();
  });

  it("llama onClose al hacer clic en cerrar", async () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Test">
        <p>Ok</p>
      </Modal>
    );
    await userEvent.click(screen.getByLabelText("Cerrar"));
    expect(onClose).toHaveBeenCalled();
  });
});
