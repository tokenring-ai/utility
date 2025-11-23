export default function convertBoolean(text: string | undefined | null) {
  switch (text) {
    case 'true':
    case 'yes':
    case '1':
      return true;
    case 'false':
    case 'no':
    case '0':
      return false;
    default:
      throw new Error(`Unknown string used as boolean value: ${text}`);
  }
}