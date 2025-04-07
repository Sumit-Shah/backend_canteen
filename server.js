const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.status(200).send('welcome');

});

const PORT = 5000;
app.listen(PORT, () => n{
    console.log(`server is running at port: ${PORT}`);
});
