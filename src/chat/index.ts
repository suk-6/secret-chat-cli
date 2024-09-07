import * as readline from "readline";
import { io, Socket } from "socket.io-client";
import { Writable } from "stream";

export class Chat {
  private readonly rl: readline.Interface;
  private readonly output: Writable;
  private readonly socket: Socket;

  constructor() {
    this.output = new Writable({
      write(chunk, encoding, callback) {
        process.stdout.write(chunk, encoding);
        callback();
      }
    });

    this.rl = readline.createInterface({
      input: process.stdin,
      output: this.output
    });

    this.socket = io(process.env.CHAT_SERVER);
    this.socket.on("connect", () => {
      console.clear();
      this.output.write("Connected to server\n");

      this.rl.on("line", (message: string) => {
        if (message === "\n") return;
        this.socket.emit("send", message);
      });
      
      this.socket.on('receive', (message: string) => {
        this.output.write(`${message}\n`);
      })
    });
  }
}