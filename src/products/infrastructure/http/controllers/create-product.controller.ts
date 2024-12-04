import { AppError } from "@/common/domain/error/app-error";
import { Request, Response } from "express";
import { z } from "zod";
import { ProductsTypeormRepository } from "../../typeorm/repositories/products-typeorm.repository";
import { dataSource } from "@/common/infrastructure/typeorm";
import { Product } from "../../typeorm/entities/products.entity";
import { CreateProductUseCase } from "@/products/application/usecases/create-product.usecase";
import { container } from "tsyringe";

export async function createProductController(request: Request, response: Response) {
  const createProductBodySchema = z.object({
    name: z.string(),
    price: z.number(),
    quantity: z.number()
  })

  const validateData = createProductBodySchema.safeParse(request.body)

  if (validateData.success === false) {
    console.log("Invalid data", validateData.error.format())
    throw new AppError(`${validateData.error.errors.map(error => {
      return `${error.path} -> ${error.message}`
    })}`,
    )
  }

  const { name, price, quantity } = validateData.data

  const createProductUseCase: CreateProductUseCase.UseCase = container.resolve('CreateProductUseCase')

  const product = await createProductUseCase.execute({
    name,
    price,
    quantity
  })

  return response.status(201).json(product)
}
