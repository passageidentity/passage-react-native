import { btoa } from 'react-native-quick-base64';
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

  async waitForOneTimePasscode(retries: number = 5, delayMs: number = 3000): Promise<string | null> {
    for (let i = 0; i < retries; i++) {
      console.log('tries: ', i)
      await new Promise(resolve => setTimeout(resolve, delayMs));
      const oneTimePasscode = await this.getMostRecentOneTimePasscode();
      console.log(oneTimePasscode)
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
      const incomingURL = new URL(message.html.links[0].href);
      const magicLink = incomingURL.searchParams.get('psg_magic_link');
      return magicLink;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

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
    return `Basic ${btoa(apiKey)}`;
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
