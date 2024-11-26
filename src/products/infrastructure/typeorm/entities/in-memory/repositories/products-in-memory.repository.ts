import { NotFoundError } from "@/common/domain/error/bot-found-error";
import { ConflictError } from "@/common/domain/error/conflict-error";
import { InMemoryRepository } from "@/common/domain/repositories/in-memory.repository";
import { ProductModel } from "@/products/domain/models/products.models";
import { ProductId, ProductsRepository } from "@/products/domain/repositories/products.repository";

export class ProductsInMemoryRepository extends InMemoryRepository<ProductModel> implements ProductsRepository {

  sortableFields: string[] = ['name', 'created_at'];

  async findByName(name: string): Promise<ProductModel> {
    const model = this.items.find(item => item.name === name)
    if(!model) {
      throw new NotFoundError(`Product not found using ${name}`)
    }

    return model
  }

  async findAllByIds(productIds: ProductId[]): Promise<ProductModel[]> {
    const existingProducts = []
    for (const prodId of productIds) {
      const product = this.items.find(item => item.id === prodId.id)
      if(product) {
        existingProducts.push(product)
      }
    }

    return existingProducts
  }

  async conflictingName(name: string): Promise<void> {
    const model = this.items.find(item => item.name === name)
    if(!model) {
      throw new ConflictError(`Product not found using ${name}`)
    }
  }

  protected async applyFilter(items: ProductModel[], filter: string | null): Promise<ProductModel[]> {
    if(!filter) return items
    return items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
  }

  protected async applySort(items: ProductModel[], sort: string | null, sort_dir: string | null): Promise<ProductModel[]> {
    return super.applySort(items, sort ?? 'created_at', sort_dir ?? 'desc')
  }

}
