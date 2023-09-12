import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseFilterInput(input: string): Record<string, string> {
  //all the arguments are lowercased that's why we don't need uppercased chars
  const lowerCasedInput = input.toLowerCase();
  //using regex to check stracture
  const matches = lowerCasedInput.match(/(\w+):(\w+)/g);

  if (!matches) {
    return {};
  }

  const result: Record<string, string> = {};
  matches.forEach((match) => {
    const [key, value] = match.split(":");
    result[key] = value;
  });

  return result;
}
