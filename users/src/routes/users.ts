import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getUserById, updateUserById } from "../data/users-repository";
import { updateUserSchema } from "../validation/schemas";

export const usersRouter = Router();

usersRouter.get("/users/me", requireAuth, async (req, res, next) => {
  try {
    const user = await getUserById(req.auth!.userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/users/:id", async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
});

usersRouter.patch("/users/:id", requireAuth, async (req, res, next) => {
  try {
    if (req.auth!.userId !== req.params.id) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const payload = updateUserSchema.parse(req.body);
    const updatedUser = await updateUserById(req.params.id, payload);

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
});
