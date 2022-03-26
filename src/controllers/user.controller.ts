import { Request, Response } from "express";
import { nanoid } from "nanoid";
import {
  CreateUserInput,
  ForgotPasswordInput,
  VerifyUserInput,
} from "../schema/user.schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../services/user.service";
import log from "../utils/logger";
import sendEmail from "../utils/mailer";

export async function createUserHandler(req: Request, res: Response) {
  const body: CreateUserInput = req.body;

  try {
    // Create User
    const user = await createUser(body);

    // Send verification email
    await sendEmail({
      from: "test@example.com",
      to: user.email,
      subject: "Please verify your account",
      text: `verification code ${user.verificationCode}. Id: ${user._id}`,
    });

    // log.info(user);
    return res.send("User successfully created.");
  } catch (err: any) {
    if (err.code === 11000) {
      /* 11000 is the code for unique
         constraint voilation. */
      return res.status(409).send("Account already exists");
    }

    return res.status(500).send(err);
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  const { id, verificationCode } = req.params;

  const user = await findUserById(id);

  // check to see if user exist
  if (!user) {
    return res.send("Could not verify user");
  }

  // check to see if they are already verified
  if (user.verified) {
    return res.send("User is already verified");
  }

  // check to see if the verificationCode matches
  if (user.verificationCode === verificationCode) {
    user.verified = true;

    await user.save();

    return res.send("User successfully verified");
  }

  return res.send("Could not verify user");
}

export async function forgotPasswordHandler(req: Request, res: Response) {
  const body: ForgotPasswordInput = req.body;
  const { email } = body;

  const msg =
    "If a user with that email is registered you will receive a password reset email";

  // 1. Find User -->
  const user = await findUserByEmail(email);

  // 2. confirm the user exist -->
  if (!user) {
    log.debug(`User with email ${email} does not exists`);
    return res.send(msg);
  }

  // 3. confirm the user is verify -->
  if (!user.verified) {
    return res.send("User is not verified");
  }

  // 4. Generate password reset code -->
  const passwordResetCode = nanoid();

  // 5. Save password reset code in DB -->
  user.passwordReset = passwordResetCode;
  await user.save();

  // 6. Send email to user after save -->
  await sendEmail({
    to: user.email,
    from: "test@example.com",
    subject: "Reset your password",
    text: `Password reset code: ${passwordResetCode} | Id ${user._id}`,
  });
}
