-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
