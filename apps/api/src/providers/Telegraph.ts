
export interface TelegraphAccount {
    short_name: string;
    author_name: string;
    author_url: string;
    access_token: string;
    auth_url: string;
    page_count: number;
}

interface Node {
    tag: string;
    attrs: Record<string, string>;
    children: Node[];
}

interface Page {
    path: string;
    url: string;
    title: string;
    description: string;
    content: Node[];
    views: number;
    can_edit: boolean; // if access token is passed
}

export class Telegraph {
    baseUrl = 'https://api.telegra.ph';
    async createAccount(payload: {
        short_name: string;
        author_name: string;
        author_url?: string;
    }) {
        const response = await fetch(`${this.baseUrl}/createAccount`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await response.json() as {
            ok: boolean;
            result: TelegraphAccount;
        }
    }

    async createPage(payload: {
        access_token: string;
        title: string;
        content: Node[];
        author_name?: string;
        author_url?: string;
        return_content?: boolean;
    }) {
        const response = await fetch(`${this.baseUrl}/createPage`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await response.json() as Page;
    }

}