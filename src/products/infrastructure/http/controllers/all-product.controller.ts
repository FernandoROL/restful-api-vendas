import { Request, Response } from "express";
import { container } from "tsyringe";
import { AllProductUseCase } from "@/products/application/usecases/all-product.usecase";

export async function allProductController(request: Request, response: Response) {
  const allProductUseCase: AllProductUseCase.UseCase = container.resolve('AllProductUseCase')

  const find = await allProductUseCase.execute()

  const products = find.length < 1 ? {alert: 'no products found'} : find

  

  return response.status(200).json(products)
}
