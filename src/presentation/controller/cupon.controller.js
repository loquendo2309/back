class CuponController {
    constructor(cuponService) { // Depende del Caso de Uso
        this.cuponService = cuponService;
    }
    
    getAll = async (req, res) => { // Usamos arrow fn para no perder el 'this'
        const order = await this.cuponService.getAllCupons();
        res.status(200).json(order);
    }

    getById = async (req, res) => {
        const { id } = req.params;
        const cupon = await this.cuponService.getCuponById(id);
        if (cupon) {
            res.status(200).json(cupon);
        } else {
            res.status(404).json({ message: 'CUpon not found' });
        }
    }

    create = async (req, res) => {
        const cupon = await this.cuponService.createCupon(req.body);
        res.status(201).json(cupon); // 201 Created! 
    }

    update = async (req, res) => {
        const { id } = req.params;
              console.log('de id de controller:', { id } );

        const cupon = await this.cuponService.updateCupon(id, req.body);
        if (cupon) {
            res.status(200).json(cupon);
        } else {
            res.status(404).json({ message: 'Cupon not found' });
        }
    }

    delete = async (req, res) => {
        const { id } = req.params;
        await this.cuponService.deleteCupon(id);
        res.status(204).send(); // 204 No Content
    }
}
module.exports = CuponController;

