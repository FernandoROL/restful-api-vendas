import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { instanceToInstance } from 'class-transformer'
import { UpdateProfileUseCase } from '@/users/application/usecases/update-profile.usecase'

export async function updateProfileController(
  request: Request,
  response: Response,
): Promise<Response> {
  const bodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().optional(),
    old_password: z.string().optional()
  })
  .refine(
    data => {
      if (data.password && !data.old_password) {
        return false
      }
      return true
    },
    {
      message: 'The old password is required to update password',
      path: ['old_password'],
    },
  )

  const id = request.user.id

  const { name, email, password, old_password } = dataValidation(bodySchema, request.body)

  const updateProfileUseCase: UpdateProfileUseCase.UseCase = container.resolve(
    'UpdateProfileUseCase'
  )

  const user = await updateProfileUseCase.execute({
    user_id: id,
    name,
    email,
    password,
    old_password
  })

  return response.status(200).json(instanceToInstance(user))
}
