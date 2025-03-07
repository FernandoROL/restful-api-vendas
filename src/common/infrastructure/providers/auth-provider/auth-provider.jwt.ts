import {
  AuthProvider,
  GenerateAuthKeyProps,
  VerifyAuthKeyProps,
} from '@/common/domain/providers/auth-provider'
import jwt from 'jsonwebtoken'
import { InvalidCredentialsError } from '@/common/domain/error/invalid-credentials-error'
import { env } from "@/common/infrastructure/env";

type DecodedTokenProps = {
  sub: string
}

export class JwtAuthProvider implements AuthProvider {
  generateAuthKey(user_id: string): GenerateAuthKeyProps {
    const access_token = jwt.sign({}, env.JWT_SECRET, {
      expiresIn: env.JTW_EXPIRES_IN,
      subject: user_id,
    })
    return { access_token }
  }

  verifiyAuthKey(token: string): VerifyAuthKeyProps {
    try {
      const decodedToken = jwt.verify(token, env.JWT_SECRET)
      const { sub } = decodedToken as DecodedTokenProps
      return { user_id: sub }
    } catch {
      throw new InvalidCredentialsError('Invalid credentials')
    }
  }
}
