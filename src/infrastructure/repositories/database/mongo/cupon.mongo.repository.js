const CuponRepository = require('../../../../domain/repositories/cupon.repository.interface');
const CuponModel = require('./models/cupon.model');
const Cupon = require('../../../../domain/entities/cupon.entity');

class CuponMongoRepository extends CuponRepository {
    async getAll() {
        const cupon = await CuponModel.find();
        return cupon.map(p => new Cupon(p._id.toString(),
        p.id_user.toString(), 
        p.init_date.toString(),
        p.end_date.toString(),
        p.value.toString(),
        
    ));
    }

    async getById(id) {
        const cupon = await CuponModel.findById(id);
        if (!cupon) return null;
        return new Cupon(
            cupon._id.toString(), 
        cupon.id_user,
         cupon.init_date,
         cupon.end_date,
         cupon.value
        
        );
    }

    async create(cuponEntity) {

         console.log('Recibiendo cuponEntity:', cuponEntity);

        const newCupon = new CuponModel({
            id_user: cuponEntity.id_user,
            init_date: cuponEntity.init_date,
            end_date: cuponEntity.end_date,
            value: cuponEntity.value
            
        });
        const savedCupon = await newCupon.save();
        return new Cupon(savedCupon._id.toString(), 
        savedCupon.id_user.toString(), 
        savedCupon.init_date,
            savedCupon.end_date,
            savedCupon.value
    
    )
        
        
        ;
    }

    async update(id, cuponEntity) {


        const updatedCupon = await CuponModel.findByIdAndUpdate(id, {

            id_user: cuponEntity.id_user,
            init_date: cuponEntity.init_date,
            end_date: cuponEntity.end_date,
            value: cuponEntity.value
        }, { new: true });

        if (!updatedCupon) return null;
        return new Cupon
        (updatedCupon._id.toString(), 
        updatedCupon.id_user, 
        updatedCupon.init_date,
        updatedCupon.end_date, 
        updatedCupon.value
    
    );
    }

    async delete(id) {
        await OrderModel.findByIdAndDelete(id);
    }
}

module.exports = CuponMongoRepository;