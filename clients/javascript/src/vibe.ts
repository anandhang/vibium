import { BiDiClient, BrowsingContextTree, NavigationResult, ScreenshotResult } from './bidi';
import { ClickerProcess } from './clicker';

export class Vibe {
  private client: BiDiClient;
  private process: ClickerProcess | null;
  private context: string | null = null;

  constructor(client: BiDiClient, process: ClickerProcess | null) {
    this.client = client;
    this.process = process;
  }

  private async getContext(): Promise<string> {
    if (this.context) {
      return this.context;
    }

    const tree = await this.client.send<BrowsingContextTree>('browsingContext.getTree', {});
    if (!tree.contexts || tree.contexts.length === 0) {
      throw new Error('No browsing context available');
    }

    this.context = tree.contexts[0].context;
    return this.context;
  }

  async go(url: string): Promise<void> {
    const context = await this.getContext();
    await this.client.send<NavigationResult>('browsingContext.navigate', {
      context,
      url,
      wait: 'complete',
    });
  }

  async screenshot(): Promise<Buffer> {
    const context = await this.getContext();
    const result = await this.client.send<ScreenshotResult>('browsingContext.captureScreenshot', {
      context,
    });
    return Buffer.from(result.data, 'base64');
  }

  async quit(): Promise<void> {
    await this.client.close();
    if (this.process) {
      await this.process.stop();
    }
  }
}
