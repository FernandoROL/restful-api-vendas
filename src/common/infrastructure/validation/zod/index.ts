import { AppError } from "@/common/domain/error/app-error"


/**
 * 
 * @param schema objeto com schema de validação para o zod
 * @param data objeto com os dados a serem validados
 * @returns retorno dos dados validados
 */
export function dataValidation(schema: any, data: any) {
  const validateData = schema.safeParse(data)

  if (validateData.success === false) {
    console.log("Invalid params", validateData.error.format())
    throw new AppError(`${validateData.error.errors.map((error: { path: any; message: any }) => {
      return `${error.path} -> ${error.message}`
    })}`,
    )
  }

  return validateData.data
}
