import { RequestHandler } from "express";
import {
  StudentLoginRequest,
  AdminLoginRequest,
  AuthResponse,
} from "@shared/api";
import { authenticateStudent, authenticateAdmin } from "../db";

export const handleStudentLogin: RequestHandler<
  {},
  AuthResponse,
  StudentLoginRequest
> = (req, res) => {
  const { registrationNumber } = req.body;

  if (!registrationNumber || typeof registrationNumber !== "string") {
    return res.status(400).json({
      success: false,
      message: "Registration number is required",
    });
  }

  if (authenticateStudent(registrationNumber)) {
    res.json({
      success: true,
      token: `student_${registrationNumber}_${Date.now()}`,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid registration number",
    });
  }
};

export const handleAdminLogin: RequestHandler<
  {},
  AuthResponse,
  AdminLoginRequest
> = (req, res) => {
  const { adminId, password } = req.body;

  if (
    !adminId ||
    !password ||
    typeof adminId !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Admin ID and password are required",
    });
  }

  if (authenticateAdmin(adminId, password)) {
    res.json({
      success: true,
      token: `admin_${adminId}_${Date.now()}`,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid admin credentials",
    });
  }
};
