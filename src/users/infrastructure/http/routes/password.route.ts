import { Router } from 'express'
import { sendResetPasswordEmailController } from '../controllers/send-reset-password-email.controller'
import { resetPasswordController } from '../controllers/reset-password.controller'

const passwordRouter = Router()

passwordRouter.post('/forgot', sendResetPasswordEmailController)

passwordRouter.post('/reset', resetPasswordController)

export { passwordRouter }
