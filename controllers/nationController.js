const Nations = require("../model/nation");
const Players = require("../model/player");
class NationController {
  index(req, res, next) {
    Nations.find({})
      .then((nations) => {
        res.render("nationSite", {
          title: "The list of Nations",
          nations: nations,
          isLogin: {name: req.name, role:req.role}
        });
      })
      .catch(next);
  }
  create(req, res, next) {
    const dataNew = {
      name: req.body.name.trim(),
      description: req.body.description.trim(),
    }
    const nation = new Nations(dataNew);
    Nations.find({ name: nation.name }).then((nationCheck) => {
      if (nationCheck.length > 0) {
        req.flash("error_msg", "Duplicate nation name!");
        res.redirect("/nations");
      } else {
        nation
          .save()
          .then(() => res.redirect("/nations"))
          .catch(next);
      }
    });
  }
  formEdit(req, res, next) {
    const nationId = req.params.nationId;
    Nations.findById(nationId)
      .then((nation) => {
        res.render("editNation", {
          title: "The detail of Nation",
          nation: nation,
          isLogin: {name: req.name, role:req.role}
        });
      })
      .catch(next);
  }
  edit(req, res, next) {
    const dataNew = {
      name: req.body.name.trim(),
      description: req.body.description.trim(),
    }
    Nations.updateOne({ _id: req.params.nationId }, dataNew)
      .then(() => {
        return res.redirect("/nations");
      })
      .catch((err) => {
        console.log("error update: ", err);
        req.flash("error_msg", "Duplicate nation name!");
        res.redirect(`/nations/edit/${req.params.nationId}`);
      });
  }
  delete(req, res, next) {
    Players.find({ nation: req.params.nationId })
      .populate("nation")
      .then((data) => {
        if (data.length > 0) {
          req.flash(
            "error_msg",
            `You can not delete this nation because it has already been connected with other players`
          );
          return res.redirect("/nations");
        } else {
          Nations.findByIdAndDelete({ _id: req.params.nationId })
            .then(() => res.redirect("/nations"))
            .catch(next);
        }
      })
      .catch(next);
  }
}
module.exports = new NationController();
