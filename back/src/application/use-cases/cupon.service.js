const Cupon = require('../../domain/entities/cupon.entity');
const { NotFoundError, ConflictError, BadRequestError } = require('../../domain/errors');

class CuponService {
    constructor(cuponRepository) {
        this.cuponRepository = cuponRepository;
    }

    async getAllCupons() {
        return this.cuponRepository.getAll();
    }

    async getCuponById(id) {
        const cupon = await this.cuponRepository.getById(id);
        if (!cupon) {
            throw new NotFoundError(`Cupon with id ${id} not found`);
        }
        return cupon;
    }

    async getCuponByCodigo(codigo) {
        const cupon = await this.cuponRepository.getByCodigo(codigo);
        if (!cupon) {
            throw new NotFoundError(`Cupon with codigo ${codigo} not found`);
        }
        return cupon;
    }

    async getActiveCupons() {
        return this.cuponRepository.getActivos();
    }

    async createCupon(cuponData) {
        // Business validations
        if (cuponData.descuento < 0 || cuponData.descuento > 100) {
            throw new BadRequestError('Discount must be between 0 and 100');
        }

        if (cuponData.usoMaximo <= 0) {
            throw new BadRequestError('usoMaximo must be greater than 0');
        }

        // Validate expiration date
        const fechaExpiracion = new Date(cuponData.fechaExpiracion);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaExpiracion < hoy) {
            throw new BadRequestError('Expiration date cannot be in the past');
        }

        // Check if code already exists
        const existingCupon = await this.cuponRepository.getByCodigo(cuponData.codigo);
        if (existingCupon) {
            throw new ConflictError(`Cupon with codigo ${cuponData.codigo} already exists`);
        }

        const cuponEntity = new Cupon(
            null,
            cuponData.codigo,
            cuponData.descuento,
            fechaExpiracion,
            cuponData.activo !== undefined ? cuponData.activo : true,
            cuponData.usoMaximo,
            0 // usoActual starts at 0
        );

        return this.cuponRepository.create(cuponEntity);
    }

    async updateCupon(id, cuponData) {
        const existingCupon = await this.cuponRepository.getById(id);
        if (!existingCupon) {
            throw new NotFoundError(`Cupon with id ${id} not found`);
        }

        // Validations
        if (cuponData.descuento !== undefined && (cuponData.descuento < 0 || cuponData.descuento > 100)) {
            throw new BadRequestError('Discount must be between 0 and 100');
        }

        if (cuponData.usoMaximo !== undefined && cuponData.usoMaximo <= 0) {
            throw new BadRequestError('usoMaximo must be greater than 0');
        }

        if (cuponData.fechaExpiracion) {
            const fechaExpiracion = new Date(cuponData.fechaExpiracion);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            if (fechaExpiracion < hoy) {
                throw new BadRequestError('Expiration date cannot be in the past');
            }
        }

        const cuponEntity = new Cupon(
            id,
            cuponData.codigo || existingCupon.codigo,
            cuponData.descuento !== undefined ? cuponData.descuento : existingCupon.descuento,
            cuponData.fechaExpiracion ? new Date(cuponData.fechaExpiracion) : existingCupon.fechaExpiracion,
            cuponData.activo !== undefined ? cuponData.activo : existingCupon.activo,
            cuponData.usoMaximo !== undefined ? cuponData.usoMaximo : existingCupon.usoMaximo,
            cuponData.usoActual !== undefined ? cuponData.usoActual : existingCupon.usoActual
        );

        return this.cuponRepository.update(id, cuponEntity);
    }

    async deleteCupon(id) {
        const cupon = await this.cuponRepository.getById(id);
        if (!cupon) {
            throw new NotFoundError(`Cupon with id ${id} not found`);
        }
        return this.cuponRepository.delete(id);
    }

    async usarCupon(codigo) {
        const cupon = await this.cuponRepository.getByCodigo(codigo);
        if (!cupon) {
            throw new NotFoundError(`Cupon with codigo ${codigo} not found`);
        }

        if (!cupon.activo) {
            throw new BadRequestError('Cupon is not active');
        }

        const hoy = new Date();
        const fechaExpiracion = new Date(cupon.fechaExpiracion);
        if (fechaExpiracion < hoy) {
            throw new BadRequestError('Cupon has expired');
        }

        if (cupon.usoActual >= cupon.usoMaximo) {
            throw new BadRequestError('Cupon has reached maximum uses');
        }

        const cuponEntity = new Cupon(
            cupon.id,
            cupon.codigo,
            cupon.descuento,
            cupon.fechaExpiracion,
            cupon.activo,
            cupon.usoMaximo,
            cupon.usoActual + 1
        );

        return this.cuponRepository.update(cupon.id, cuponEntity);
    }

    async deshabilitarCupon(id) {
        const cupon = await this.cuponRepository.getById(id);
        if (!cupon) {
            throw new NotFoundError(`Cupon with id ${id} not found`);
        }

        if (!cupon.activo) {
            throw new BadRequestError('Cupon is already disabled');
        }

        const cuponEntity = new Cupon(
            cupon.id,
            cupon.codigo,
            cupon.descuento,
            cupon.fechaExpiracion,
            false,
            cupon.usoMaximo,
            cupon.usoActual
        );

        return this.cuponRepository.update(cupon.id, cuponEntity);
    }

    async habilitarCupon(id) {
        const cupon = await this.cuponRepository.getById(id);
        if (!cupon) {
            throw new NotFoundError(`Cupon with id ${id} not found`);
        }

        if (cupon.activo) {
            throw new BadRequestError('Cupon is already enabled');
        }

        const cuponEntity = new Cupon(
            cupon.id,
            cupon.codigo,
            cupon.descuento,
            cupon.fechaExpiracion,
            true,
            cupon.usoMaximo,
            cupon.usoActual
        );

        return this.cuponRepository.update(cupon.id, cuponEntity);
    }
}

module.exports = CuponService;
