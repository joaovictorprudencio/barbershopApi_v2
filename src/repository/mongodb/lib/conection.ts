import mongoose from "mongoose";


export const mongooseDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.DATABASE_URL as string);
        console.log("conexão")
    }
    catch(e) {
        console.log(`erro ${e}`)
        process.exit(1);
    }
}

