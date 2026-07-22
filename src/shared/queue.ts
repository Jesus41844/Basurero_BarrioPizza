import { Queue, Worker } from "bullmq";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
};

export const reciclajeQueue = new Queue("reciclaje-queue", { connection });

export function createWorker(processor: (job: any) => Promise<void>) {
  return new Worker("reciclaje-queue", processor, {
    connection,
    concurrency: 5,
  });
}
