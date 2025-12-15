class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }

    getAll = async (req, res) => {
        const orders = await this.orderService.getAllOrders();
        res.status(200).json(orders);
    }

    getById = async (req, res) => {
        const { id } = req.params;
        const order = await this.orderService.getOrderById(id);
        res.status(200).json(order);
    }

    getByEstado = async (req, res) => {
        const { estado } = req.params;
        const orders = await this.orderService.getOrdersByEstado(estado);
        res.status(200).json(orders);
    }

    create = async (req, res) => {
        const order = await this.orderService.createOrder(req.body);
        res.status(201).json(order);
    }

    update = async (req, res) => {
        const { id } = req.params;
        const order = await this.orderService.updateOrder(id, req.body);
        res.status(200).json(order);
    }

    delete = async (req, res) => {
        const { id } = req.params;
        await this.orderService.deleteOrder(id);
        res.status(204).send();
    }

    cancel = async (req, res) => {
        const { id } = req.params;
        const order = await this.orderService.cancelOrder(id);
        res.status(200).json(order);
    }
}

module.exports = OrderController;
