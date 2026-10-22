import { Router, Request, Response, NextFunction } from "express";
import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

const router = Router();

router.post(
  "/:id/vote",
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = parseInt(req.params.id, 10);
    const userId = (req as Request & { user: { id: number } }).user.id;

    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post id" });
    }

    try {
      const [post] = await prisma.$transaction([
        prisma.post.update({
          where: { id: postId },
          data: { score: { increment: 1 } },
        }),
        prisma.vote.create({
          data: { userId, postId },
        }),
      ]);

      return res.status(201).json({
        message: "Vote recorded successfully",
        score: post.score,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          return res.status(409).json({
            error: "You have already voted on this post",
          });
        }

        if (err.code === "P2025") {
          return res.status(404).json({ error: "Post not found" });
        }
      }

      return next(err);
    }
  }
);

export default router;
