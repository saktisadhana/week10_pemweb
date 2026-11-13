import type { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";

function handleDatabaseError(error: unknown, res: Response): void {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    res.status(404).json({ message: "Data tidak ditemukan" });
    return;
  }
  console.error("Operasi database mahasiswa gagal", {
    type: error instanceof Error ? error.name : "UnknownError",
    code: error instanceof Prisma.PrismaClientKnownRequestError ? error.code : undefined,
  });
  res.status(500).json({ message: "Terjadi kesalahan saat mengakses database" });
}

export async function getHello(req: Request, res: Response): Promise<void> {
  const nama = typeof req.query.nama === "string" ? req.query.nama : "World";

  try {
    const data = await prisma.mahasiswa.findMany({ orderBy: { id: "asc" } });

    res.status(200).json({
      message: `Halo, ${nama}!`,
      data,
    });
  } catch (error) {
    handleDatabaseError(error, res);
  }
}

export async function postHello(req: Request, res: Response): Promise<void> {
  const { nama } = req.body ?? {};

  if (typeof nama !== "string" || nama.trim() === "") {
    res.status(400).json({ message: "nama wajib berupa teks dan tidak boleh kosong" });
    return;
  }

  try {
    const dataBaru = await prisma.mahasiswa.create({
      data: { nama: nama.trim() },
    });

    res.status(201).json({
      message: "Data berhasil ditambahkan",
      data: dataBaru,
    });
  } catch (error) {
    handleDatabaseError(error, res);
  }
}

export async function putHello(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0 || id > 2147483647) {
    res.status(400).json({ message: "id wajib berupa bilangan bulat positif dalam rentang Int PostgreSQL" });
    return;
  }

  const { nama } = req.body ?? {};

  if (typeof nama !== "string" || nama.trim() === "") {
    res.status(400).json({ message: "nama wajib berupa teks dan tidak boleh kosong" });
    return;
  }

  try {
    const data = await prisma.mahasiswa.update({
      where: { id },
      data: { nama: nama.trim() },
    });

    res.status(200).json({
      message: "Data berhasil diganti",
      data,
    });
  } catch (error) {
    handleDatabaseError(error, res);
  }
}

export async function deleteHello(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0 || id > 2147483647) {
    res.status(400).json({ message: "id wajib berupa bilangan bulat positif dalam rentang Int PostgreSQL" });
    return;
  }

  try {
    await prisma.mahasiswa.delete({ where: { id } });

    res.status(200).json({
      message: "Data berhasil dihapus",
    });
  } catch (error) {
    handleDatabaseError(error, res);
  }
}
