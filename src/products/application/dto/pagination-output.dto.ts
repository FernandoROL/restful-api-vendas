export type PaginationOutpuDto<Item> = {
  items: Item[]
  total: number
  current_page: number
  per_page: number
  last_page: number
}

export class PaginateOuputMapper {
  static toOutput<Item = any>(items: Item[], result: any): PaginationOutpuDto<Item> {
    return {
      items,
      total: result.total,
      current_page: result.current_page,
      per_page: result.per_page,
      last_page: Math.ceil(result.total / result.per_page)
    }
  }
}
