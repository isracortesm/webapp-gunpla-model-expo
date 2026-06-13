# Mapper Example

```ts
export const ProductMapper = {
  toViewModel(dto: ProductDto): ProductViewModel {
    return {
      id: dto.id,
      title: dto.attributes.title,
    };
  },
};
```