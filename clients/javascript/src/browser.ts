import { ClickerProcess } from './clicker';
import { BiDiClient } from './bidi';
import { Vibe } from './vibe';

export interface LaunchOptions {
  headless?: boolean;
  port?: number;
  executablePath?: string;
}

export const browser = {
  async launch(options: LaunchOptions = {}): Promise<Vibe> {
    const { headless = true, port, executablePath } = options;

    // Start the clicker process
    const process = await ClickerProcess.start({
      headless,
      port,
      executablePath,
    });

    // Connect to the proxy
    const client = await BiDiClient.connect(`ws://localhost:${process.port}`);

    return new Vibe(client, process);
  },
};
