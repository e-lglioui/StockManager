import { api } from '../src/services/api';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('api', () => {
  describe('getProducts', () => {
    it('should fetch products successfully', async () => {
      const mockProducts = [{ id: 1, name: 'Product 1' }];
      fetchMock.mockResponseOnce(JSON.stringify(mockProducts));

      const products = await api.getProducts();
      expect(products).toEqual(mockProducts);
      expect(fetchMock).toHaveBeenCalledWith('http://172.16.9.32:3000/products');
    });

    it('should throw an error when fetch fails', async () => {
      fetchMock.mockReject(new Error('Failed to fetch products'));

      await expect(api.getProducts()).rejects.toThrow('Failed to fetch products');
    });
  });

  describe('getProduct', () => {
    it('should fetch a single product successfully', async () => {
      const mockProduct = { id: 1, name: 'Product 1' };
      fetchMock.mockResponseOnce(JSON.stringify(mockProduct));

      const product = await api.getProduct(1);
      expect(product).toEqual(mockProduct);
      expect(fetchMock).toHaveBeenCalledWith('http://172.16.9.32:3000/products/1');
    });

    it('should throw an error when fetch fails', async () => {
      fetchMock.mockReject(new Error('Failed to fetch product'));

      await expect(api.getProduct(1)).rejects.toThrow('Failed to fetch product');
    });
  });

  describe('updateStock', () => {
    it('should update stock successfully', async () => {
      const mockProduct = { id: 1, name: 'Product 1', stocks: [], editedBy: [] };
      fetchMock.mockResponseOnce(JSON.stringify(mockProduct));
      fetchMock.mockResponseOnce(JSON.stringify({ ...mockProduct, stocks: [{ id: 1, quantity: 10 }] }));

      const updatedProduct = await api.updateStock(1, 1, 10);
      expect(updatedProduct.stocks).toEqual([{ id: 1, quantity: 10 }]);
    });

    it('should throw an error when fetch fails', async () => {
      fetchMock.mockReject(new Error('Failed to update stock'));

      await expect(api.updateStock(1, 1, 10)).rejects.toThrow('Failed to update stock');
    });
  });

  describe('getWarehousemen', () => {
    it('should fetch warehousemen successfully', async () => {
      const mockWarehousemen = [{ id: 1, name: 'Warehouseman 1' }];
      fetchMock.mockResponseOnce(JSON.stringify(mockWarehousemen));

      const warehousemen = await api.getWarehousemen();
      expect(warehousemen).toEqual(mockWarehousemen);
      expect(fetchMock).toHaveBeenCalledWith('http://172.16.9.32:3000/warehousemans');
    });

    it('should throw an error when fetch fails', async () => {
      fetchMock.mockReject(new Error('Failed to fetch warehousemen'));

      await expect(api.getWarehousemen()).rejects.toThrow('Failed to fetch warehousemen');
    });
  });

  describe('getWarehousemanBySecretKey', () => {
    it('should fetch warehouseman by secret key successfully', async () => {
      const mockWarehousemen = [{ id: 1, name: 'Warehouseman 1', secretKey: '123' }];
      fetchMock.mockResponseOnce(JSON.stringify(mockWarehousemen));

      const warehouseman = await api.getWarehousemanBySecretKey('123');
      expect(warehouseman).toEqual(mockWarehousemen[0]);
    });

    it('should return null if no warehouseman is found', async () => {
      const mockWarehousemen = [{ id: 1, name: 'Warehouseman 1', secretKey: '456' }];
      fetchMock.mockResponseOnce(JSON.stringify(mockWarehousemen));

      const warehouseman = await api.getWarehousemanBySecretKey('123');
      expect(warehouseman).toBeNull();
    });
  });

  describe('addStock', () => {
    it('should add stock successfully', async () => {
      const mockProduct = { id: 1, name: 'Product 1', stocks: [], editedBy: [] };
      fetchMock.mockResponseOnce(JSON.stringify(mockProduct));
      fetchMock.mockResponseOnce(JSON.stringify({ ...mockProduct, stocks: [{ id: 1, quantity: 10 }] }));
  
      const updatedProduct = await api.addStock(1, 'Stock 1', 'City 1', 10, 0, 0);
      expect(updatedProduct.stocks).toEqual([{ id: 1, quantity: 10 }]);
    });
  
    it('should throw an error when fetch fails', async () => {
      fetchMock.mockRejectOnce(new Error('Failed to add stock. Status: 500'));
  
      await expect(api.addStock(1, 'Stock 1', 'City 1', 10, 0, 0)).rejects.toThrow('Failed to add stock. Status: 500');
    });
  });

  describe('deleteStockLocation', () => {
    it('should delete stock location successfully', async () => {
      const mockProduct = { id: 1, name: 'Product 1', stocks: [{ id: 1, quantity: 10 }], editedBy: [] };
      fetchMock.mockResponseOnce(JSON.stringify(mockProduct));
      fetchMock.mockResponseOnce(JSON.stringify({ ...mockProduct, stocks: [] }));

      const updatedProduct = await api.deleteStockLocation(1, 1);
      expect(updatedProduct.stocks).toEqual([]);
    });

    it('should throw an error when fetch fails', async () => {
      fetchMock.mockReject(new Error('Failed to delete stock location'));

      await expect(api.deleteStockLocation(1, 1)).rejects.toThrow('Failed to delete stock location');
    });
  });

  describe('modifyStockLocation', () => {
    it('should modify stock location successfully', async () => {
      const mockProduct = { id: 1, name: 'Product 1', stocks: [{ id: 1, quantity: 10 }], editedBy: [] };
      fetchMock.mockResponseOnce(JSON.stringify(mockProduct));
      fetchMock.mockResponseOnce(JSON.stringify({ ...mockProduct, stocks: [{ id: 1, quantity: 20 }] }));

      const updatedProduct = await api.modifyStockLocation(1, 1, { quantity: 20 });
      expect(updatedProduct.stocks).toEqual([{ id: 1, quantity: 20 }]);
    });

    it('should throw an error when fetch fails', async () => {
      fetchMock.mockReject(new Error('Failed to modify stock location'));

      await expect(api.modifyStockLocation(1, 1, { quantity: 20 })).rejects.toThrow('Failed to modify stock location');
    });
  });

  describe('getProductByBarcode', () => {
    it('should fetch product by barcode successfully', async () => {
      const mockProduct = { id: 1, name: 'Product 1', barcode: '123' };
      fetchMock.mockResponseOnce(JSON.stringify([mockProduct]));

      const product = await api.getProductByBarcode('123');
      expect(product).toEqual(mockProduct);
    });

    it('should return null if no product is found', async () => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      const product = await api.getProductByBarcode('123');
      expect(product).toBeNull();
    });

    it('should throw an error when fetch fails', async () => {
      fetchMock.mockReject(new Error('Failed to fetch product by barcode'));

      await expect(api.getProductByBarcode('123')).rejects.toThrow('Failed to fetch product by barcode');
    });
    it('should throw an error when fetch fails', async () => {
      fetchMock.mockRejectOnce(new Error('Failed to fetch product by barcode'));
  
      await expect(api.getProductByBarcode('123')).rejects.toThrow('Failed to fetch product by barcode');
    });
  });

  describe('addProduct', () => {
    it('should add a new product successfully', async () => {
      const mockProduct = { id: 1, name: 'Product 1' };
      fetchMock.mockResponseOnce(JSON.stringify(mockProduct));

      const product = await api.addProduct({ name: 'Product 1' });
      expect(product).toEqual(mockProduct);
    });

    it('should throw an error when fetch fails', async () => {
      fetchMock.mockReject(new Error('Failed to add new product'));

      await expect(api.addProduct({ name: 'Product 1' })).rejects.toThrow('Failed to add new product');
    });
  });

});