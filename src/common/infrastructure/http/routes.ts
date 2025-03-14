import { productsRouter } from "@/products/infrastructure/http/routes/products.route";
import { authRouter } from "@/users/infrastructure/http/routes/auth.route";
import { passwordRouter } from "@/users/infrastructure/http/routes/password.route";
import { userRoute } from "@/users/infrastructure/http/routes/user.routes";
import { Router } from "express";

const routes = Router()

routes.get('/', (req, res) => {
  return res.status(200).json({message: 'Hello, world'})
})

routes.use('/products', productsRouter)

routes.use('/users', userRoute)

routes.use('/auth', authRouter)

routes.use('/password', passwordRouter)

export { routes }
