export class Cursor {
  static toBase64(value: string): string {
    return Buffer.from(value).toString('base64');
  }

  static fromBase64(value: string): string {
    return Buffer.from(value, 'base64').toString('utf-8');
  }
}