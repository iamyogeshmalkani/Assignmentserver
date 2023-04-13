import bodyParser from "body-parser"
import cors from "cors"
import express from "express"
// import blogsRoutes from "./routes/blogs.js"
// import personalInfoRoutes from "./routes/persoal_info.js"
// import socialMediaRoutes from "./routes/socialmedia.js"
// import testimonialsRoutes from "./routes/testimonials.js"
// import servicesRoute from "./routes/services.js"
import authRoutes from "./routes/auth.js";
import carRoutes from "./routes/cars.js";
import connection from "./database.js";
import path from 'path';
import { fileURLToPath } from 'url';
// import bannerRoutes from "./routes/banner.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true
}));
const port = 4000;

app.use("/auth", authRoutes);
app.use("/cars", carRoutes);
// app.use("/services", servicesRoute)
// app.use("/socials", socialMediaRoutes)
// app.use("/testimonials", testimonialsRoutes)
// app.use("/banner", bannerRoutes)

app.listen(port, () =>
    console.log(`server is listening at http://localhost:${port}`)
);