const OrderService = require('../../src/application/use-cases/order.service');
const Order = require('../../src/domain/entities/order.entity');
const { NotFoundError } = require('../../src/domain/errors');

// Mock del repositorio
const mockOrderRepository = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByEstado: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
};

describe('OrderService', () => {
    let orderService;

    beforeEach(() => {
        orderService = new OrderService(mockOrderRepository);
        jest.clearAllMocks();
    });

    describe('getAllOrders', () => {
        it('should return all orders', async () => {
            const mockOrders = [
                new Order('1', 'Laptop Dell XPS', 'High-end laptop', 2, 1500, 10, 2700, 'Juan Pérez', 'pendiente', new Date('2026-01-15')),
                new Order('2', 'Monitor Samsung 27"', 'Gaming monitor', 1, 350, 5, 332.5, 'Maria García', 'procesando', new Date('2026-01-20'))
            ];
            mockOrderRepository.getAll.mockResolvedValue(mockOrders);

            const result = await orderService.getAllOrders();

            expect(result).toEqual(mockOrders);
            expect(mockOrderRepository.getAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('getOrderById', () => {
        it('should return an order when it exists', async () => {
            const mockOrder = new Order('1', 'Laptop Dell XPS', 'High-end laptop', 2, 1500, 10, 2700, 'Juan Pérez', 'pendiente', new Date('2026-01-15'));
            mockOrderRepository.getById.mockResolvedValue(mockOrder);

            const result = await orderService.getOrderById('1');

            expect(result).toEqual(mockOrder);
            expect(mockOrderRepository.getById).toHaveBeenCalledWith('1');
        });

        it('should throw NotFoundError when order does not exist', async () => {
            mockOrderRepository.getById.mockResolvedValue(null);

            await expect(orderService.getOrderById('999'))
                .rejects.toThrow(NotFoundError);
        });
    });

    describe('getOrdersByEstado', () => {
        it('should return orders with specific estado', async () => {
            const mockOrders = [
                new Order('1', 'Laptop Dell XPS', 'High-end laptop', 2, 1500, 10, 2700, 'Juan Pérez', 'pendiente', new Date('2026-01-15'))
            ];
            mockOrderRepository.getByEstado.mockResolvedValue(mockOrders);

            const result = await orderService.getOrdersByEstado('pendiente');

            expect(result).toEqual(mockOrders);
            expect(mockOrderRepository.getByEstado).toHaveBeenCalledWith('pendiente');
        });

        it('should throw error for invalid estado', async () => {
            await expect(orderService.getOrdersByEstado('invalido'))
                .rejects.toThrow('Estado inválido');
        });

        it('should accept valid estados', async () => {
            const validEstados = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];

            for (const estado of validEstados) {
                mockOrderRepository.getByEstado.mockResolvedValue([]);
                await orderService.getOrdersByEstado(estado);
                expect(mockOrderRepository.getByEstado).toHaveBeenCalledWith(estado);
            }
        });
    });

    describe('createOrder', () => {
        const validOrderData = {
            producto: 'Laptop Dell XPS',
            descripcion: 'High-end laptop',
            cantidad: 2,
            precio: 1500,
            descuento: 10,
            cliente: 'Juan Pérez',
            estado: 'pendiente',
            fechaEntrega: '2026-06-15'
        };

        it('should create an order with valid data', async () => {
            const expectedTotal = 2700; // (1500 * 2) - (3000 * 0.10)
            mockOrderRepository.create.mockResolvedValue({ ...validOrderData, total: expectedTotal });

            const result = await orderService.createOrder(validOrderData);

            expect(result.total).toBe(expectedTotal);
            expect(mockOrderRepository.create).toHaveBeenCalledTimes(1);
        });

        it('should throw error if cantidad is less than or equal to 0', async () => {
            const invalidData = { ...validOrderData, cantidad: 0 };

            await expect(orderService.createOrder(invalidData))
                .rejects.toThrow('La cantidad debe ser mayor a 0');
        });

        it('should throw error if precio is less than or equal to 0', async () => {
            const invalidData = { ...validOrderData, precio: -100 };

            await expect(orderService.createOrder(invalidData))
                .rejects.toThrow('El precio debe ser mayor a 0');
        });

        it('should throw error if descuento is less than 0', async () => {
            const invalidData = { ...validOrderData, descuento: -5 };

            await expect(orderService.createOrder(invalidData))
                .rejects.toThrow('El descuento debe estar entre 0 y 100');
        });

        it('should throw error if descuento is greater than 100', async () => {
            const invalidData = { ...validOrderData, descuento: 105 };

            await expect(orderService.createOrder(invalidData))
                .rejects.toThrow('El descuento debe estar entre 0 y 100');
        });

        it('should throw error if fechaEntrega is in the past', async () => {
            const invalidData = { ...validOrderData, fechaEntrega: '2020-01-01' };

            await expect(orderService.createOrder(invalidData))
                .rejects.toThrow('La fecha de entrega no puede ser en el pasado');
        });

        it('should calculate total correctly without descuento', async () => {
            const dataWithoutDescuento = { ...validOrderData, descuento: 0 };
            const expectedTotal = 3000; // 1500 * 2
            mockOrderRepository.create.mockResolvedValue({ ...dataWithoutDescuento, total: expectedTotal });

            await orderService.createOrder(dataWithoutDescuento);

            const callArgs = mockOrderRepository.create.mock.calls[0][0];
            expect(callArgs.total).toBe(expectedTotal);
        });

        it('should use default values for optional fields', async () => {
            const minimalData = {
                producto: 'Laptop Dell XPS',
                descripcion: 'High-end laptop',
                cantidad: 1,
                precio: 1000,
                cliente: 'Juan Pérez',
                fechaEntrega: '2026-06-15'
            };

            mockOrderRepository.create.mockResolvedValue({ ...minimalData, descuento: 0, estado: 'pendiente' });

            await orderService.createOrder(minimalData);

            const callArgs = mockOrderRepository.create.mock.calls[0][0];
            expect(callArgs.descuento).toBe(0);
            expect(callArgs.estado).toBe('pendiente');
        });
    });

    describe('updateOrder', () => {
        const existingOrder = new Order(
            '1',
            'Laptop Dell XPS',
            'High-end laptop',
            2,
            1500,
            10,
            2700,
            'Juan Pérez',
            'pendiente',
            new Date('2026-01-15')
        );

        beforeEach(() => {
            mockOrderRepository.getById.mockResolvedValue(existingOrder);
        });

        it('should update an order successfully', async () => {
            const updateData = { cantidad: 3, descuento: 15 };
            const expectedTotal = 3825; // (1500 * 3) - (4500 * 0.15)

            mockOrderRepository.update.mockResolvedValue({ ...existingOrder, ...updateData, total: expectedTotal });

            const result = await orderService.updateOrder('1', updateData);

            expect(mockOrderRepository.update).toHaveBeenCalledWith('1', expect.any(Order));
        });

        it('should throw NotFoundError if order does not exist', async () => {
            mockOrderRepository.getById.mockResolvedValue(null);

            await expect(orderService.updateOrder('999', { cantidad: 5 }))
                .rejects.toThrow(NotFoundError);
        });

        it('should throw error if cantidad is less than or equal to 0', async () => {
            await expect(orderService.updateOrder('1', { cantidad: -1 }))
                .rejects.toThrow('La cantidad debe ser mayor a 0');
        });

        it('should throw error if precio is less than or equal to 0', async () => {
            await expect(orderService.updateOrder('1', { precio: -100 }))
                .rejects.toThrow('El precio debe ser mayor a 0');
        });

        it('should throw error if descuento is invalid', async () => {
            await expect(orderService.updateOrder('1', { descuento: 150 }))
                .rejects.toThrow('El descuento debe estar entre 0 y 100');
        });

        it('should throw error if fechaEntrega is in the past', async () => {
            await expect(orderService.updateOrder('1', { fechaEntrega: '2020-01-01' }))
                .rejects.toThrow('La fecha de entrega no puede ser en el pasado');
        });

        it('should recalculate total when cantidad or precio changes', async () => {
            const updateData = { cantidad: 5, precio: 2000 };
            mockOrderRepository.update.mockResolvedValue(existingOrder);

            await orderService.updateOrder('1', updateData);

            const callArgs = mockOrderRepository.update.mock.calls[0][1];
            const expectedTotal = 9000; // (2000 * 5) - (10000 * 0.10)
            expect(callArgs.total).toBe(expectedTotal);
        });
    });

    describe('deleteOrder', () => {
        it('should delete an existing order', async () => {
            const mockOrder = new Order('1', 'Laptop Dell XPS', 'High-end laptop', 2, 1500, 10, 2700, 'Juan Pérez', 'pendiente', new Date('2026-01-15'));
            mockOrderRepository.getById.mockResolvedValue(mockOrder);
            mockOrderRepository.delete.mockResolvedValue(true);

            await orderService.deleteOrder('1');

            expect(mockOrderRepository.delete).toHaveBeenCalledWith('1');
        });

        it('should throw NotFoundError if order does not exist', async () => {
            mockOrderRepository.getById.mockResolvedValue(null);

            await expect(orderService.deleteOrder('999'))
                .rejects.toThrow(NotFoundError);
        });
    });

    describe('cancelOrder', () => {
        it('should cancel a pending order', async () => {
            const mockOrder = new Order('1', 'Laptop Dell XPS', 'High-end laptop', 2, 1500, 10, 2700, 'Juan Pérez', 'pendiente', new Date('2026-01-15'));
            mockOrderRepository.getById.mockResolvedValue(mockOrder);
            mockOrderRepository.update.mockResolvedValue({ ...mockOrder, estado: 'cancelado' });

            const result = await orderService.cancelOrder('1');

            expect(mockOrderRepository.update).toHaveBeenCalledWith('1', expect.objectContaining({ estado: 'cancelado' }));
        });

        it('should throw NotFoundError if order does not exist', async () => {
            mockOrderRepository.getById.mockResolvedValue(null);

            await expect(orderService.cancelOrder('999'))
                .rejects.toThrow(NotFoundError);
        });

        it('should throw error if order is already delivered', async () => {
            const deliveredOrder = new Order('1', 'Laptop Dell XPS', 'High-end laptop', 2, 1500, 10, 2700, 'Juan Pérez', 'entregado', new Date('2026-01-15'));
            mockOrderRepository.getById.mockResolvedValue(deliveredOrder);

            await expect(orderService.cancelOrder('1'))
                .rejects.toThrow('No se puede cancelar una orden que ya fue entregada');
        });

        it('should throw error if order is already cancelled', async () => {
            const cancelledOrder = new Order('1', 'Laptop Dell XPS', 'High-end laptop', 2, 1500, 10, 2700, 'Juan Pérez', 'cancelado', new Date('2026-01-15'));
            mockOrderRepository.getById.mockResolvedValue(cancelledOrder);

            await expect(orderService.cancelOrder('1'))
                .rejects.toThrow('Esta orden ya está cancelada');
        });

        it('should be able to cancel processing order', async () => {
            const processingOrder = new Order('1', 'Laptop Dell XPS', 'High-end laptop', 2, 1500, 10, 2700, 'Juan Pérez', 'procesando', new Date('2026-01-15'));
            mockOrderRepository.getById.mockResolvedValue(processingOrder);
            mockOrderRepository.update.mockResolvedValue({ ...processingOrder, estado: 'cancelado' });

            await orderService.cancelOrder('1');

            expect(mockOrderRepository.update).toHaveBeenCalledWith('1', expect.objectContaining({ estado: 'cancelado' }));
        });

        it('should be able to cancel shipped order', async () => {
            const shippedOrder = new Order('1', 'Laptop Dell XPS', 'High-end laptop', 2, 1500, 10, 2700, 'Juan Pérez', 'enviado', new Date('2026-01-15'));
            mockOrderRepository.getById.mockResolvedValue(shippedOrder);
            mockOrderRepository.update.mockResolvedValue({ ...shippedOrder, estado: 'cancelado' });

            await orderService.cancelOrder('1');

            expect(mockOrderRepository.update).toHaveBeenCalledWith('1', expect.objectContaining({ estado: 'cancelado' }));
        });
    });
});
