const mongoose = require('mongoose');

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("connect successfully ✅ !!!"))
    .catch((err) => console.log("connect failed ❌: ", err));

