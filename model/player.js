const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const Schema = mongoose.Schema;
const playerSchema = new Schema(
  {
    name: { type: String, require: true },
    image: { type: String, require: true },
    career: { type: String },
    position: { type: String, require: true },
    goals: { type: Number, require: true, default: 0 },
    nation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "nations",
      require: true,
    },
    isCaptain: { type: Boolean, default: false  },
  },
  { timestamps: true }
);

var players = mongoose.model("players", playerSchema);

module.exports = players;
