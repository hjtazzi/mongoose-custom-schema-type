import generator from 'generate-password';
import { Types } from 'mongoose';

export const generatorPass = (
  length: number = 16,
  numbers: boolean = true,
  lowercase: boolean = true,
  uppercase: boolean = true
): string => {
  const newPass = generator.generate({
    length: length,
    numbers: numbers,
    lowercase: lowercase,
    uppercase: uppercase
  });

  return newPass;
}
