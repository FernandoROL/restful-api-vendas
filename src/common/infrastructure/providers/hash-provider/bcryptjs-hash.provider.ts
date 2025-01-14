import { HashProvider } from "@/common/domain/providers/hash-provider";
import { hash, compare } from "bcryptjs";

export class BcryptHashProvider implements HashProvider {
  async generateHash(payload: string): Promise<string> {
    return hash(payload, 8)
  }

  async compareHash(payload: string, hashed: string): Promise<Boolean> {
    return compare(payload, hashed)
  }
}
