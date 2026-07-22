import { Request, Response } from "express";

type EventCallback = (data: any) => void;
const clients = new Set<EventCallback>();

export function publishEvent(event: string, payload: any) {
  const data = JSON.stringify({ event, payload });
  clients.forEach((cb) => cb(data));
}

export function sseHandler(req: Request, res: Response) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const send = (raw: string) => {
    res.write(`data: ${raw}\n\n`);
  };

  clients.add(send);
  send(JSON.stringify({ event: "connected", message: "SSE conectado" }));

  req.on("close", () => {
    clients.delete(send);
  });
}
