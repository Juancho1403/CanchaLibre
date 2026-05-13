const { DataTypes } = require("sequelize");

async function ensureEmpresaMetodosPago(sequelize, EmpresaModel) {
  const qi = sequelize.getQueryInterface();
  const tableName = EmpresaModel.tableName;
  try {
    const desc = await qi.describeTable(tableName);
    if (desc.metodos_pago) return;
    await qi.addColumn(tableName, "metodos_pago", {
      type: DataTypes.TEXT,
      allowNull: true,
    });
    console.log(`✅ Columna ${tableName}.metodos_pago agregada`);
  } catch (e) {
    console.warn("ensureSchema empresa:", e.message);
  }
}

async function ensureCanchaAlquiler(sequelize, CanchaModel) {
  const qi = sequelize.getQueryInterface();
  const t = CanchaModel.tableName;
  const cols = [
    ["hora_inicio", { type: DataTypes.STRING(5), allowNull: true, defaultValue: "17:00" }],
    ["hora_fin", { type: DataTypes.STRING(5), allowNull: true, defaultValue: "22:00" }],
    ["jugadores_min", { type: DataTypes.INTEGER, allowNull: true, defaultValue: 10 }],
    ["jugadores_max", { type: DataTypes.INTEGER, allowNull: true, defaultValue: 20 }],
  ];
  try {
    let desc = await qi.describeTable(t);
    for (const [name, opts] of cols) {
      if (desc[name]) continue;
      await qi.addColumn(t, name, opts);
      console.log(`✅ Columna ${t}.${name} agregada`);
      desc = await qi.describeTable(t);
    }
  } catch (e) {
    console.warn("ensureSchema cancha:", e.message);
  }
}

/**
 * Columnas nuevas en bases ya existentes.
 */
async function ensureSchema(sequelize, EmpresaModel, CanchaModel) {
  await ensureEmpresaMetodosPago(sequelize, EmpresaModel);
  if (CanchaModel) await ensureCanchaAlquiler(sequelize, CanchaModel);
}

module.exports = { ensureSchema };
