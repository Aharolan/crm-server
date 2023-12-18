const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const coursesController = require("./controllers/coursesController");
const filesController = require("./controllers/filesopreationcontroler");
const classController = require("./controllers/ClassController");
const candidates = require("./controllers/CandidateController");
const users = require("./controllers/usersController");
const sorting_days = require("./controllers/sortingDayController");
const customer = require("./controllers/customerController");
const graduates = require("./controllers/graduatesController.js");
const users = require("./controllers/usersController.js");
const sorting_days = require("./controllers/sortingDayController");
const interviews = require("./controllers/InterviewsControler.js");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use("/class", classController);
app.use("/courses", coursesController);
app.use("/files", filesController);
app.use("/candidate", candidates);
app.use("/users", users);
app.use("/sorting_day", sorting_days);
app.use("/customers", customer);
app.use("/graduates", graduates);
app.use("/interviews", interviews);

app.get("/getfile/:filename", (req, res) => {
  let filename = req.params.filename;
  const encoded = encodeURIComponent(filename);
  app.use(
    `/down/${encoded}`,
    express.static(`./files/${req.params.filename}`, {
      setHeaders: (res) => {
        res.setHeader(
          "Content-Disposition",
          `attachment; filename*=UTF-8''${encoded}`
        );
      },
    })
  );
  res.send(`/down/${encoded}`);
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`server is run in ${PORT}`);
});
