const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


async function create(req, res) {
  try {
    const data = await service.create(req.body.data);
    res.status(201).json({ data });
  } catch (error) {
    console.error("Error in tables controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


async function list(req, res) {
  try {
    const data = await service.list();
    res.json({ data });
  } catch (error) {
    console.error("Error in tables controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function update(req, res, next) {
    const { table_id } = req.params;
    const { reservation_id } = req.body.data;
  
    try {
      const updatedTableId = await service.updateTable(
        table_id,
        reservation_id
      );
  
      res.json({ data: updatedTableId });
    } catch (error) {
      next(error);
    }
  }

  async function destroy(req, res, next) {
    const { table_id } = req.params;
  
    try {
      const updatedSeat = await service.deleteSeat(table_id);
      res.json({ data: updatedSeat });
    } catch (error) {
      next(error);
    }
  }
  


module.exports = {
  create: asyncErrorBoundary(create),
  list: asyncErrorBoundary(list),
  update: asyncErrorBoundary(update),
  destroy:asyncErrorBoundary(destroy)
};

