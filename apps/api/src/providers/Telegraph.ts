export interface TelegraphAccount {
    short_name: string;
    author_name: string;
    author_url: string;
    access_token?: string;
    auth_url?: string;
    page_count?: number;
}

interface Node {
    tag: string;
    attrs?: Record<string, string>;
    children?: (Node | string)[];
}

interface Page {
    path: string;
    url: string;
    title: string;
    description: string;
    author_name?: string;
    author_url?: string;
    image_url?: string;
    content?: Node[];
    views: number;
    can_edit?: boolean;
}

interface PageList {
    total_count: number;
    pages: Page[];
}

interface PageViews {
    views: number;
}

export class Telegraph {
    private baseUrl = 'https://api.telegra.ph';

    async createAccount(payload: {
        short_name: string;
        author_name?: string;
        author_url?: string;
    }) {
        const response = await fetch(`${this.baseUrl}/createAccount`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
        });
        return response.json() as Promise<{ ok: boolean; result: TelegraphAccount }>
    }

    async editAccountInfo(payload: {
        access_token: string;
        short_name?: string;
        author_name?: string;
        author_url?: string;
    }) {
        const response = await fetch(`${this.baseUrl}/editAccountInfo`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
        });
        return response.json() as Promise<{ ok: boolean; result: TelegraphAccount }>
    }

    async getAccountInfo(payload: {
        access_token: string;
        fields?: ('short_name' | 'author_name' | 'author_url' | 'auth_url' | 'page_count')[];
    }) {
        const url = new URL(`${this.baseUrl}/getAccountInfo`);
        url.searchParams.append('access_token', payload.access_token);
        if (payload.fields) {
            url.searchParams.append('fields', JSON.stringify(payload.fields));
        }
        const response = await fetch(url.toString());
        return response.json() as Promise<{ ok: boolean; result: TelegraphAccount }>
    }

    async revokeAccessToken(access_token: string) {
        const response = await fetch(`${this.baseUrl}/revokeAccessToken`, {
            method: 'POST',
            body: JSON.stringify({ access_token }),
            headers: { 'Content-Type': 'application/json' },
        });
        return response.json() as Promise<{ ok: boolean; result: TelegraphAccount }>
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
            headers: { 'Content-Type': 'application/json' },
        });
        return response.json() as Promise<{ ok: boolean; result: Page }>
    }

    async editPage(payload: {
        access_token: string;
        path: string;
        title: string;
        content: Node[];
        author_name?: string;
        author_url?: string;
        return_content?: boolean;
    }) {
        const response = await fetch(`${this.baseUrl}/editPage/${payload.path}`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
        });
        return response.json() as Promise<{ ok: boolean; result: Page }>
    }

    async getPage(path: string, return_content = false) {
        const url = new URL(`${this.baseUrl}/getPage/${path}`);
        url.searchParams.append('return_content', return_content.toString());
        const response = await fetch(url.toString());
        return response.json() as Promise<{ ok: boolean; result: Page }>
    }

    async getPageList(payload: {
        access_token: string;
        offset?: number;
        limit?: number;
    }) {
        const url = new URL(`${this.baseUrl}/getPageList`);
        url.searchParams.append('access_token', payload.access_token);
        if (payload.offset !== undefined) {
            url.searchParams.append('offset', payload.offset.toString());
        }
        if (payload.limit !== undefined) {
            url.searchParams.append('limit', payload.limit.toString());
        }
        const response = await fetch(url.toString());
        return response.json() as Promise<{ ok: boolean; result: PageList }>
    }

    async getViews(payload: {
        path: string;
        year?: number;
        month?: number;
        day?: number;
        hour?: number;
    }) {
        const url = new URL(`${this.baseUrl}/getViews/${payload.path}`);
        if (payload.year !== undefined) url.searchParams.append('year', payload.year.toString());
        if (payload.month !== undefined) url.searchParams.append('month', payload.month.toString());
        if (payload.day !== undefined) url.searchParams.append('day', payload.day.toString());
        if (payload.hour !== undefined) url.searchParams.append('hour', payload.hour.toString());
        const response = await fetch(url.toString());
        return response.json() as Promise<{ ok: boolean; result: PageViews }>
    }
}