import {humanId} from "human-id";

export function generateHumanId(): string {
  const number = Math.floor(1 + Math.random() * 999);
  return `${humanId({separator: "-", capitalize: false})}-${number}`;
}
