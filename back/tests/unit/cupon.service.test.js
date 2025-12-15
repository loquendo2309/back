const CuponService = require('../../src/application/use-cases/cupon.service');
const Cupon = require('../../src/domain/entities/cupon.entity');
const { NotFoundError, ConflictError, BadRequestError } = require('../../src/domain/errors');

// Mock del repositorio
const mockCuponRepository = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByCodigo: jest.fn(),
    getActivos: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
};

describe('CuponService', () => {
    let cuponService;

    beforeEach(() => {
        cuponService = new CuponService(mockCuponRepository);
        jest.clearAllMocks();
    });

    describe('getAllCupons', () => {
        it('should return all coupons', async () => {
            const mockCupons = [
                new Cupon('1', 'DESCUENTO10', 10, new Date('2026-12-31'), true, 100, 0),
                new Cupon('2', 'NAVIDAD25', 25, new Date('2026-01-15'), true, 50, 10)
            ];
            mockCuponRepository.getAll.mockResolvedValue(mockCupons);

            const result = await cuponService.getAllCupons();

            expect(result).toEqual(mockCupons);
            expect(mockCuponRepository.getAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('getCuponById', () => {
        it('should return a coupon when it exists', async () => {
            const mockCupon = new Cupon('1', 'DESCUENTO10', 10, new Date('2026-12-31'), true, 100, 0);
            mockCuponRepository.getById.mockResolvedValue(mockCupon);

            const result = await cuponService.getCuponById('1');

            expect(result).toEqual(mockCupon);
            expect(mockCuponRepository.getById).toHaveBeenCalledWith('1');
        });

        it('should throw NotFoundError when coupon does not exist', async () => {
            mockCuponRepository.getById.mockResolvedValue(null);

            await expect(cuponService.getCuponById('999'))
                .rejects.toThrow(NotFoundError);
        });
    });

    describe('getCuponByCodigo', () => {
        it('should return a coupon when code exists', async () => {
            const mockCupon = new Cupon('1', 'DESCUENTO10', 10, new Date('2026-12-31'), true, 100, 0);
            mockCuponRepository.getByCodigo.mockResolvedValue(mockCupon);

            const result = await cuponService.getCuponByCodigo('DESCUENTO10');

            expect(result).toEqual(mockCupon);
            expect(mockCuponRepository.getByCodigo).toHaveBeenCalledWith('DESCUENTO10');
        });

        it('should throw NotFoundError when code does not exist', async () => {
            mockCuponRepository.getByCodigo.mockResolvedValue(null);

            await expect(cuponService.getCuponByCodigo('NOEXISTE'))
                .rejects.toThrow(NotFoundError);
        });
    });

    describe('getActiveCupons', () => {
        it('should return only active coupons', async () => {
            const mockActiveCupons = [
                new Cupon('1', 'DESCUENTO10', 10, new Date('2026-12-31'), true, 100, 0),
                new Cupon('2', 'NAVIDAD25', 25, new Date('2026-01-15'), true, 50, 10)
            ];
            mockCuponRepository.getActivos.mockResolvedValue(mockActiveCupons);

            const result = await cuponService.getActiveCupons();

            expect(result).toEqual(mockActiveCupons);
            expect(mockCuponRepository.getActivos).toHaveBeenCalledTimes(1);
        });
    });

    describe('createCupon', () => {
        const validCuponData = {
            codigo: 'DESCUENTO10',
            descuento: 10,
            fechaExpiracion: '2026-12-31',
            activo: true,
            usoMaximo: 100
        };

        it('should create a coupon with valid data', async () => {
            mockCuponRepository.getByCodigo.mockResolvedValue(null);
            mockCuponRepository.create.mockResolvedValue({ ...validCuponData, id: '1', usoActual: 0 });

            const result = await cuponService.createCupon(validCuponData);

            expect(result.usoActual).toBe(0);
            expect(mockCuponRepository.create).toHaveBeenCalledTimes(1);
        });

        it('should throw error if descuento is less than 0', async () => {
            const invalidData = { ...validCuponData, descuento: -5 };

            await expect(cuponService.createCupon(invalidData))
                .rejects.toThrow(BadRequestError);
        });

        it('should throw error if descuento is greater than 100', async () => {
            const invalidData = { ...validCuponData, descuento: 105 };

            await expect(cuponService.createCupon(invalidData))
                .rejects.toThrow(BadRequestError);
        });

        it('should throw error if usoMaximo is less than or equal to 0', async () => {
            const invalidData = { ...validCuponData, usoMaximo: 0 };

            await expect(cuponService.createCupon(invalidData))
                .rejects.toThrow(BadRequestError);
        });

        it('should throw error if fechaExpiracion is in the past', async () => {
            const invalidData = { ...validCuponData, fechaExpiracion: '2020-01-01' };

            await expect(cuponService.createCupon(invalidData))
                .rejects.toThrow(BadRequestError);
        });

        it('should throw ConflictError if codigo already exists', async () => {
            const existingCupon = new Cupon('1', 'DESCUENTO10', 10, new Date('2026-12-31'), true, 100, 0);
            mockCuponRepository.getByCodigo.mockResolvedValue(existingCupon);

            await expect(cuponService.createCupon(validCuponData))
                .rejects.toThrow(ConflictError);
        });

        it('should set activo to true by default', async () => {
            const dataWithoutActivo = { ...validCuponData };
            delete dataWithoutActivo.activo;

            mockCuponRepository.getByCodigo.mockResolvedValue(null);
            mockCuponRepository.create.mockResolvedValue({ ...dataWithoutActivo, activo: true });

            await cuponService.createCupon(dataWithoutActivo);

            const callArgs = mockCuponRepository.create.mock.calls[0][0];
            expect(callArgs.activo).toBe(true);
        });

        it('should set usoActual to 0', async () => {
            mockCuponRepository.getByCodigo.mockResolvedValue(null);
            mockCuponRepository.create.mockResolvedValue(validCuponData);

            await cuponService.createCupon(validCuponData);

            const callArgs = mockCuponRepository.create.mock.calls[0][0];
            expect(callArgs.usoActual).toBe(0);
        });
    });

    describe('updateCupon', () => {
        const existingCupon = new Cupon('1', 'DESCUENTO10', 10, new Date('2026-12-31'), true, 100, 5);

        beforeEach(() => {
            mockCuponRepository.getById.mockResolvedValue(existingCupon);
        });

        it('should update a coupon successfully', async () => {
            const updateData = { descuento: 15, usoMaximo: 200 };
            mockCuponRepository.update.mockResolvedValue({ ...existingCupon, ...updateData });

            const result = await cuponService.updateCupon('1', updateData);

            expect(mockCuponRepository.update).toHaveBeenCalledWith('1', expect.any(Cupon));
        });

        it('should throw NotFoundError if coupon does not exist', async () => {
            mockCuponRepository.getById.mockResolvedValue(null);

            await expect(cuponService.updateCupon('999', { descuento: 20 }))
                .rejects.toThrow(NotFoundError);
        });

        it('should throw error if descuento is invalid', async () => {
            await expect(cuponService.updateCupon('1', { descuento: 150 }))
                .rejects.toThrow(BadRequestError);
        });

        it('should throw error if usoMaximo is less than or equal to 0', async () => {
            await expect(cuponService.updateCupon('1', { usoMaximo: -1 }))
                .rejects.toThrow(BadRequestError);
        });

        it('should throw error if fechaExpiracion is in the past', async () => {
            await expect(cuponService.updateCupon('1', { fechaExpiracion: '2020-01-01' }))
                .rejects.toThrow(BadRequestError);
        });

        it('should preserve existing values when not provided', async () => {
            const updateData = { descuento: 20 };
            mockCuponRepository.update.mockResolvedValue(existingCupon);

            await cuponService.updateCupon('1', updateData);

            const callArgs = mockCuponRepository.update.mock.calls[0][1];
            expect(callArgs.codigo).toBe(existingCupon.codigo);
            expect(callArgs.usoMaximo).toBe(existingCupon.usoMaximo);
            expect(callArgs.usoActual).toBe(existingCupon.usoActual);
        });
    });

    describe('deleteCupon', () => {
        it('should delete an existing coupon', async () => {
            const mockCupon = new Cupon('1', 'DESCUENTO10', 10, new Date('2026-12-31'), true, 100, 0);
            mockCuponRepository.getById.mockResolvedValue(mockCupon);
            mockCuponRepository.delete.mockResolvedValue(true);

            await cuponService.deleteCupon('1');

            expect(mockCuponRepository.delete).toHaveBeenCalledWith('1');
        });

        it('should throw NotFoundError if coupon does not exist', async () => {
            mockCuponRepository.getById.mockResolvedValue(null);

            await expect(cuponService.deleteCupon('999'))
                .rejects.toThrow(NotFoundError);
        });
    });

    describe('usarCupon', () => {
        it('should use a valid active coupon', async () => {
            const mockCupon = new Cupon('1', 'DESCUENTO10', 10, new Date('2026-12-31'), true, 100, 5);
            mockCuponRepository.getByCodigo.mockResolvedValue(mockCupon);
            mockCuponRepository.update.mockResolvedValue({ ...mockCupon, usoActual: 6 });

            const result = await cuponService.usarCupon('DESCUENTO10');

            expect(mockCuponRepository.update).toHaveBeenCalledWith('1', expect.objectContaining({ usoActual: 6 }));
        });

        it('should throw NotFoundError if coupon does not exist', async () => {
            mockCuponRepository.getByCodigo.mockResolvedValue(null);

            await expect(cuponService.usarCupon('NOEXISTE'))
                .rejects.toThrow(NotFoundError);
        });

        it('should throw error if coupon is not active', async () => {
            const inactiveCupon = new Cupon('1', 'DESCUENTO10', 10, new Date('2026-12-31'), false, 100, 5);
            mockCuponRepository.getByCodigo.mockResolvedValue(inactiveCupon);

            await expect(cuponService.usarCupon('DESCUENTO10'))
                .rejects.toThrow('Cupon is not active');
        });

        it('should throw error if coupon has expired', async () => {
            const expiredCupon = new Cupon('1', 'DESCUENTO10', 10, new Date('2020-01-01'), true, 100, 5);
            mockCuponRepository.getByCodigo.mockResolvedValue(expiredCupon);

            await expect(cuponService.usarCupon('DESCUENTO10'))
                .rejects.toThrow('Cupon has expired');
        });

        it('should throw error if coupon has reached maximum uses', async () => {
            const maxedCupon = new Cupon('1', 'DESCUENTO10', 10, new Date('2026-12-31'), true, 100, 100);
            mockCuponRepository.getByCodigo.mockResolvedValue(maxedCupon);

            await expect(cuponService.usarCupon('DESCUENTO10'))
                .rejects.toThrow('Cupon has reached maximum uses');
        });

        it('should increment usoActual by 1', async () => {
            const mockCupon = new Cupon('1', 'DESCUENTO10', 10, new Date('2026-12-31'), true, 100, 50);
            mockCuponRepository.getByCodigo.mockResolvedValue(mockCupon);
            mockCuponRepository.update.mockResolvedValue(mockCupon);

            await cuponService.usarCupon('DESCUENTO10');

            const callArgs = mockCuponRepository.update.mock.calls[0][1];
            expect(callArgs.usoActual).toBe(51);
        });
    });

    describe('deshabilitarCupon', () => {
        it('should disable an active coupon', async () => {
            const activeCupon = new Cupon('1', 'DESCUENTO10', 10, new Date('2026-12-31'), true, 100, 5);
            mockCuponRepository.getById.mockResolvedValue(activeCupon);
            mockCuponRepository.update.mockResolvedValue({ ...activeCupon, activo: false });

            const result = await cuponService.deshabilitarCupon('1');

            expect(mockCuponRepository.update).toHaveBeenCalledWith('1', expect.objectContaining({ activo: false }));
        });

        it('should throw NotFoundError if coupon does not exist', async () => {
            mockCuponRepository.getById.mockResolvedValue(null);

            await expect(cuponService.deshabilitarCupon('999'))
                .rejects.toThrow(NotFoundError);
        });

        it('should throw error if coupon is already disabled', async () => {
            const inactiveCupon = new Cupon('1', 'DESCUENTO10', 10, new Date('2026-12-31'), false, 100, 5);
            mockCuponRepository.getById.mockResolvedValue(inactiveCupon);

            await expect(cuponService.deshabilitarCupon('1'))
                .rejects.toThrow('Cupon is already disabled');
        });
    });

    describe('habilitarCupon', () => {
        it('should enable an inactive coupon', async () => {
            const inactiveCupon = new Cupon('1', 'DESCUENTO10', 10, new Date('2026-12-31'), false, 100, 5);
            mockCuponRepository.getById.mockResolvedValue(inactiveCupon);
            mockCuponRepository.update.mockResolvedValue({ ...inactiveCupon, activo: true });

            const result = await cuponService.habilitarCupon('1');

            expect(mockCuponRepository.update).toHaveBeenCalledWith('1', expect.objectContaining({ activo: true }));
        });

        it('should throw NotFoundError if coupon does not exist', async () => {
            mockCuponRepository.getById.mockResolvedValue(null);

            await expect(cuponService.habilitarCupon('999'))
                .rejects.toThrow(NotFoundError);
        });

        it('should throw error if coupon is already enabled', async () => {
            const activeCupon = new Cupon('1', 'DESCUENTO10', 10, new Date('2026-12-31'), true, 100, 5);
            mockCuponRepository.getById.mockResolvedValue(activeCupon);

            await expect(cuponService.habilitarCupon('1'))
                .rejects.toThrow('Cupon is already enabled');
        });
    });
});
