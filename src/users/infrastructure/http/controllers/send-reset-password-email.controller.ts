import { dataValidation } from '@/common/infrastructure/validation/zod'
import { SendResetPasswordEmailUsecase } from '@/users/application/usecases/send-reset-password-email.usecase'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'
import { sendMailToResetPassword } from '../../email/nodemailer/sendMailToResetPassword'

export async function sendResetPasswordEmailController(
  request: Request,
  response: Response,
): Promise<Response> {
  const paramsSchema = z.object({
    email: z.string().email(),
  })

  const { email } = dataValidation(paramsSchema, request.body)

  const sendResetPasswordEmailUseCase: SendResetPasswordEmailUsecase.UseCase =
    container.resolve('SendResetPasswordEmailUsecase')

  const { user, token } = await sendResetPasswordEmailUseCase.execute({
    email,
  })

  await sendMailToResetPassword({user, token})
  console.log(`User ${user.email} token: ${token}`)

  return response.status(204).json()
}
