import '@/products/infrastructure/container'
import '@/users/infrastructure/container'
import { container } from 'tsyringe'
import { BcryptHashProvider } from '../providers/hash-provider/bcryptjs-hash.provider'
import { JwtAuthProvider } from '../providers/auth-provider/auth-provider.jwt'
import { R2Uploader } from '../providers/storage-provider/r2.uploader'


container.registerSingleton('HashProvider', BcryptHashProvider)
container.registerSingleton('AuthProvider', JwtAuthProvider )
container.registerSingleton('UploaderProvider', R2Uploader )
