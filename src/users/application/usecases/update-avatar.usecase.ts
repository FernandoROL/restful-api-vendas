import { UploaderProvider } from '@/common/domain/providers/upload-provider'
import { UserRepository } from '@/users/domain/repositories/users.repository'
import { inject, injectable } from 'tsyringe'
import { UserOutput } from '../dtos/user-output.dto'
import { BadRequestError } from '@/common/domain/error/bad-request-error'
import { randomUUID } from 'crypto'

export namespace UpdateAvatarUseCase {
  export type Input = {
    user_id: string
    filename: string
    filesize: number
    filetype: string
    body: Buffer
  }

  export type Output = UserOutput

  export const MAX_UPLOAD_SIZE = 1024 * 1024 * 3

  export const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ]

  @injectable()
  export class UseCase {
    constructor(
      @inject('UsersRepository')
      private userRepository: UserRepository,
      @inject('UploaderProvider')
      private uploader: UploaderProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { user_id, filename, filesize, filetype, body } = input

      if (!ACCEPTED_IMAGE_TYPES.includes(filetype)) {
        throw new BadRequestError(
          '.jpg, .jpeg, .png and .webp files are accepted',
        )
      }

      if (filesize > MAX_UPLOAD_SIZE) {
        throw new BadRequestError(
          'File excedes max upload size of ' + (MAX_UPLOAD_SIZE / 1024 / 1024) + 'MB',
        )
      }

      const user = await this.userRepository.findById(user_id)

      const uniqueFileName = `${randomUUID()}-${filename}`

      await this.uploader.upload({
        filename: uniqueFileName,
        filetype,
        body,
      })

      user.avatar = uniqueFileName

      return this.userRepository.update(user)
    }
  }
}
