const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGO_URI);
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("MongoDB Connected Successfully");
    
    // Log database name
    console.log('Connected to database:', mongoose.connection.name);
    
    // Log collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error("MongoDB Connection Failed:");
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
