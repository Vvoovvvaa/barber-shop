import { registerAs } from "@nestjs/config";

export const googleconfid = registerAs('googleconfid',() => {
    return{
        
        Google_Client_ID:process.env.Google_Client_ID,
        Google_Client_Secret: process.env.Google_Client_Secret,
        Google_Redirect_Url: process.env.Google_Redirect_Url

    }
})
