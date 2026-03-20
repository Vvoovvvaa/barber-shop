import { registerAs } from "@nestjs/config";
import { IAWSConfig } from "../models";

export const cloudconifd = registerAs('CLOUDCONFIG', (): IAWSConfig => {
    return{
        ACCESKEYID: process.env.ACCESKEYID as string,
        SECRETACCESSKEY: process.env.SECRETACCESSKEY as string,
        REGION: process.env.REGION as string,
        BUCKET: process.env.BUCKET as string


    }
})


