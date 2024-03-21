abstract class BungieDelegate {
  private key: string;

  public constructor() {
    this.key = process.env.BUNGIE_API_KEY!;
  }

  protected async fetch(endpoint: string) {
    return fetch(`https://www.bungie.net/Platform/${endpoint}`, {
      headers: {
        "X-Api-Key": this.key,
      },
    });
  }
}

class User extends BungieDelegate {
  public async getUsersByPrefix(prefix: string) {
    const result = await this.fetch(`/User/Search/Prefix/${prefix}/0/`);

    return result.json();
  }
}

export class BungieClient {
  public user: User;

  public constructor() {
    this.user = new User();
  }
}
