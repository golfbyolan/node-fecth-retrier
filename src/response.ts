import { parseString } from "xml2js";
import { httpStatusCodes } from "./statusCodes";
import { HeadersInit, Response } from 'node-fetch';
import { HttpStatusCode, NodeFetchRetrierResponseInit } from "./types";

export class NodeFetchRetrierResponse {
    status: HttpStatusCode = 599;
    statusText: string = httpStatusCodes[this.status];
    body: any = undefined;
    headers?: HeadersInit;
    ok: boolean = false;
    type?: ResponseType = "error";
    url: string = "";
    redirected: boolean = false;
    input: any;
    attempts: number = 0

    constructor(url: string, input: any) {
        this.url = url;
        this.input = input;
    }

    get response(): NodeFetchRetrierResponseInit{
        return {
            url:this.url,
            status:this.status, 
            statusText:this.statusText,
            body:this.body,
            headers:this.headers,
            ok:this.ok,
            type:this.type,
            redirected:this.redirected,
            input:this.input,
            attempt:this.attempts
        }
    }

    private set _status(code: HttpStatusCode) {
        this.status = code;
        this.statusText = httpStatusCodes[code];
    }

    private async parseBody(httpResponse: Response, returnJson: boolean): Promise<any> {
        const contentType: string | null = httpResponse.headers.get("Content-Type")

        if (!contentType) return { message: "No ContentType" };
        if (contentType.includes("application/json")) return httpResponse.json();
        if (contentType.includes("multipart/form-data")) return httpResponse.body;
        if (contentType.includes("text/plain")) {
            const text = await httpResponse.text();
            return returnJson ? { text } : text;
        }
        if (contentType.includes("application/octet-stream")) {
            const buffer = await httpResponse.arrayBuffer();
            return returnJson ? { buffer } : buffer;
        }
        if (contentType.includes("image/")) {
            const blob = await httpResponse.blob();
            return returnJson ? { blob } : blob;
        }
        if (contentType.includes("application/x-www-form-urlencoded")) {
            const text = await httpResponse.text();
            const params = new URLSearchParams(text);
            return Object.fromEntries(params.entries());
        }
        if (contentType.includes("application/xml") || contentType.includes("text/xml") || contentType.includes("soap+xml")) {
            const text = await httpResponse.text();
            return returnJson ? this.parseXML(text) : text;
        }

        return { message: "Unknown ContentType" }; // Default case
    }

    private parseXML(xmlString: string): any {
        let result: any;
        parseString(xmlString, { explicitArray: false }, (err, parsed) => {
            if (err) {
                console.error("Failed to parse XML:", err);
                throw new Error("XML Parsing Error");
            }
            result = parsed;
        });

        return result;
    }

    async create(httpResponse: Response, returnJson: boolean): Promise<void> {
        this._status = httpResponse.status as HttpStatusCode;
        this.headers = httpResponse.headers;
        this.ok = httpResponse.ok;
        this.type = httpResponse.type;
        this.url = httpResponse.url;
        this.redirected = httpResponse.redirected;
        this.body = await this.parseBody(httpResponse, returnJson);
    }

    async functionError(error: any): Promise<void> {
        this.status = 599;
        this.body = error;
    }
}