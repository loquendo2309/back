const CuponRepository = require('../../../../domain/repositories/cupon.repository.interface');
const CuponModel = require('./models/cupon.model');
const Cupon = require('../../../../domain/entities/cupon.entity');

class CuponMongoRepository extends CuponRepository {
    async getAll() {
        const cupons = await CuponModel.find().sort({ createdAt: -1 });
        return cupons.map(c => new Cupon(
            c._id.toString(),
            c.codigo,
            c.descuento,
            c.fechaExpiracion,
            c.activo,
            c.usoMaximo,
            c.usoActual
        ));
    }

    async getById(id) {
        const cupon = await CuponModel.findById(id);
        if (!cupon) return null;
        return new Cupon(
            cupon._id.toString(),
            cupon.codigo,
            cupon.descuento,
            cupon.fechaExpiracion,
            cupon.activo,
            cupon.usoMaximo,
            cupon.usoActual
        );
    }

    async getByCodigo(codigo) {
        const cupon = await CuponModel.findOne({ codigo: codigo.toUpperCase() });
        if (!cupon) return null;
        return new Cupon(
            cupon._id.toString(),
            cupon.codigo,
            cupon.descuento,
            cupon.fechaExpiracion,
            cupon.activo,
            cupon.usoMaximo,
            cupon.usoActual
        );
    }

    async create(cuponEntity) {
        const newCupon = new CuponModel({
            codigo: cuponEntity.codigo,
            descuento: cuponEntity.descuento,
            fechaExpiracion: cuponEntity.fechaExpiracion,
            activo: cuponEntity.activo,
            usoMaximo: cuponEntity.usoMaximo,
            usoActual: cuponEntity.usoActual || 0
        });
        const savedCupon = await newCupon.save();
        return new Cupon(
            savedCupon._id.toString(),
            savedCupon.codigo,
            savedCupon.descuento,
            savedCupon.fechaExpiracion,
            savedCupon.activo,
            savedCupon.usoMaximo,
            savedCupon.usoActual
        );
    }

    async update(id, cuponEntity) {
        const updatedCupon = await CuponModel.findByIdAndUpdate(id, {
            codigo: cuponEntity.codigo,
            descuento: cuponEntity.descuento,
            fechaExpiracion: cuponEntity.fechaExpiracion,
            activo: cuponEntity.activo,
            usoMaximo: cuponEntity.usoMaximo,
            usoActual: cuponEntity.usoActual
        }, { new: true });

        if (!updatedCupon) return null;
        return new Cupon(
            updatedCupon._id.toString(),
            updatedCupon.codigo,
            updatedCupon.descuento,
            updatedCupon.fechaExpiracion,
            updatedCupon.activo,
            updatedCupon.usoMaximo,
            updatedCupon.usoActual
        );
    }

    async delete(id) {
        await CuponModel.findByIdAndDelete(id);
    }

    async getActivos() {
        const cupons = await CuponModel.find({ activo: true }).sort({ createdAt: -1 });
        return cupons.map(c => new Cupon(
            c._id.toString(),
            c.codigo,
            c.descuento,
            c.fechaExpiracion,
            c.activo,
            c.usoMaximo,
            c.usoActual
        ));
    }
}

module.exports = CuponMongoRepository;
