# Service Example

```ts
export async function getProducts(): Promise<ProductViewModel[]> {
  const response = await apiClient.get<ProductDto[]>('/products');

  return response.map(ProductMapper.toViewModel);
}
```