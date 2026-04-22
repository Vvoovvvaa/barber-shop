import { BadRequestException } from "@nestjs/common";

export function buildQuery(email?: string, phone?: string) {
    if (email) return { email };
    if (phone) return { phone };
    throw new BadRequestException('Email or phone is required');
  }
