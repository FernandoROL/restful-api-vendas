import '@/products/infrastructure/container'
import '@/users/infrastructure/container'
import { container } from 'tsyringe'
import { BcryptHashProvider } from '../providers/hash-provider/bcryptjs-hash.provider'
import { JwtAuthProvider } from '../providers/auth-provider/auth-provider.jwt'

container.registerSingleton('HashProvider', BcryptHashProvider)
container.registerSingleton('AuthProvider', JwtAuthProvider )
