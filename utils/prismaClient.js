// prismaClient.js
const { PrismaClient } = require("@prisma/client");

const prismaClientSingleton = () => {
    return new PrismaClient({
        errorFormat: "pretty", // Improves error formatting
        log: ["query", "info", "warn", "error"], // Enable detailed logging
    });
};

// Use globalThis to maintain a single instance across hot reloads
globalThis.prismaGlobal = globalThis.prismaGlobal || prismaClientSingleton();

// Reuse existing instance if available, otherwise create a new one
const prisma = globalThis.prismaGlobal;

if (process.env.NODE_ENV !== "production") {
    globalThis.prismaGlobal = prisma;
}

// Graceful shutdown for Prisma Client
const gracefulShutdown = async () => {
    await prisma.$disconnect();
    console.log("Prisma Client disconnected");
    process.exit(0);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

module.exports = prisma;
