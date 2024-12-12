import { Buffer } from 'buffer';
import { MAILOSAUR_API_KEY } from '@env';

const mailosaurConfig = {
  serverId: "ncor7c1m", // note: this is public information
  apiURL: "https://mailosaur.com/api/messages",
  apiKey: MAILOSAUR_API_KEY || '',
};

interface ListMessagesResponse {
  items: ListMessage[];
}

interface ListMessage {
  id: string;
  received: string;
  type: string;
  subject: string;
  from: NameEmail[];
  to: NameEmail[];
  cc: string[];
  bcc: string[];
}

interface NameEmail {
  name: string;
  email: string;
}

interface GetMessageResponse {
  id: string;
  received: string;
  type: string;
  subject: string;
  from: NameEmail[];
  to: NameEmail[];
  cc: string[];
  bcc: string[];
  html: MessageHTML;
}

interface MessageHTML {
  body: string;
  links: MessageLink[];
  codes: MessageCode[];
}

interface MessageLink {
  href: string;
  text: string;
}

interface MessageCode {
  value: string;
}

class MailosaurAPIClient {

  getUniqueMailosaurEmailAddress(): string {
    const date = Date.now();
    const identifier = `authentigator+${date}@${mailosaurConfig.serverId}.mailosaur.net`;
    return identifier;
  }

  async waitForMagicLink(retries: number = 5, delayMs: number = 3000): Promise<string | null> {
    for (let i = 0; i < retries; i++) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
      const magicLink = await this.getMostRecentMagicLink();
      if (magicLink) {
        return magicLink;
      }
    }
    return null;
  }

  async waitForOneTimePasscode(retries: number = 5, delayMs: number = 8000): Promise<string | null> {
    for (let i = 0; i < retries; i++) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
      const oneTimePasscode = await this.getMostRecentOneTimePasscode();
      if (oneTimePasscode) {
        return oneTimePasscode;
      }
    }
    return null;
  }

  private async getMostRecentMagicLink(): Promise<string | null> {
    try {
      const messages = await this.listMessages();
      if (messages.length === 0) return null;
      const message = await this.getMessage(messages[0].id);
      if (message.html.links.length === 0) return null;
      const incomingURL = message.html.links[0].href;
      const magicLink = this.extractQueryParam(incomingURL, 'psg_magic_link')
      return magicLink;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private extractQueryParam (url: string, param: string) {
    const queryString = url.split('?')[1];
    if (!queryString) return null;
    const queryParams = queryString.split('&');
    for (let pair of queryParams) {
      const [key, value] = pair.split('=');
      if (key === param) {
        return decodeURIComponent(value);
      }
    }
    return null;
  };

  private async getMostRecentOneTimePasscode(): Promise<string | null> {
    try {
      const messages = await this.listMessages();
      if (messages.length === 0) return null;
      const message = await this.getMessage(messages[0].id);
      if (message.html.codes.length === 0) return null;
      return message.html.codes[0].value;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private getAppUrl(path: string): string {
    return `${mailosaurConfig.apiURL}${path}`;
  }

  private getAuthHeader(): string {
    const apiKey = `api:${mailosaurConfig.apiKey}`;
    const base64Key = Buffer.from(apiKey, 'utf-8').toString('base64');
    return `Basic ${base64Key}`;
  }

  private async getMessage(id: string): Promise<GetMessageResponse> {
    const url = this.getAppUrl(`/${id}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.getAuthHeader(),
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch message: ${response.statusText}`);
    }
    return response.json();
  }

  private async listMessages(): Promise<ListMessage[]> {
    const url = this.getAppUrl(`?server=${mailosaurConfig.serverId}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.getAuthHeader(),
      },
    });
    if (!response.ok) {
      console.error(`Failed to fetch messages: ${response.statusText}`);
      return [];
    }
    const data: ListMessagesResponse = await response.json();
    return data.items;
  }
}

export default MailosaurAPIClient;
