class CuponController {
    constructor(cuponService) {
        this.cuponService = cuponService;
    }

    getAll = async (req, res) => {
        const cupons = await this.cuponService.getAllCupons();
        res.status(200).json(cupons);
    }

    getById = async (req, res) => {
        const { id } = req.params;
        const cupon = await this.cuponService.getCuponById(id);
        res.status(200).json(cupon);
    }

    getByCodigo = async (req, res) => {
        const { codigo } = req.params;
        const cupon = await this.cuponService.getCuponByCodigo(codigo);
        res.status(200).json(cupon);
    }

    getActivos = async (req, res) => {
        const cupons = await this.cuponService.getActiveCupons();
        res.status(200).json(cupons);
    }

    create = async (req, res) => {
        const cupon = await this.cuponService.createCupon(req.body);
        res.status(201).json(cupon);
    }

    update = async (req, res) => {
        const { id } = req.params;
        const cupon = await this.cuponService.updateCupon(id, req.body);
        res.status(200).json(cupon);
    }

    delete = async (req, res) => {
        const { id } = req.params;
        await this.cuponService.deleteCupon(id);
        res.status(204).send();
    }

    usar = async (req, res) => {
        const { codigo } = req.params;
        const cupon = await this.cuponService.usarCupon(codigo);
        res.status(200).json(cupon);
    }

    deshabilitar = async (req, res) => {
        const { id } = req.params;
        const cupon = await this.cuponService.deshabilitarCupon(id);
        res.status(200).json(cupon);
    }

    habilitar = async (req, res) => {
        const { id } = req.params;
        const cupon = await this.cuponService.habilitarCupon(id);
        res.status(200).json(cupon);
    }
}

module.exports = CuponController;
