/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import bcrypt from "bcryptjs";

export async function getPasswordHash(password: string): Promise<string> {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}

export async function verifyPasword(hash: string, password: string) {
  const isValid = await bcrypt.compare(password, hash);
  return isValid;
}
