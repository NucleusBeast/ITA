import bcrypt from "bcryptjs";
import { Router } from "express";
import { signAccessToken } from "../lib/jwt";
import { getUserByEmailWithPassword, registerUser } from "../data/users-repository";
import { loginSchema, registerSchema } from "../validation/schemas";

export const authRouter = Router();

function getAvatarInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

authRouter.post("/auth/register", async (req, res, next) => {
  try {
    const payload = registerSchema.parse(req.body);

    const existingUser = await getUserByEmailWithPassword(payload.email);
    if (existingUser) {
      res.status(409).json({ error: "User with this email already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);
    const user = await registerUser({
      name: payload.name,
      email: payload.email.toLowerCase(),
      city: payload.city,
      role: payload.role ?? "Attendee",
      avatarInitials: getAvatarInitials(payload.name),
      passwordHash,
    });

    const token = signAccessToken(user.id);
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/auth/login", async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await getUserByEmailWithPassword(payload.email.toLowerCase());

    if (!user?.passwordHash) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isValidPassword = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = signAccessToken(user.id);
    const { passwordHash: _passwordHash, ...safeUser } = user;
    res.status(200).json({ user: safeUser, token });
  } catch (error) {
    next(error);
  }
});
