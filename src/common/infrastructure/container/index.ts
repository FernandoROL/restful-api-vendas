import '@/products/infrastructure/container'
import '@/users/infrastructure/container'
import { container } from 'tsyringe'
import { BcryptHashProvider } from '../providers/hash-provider/bcryptjs-hash.provider'

container.registerSingleton('HashProvider', BcryptHashProvider)
