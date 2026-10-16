require('dotenv').config();
const app = require('./app');
const prisma = require('./utils/prisma');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Verify MySQL database connection
    await prisma.$connect();
    console.log('✅ Connected to MySQL database via Prisma ORM.');

    app.listen(PORT, () => {
      console.log(`🚀 AWS Learning Platform Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to MySQL database:', err);
    process.exit(1);
  }
}

startServer();
