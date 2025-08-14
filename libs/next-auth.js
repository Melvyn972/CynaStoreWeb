import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import config from "@/config";
import prisma from "./prisma";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    }),
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false
        }
      },
      from: process.env.SMTP_USER,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const { sendEmail } = await import("@/libs/smtp");
        
        await sendEmail({
          to: identifier,
          subject: "CynaStore - Connexion sécurisée",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
              <div style="background: white; padding: 30px; border-radius: 8px; color: #333;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #6366f1; margin: 0; font-size: 28px; font-weight: bold;">CynaStore</h1>
                  <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Plateforme de vente en ligne</p>
                </div>
                
                <h2 style="color: #333; text-align: center; margin-bottom: 25px; font-size: 24px;">Connexion sécurisée</h2>
                
                <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
                  Bonjour,<br>
                  Vous avez demandé à vous connecter à votre compte CynaStore. Pour accéder à votre espace personnel, veuillez cliquer sur le bouton ci-dessous :
                </p>
                
                <div style="text-align: center; margin: 35px 0;">
                  <a href="${url}" 
                     style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3); transition: all 0.3s ease;">
                    🔐 Se connecter à CynaStore
                  </a>
                </div>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #6366f1;">
                  <p style="margin: 0 0 10px 0; color: #374151; font-weight: bold;">⚠️ Informations importantes :</p>
                  <ul style="margin: 0; padding-left: 20px; color: #6b7280;">
                    <li>Ce lien expire dans <strong>15 minutes</strong> pour des raisons de sécurité</li>
                    <li>Ne partagez jamais ce lien avec quelqu'un d'autre</li>
                    <li>Si vous n'avez pas demandé cette connexion, ignorez cet email</li>
                  </ul>
                </div>
                
                <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
                  Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                  <a href="${url}" style="color: #6366f1; word-break: break-all;">${url}</a>
                </p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                
                <div style="text-align: center; color: #9ca3af; font-size: 12px;">
                  <p style="margin: 0;">Cet email a été envoyé automatiquement par CynaStore</p>
                  <p style="margin: 5px 0 0 0;">Pour toute question, contactez notre support</p>
                </div>
              </div>
            </div>
          `,
          text: `
            CynaStore - Connexion sécurisée
            
            Bonjour,
            
            Vous avez demandé à vous connecter à votre compte CynaStore. 
            Pour accéder à votre espace personnel, cliquez sur le lien suivant :
            
            ${url}
            
            ⚠️ Informations importantes :
            - Ce lien expire dans 15 minutes pour des raisons de sécurité
            - Ne partagez jamais ce lien avec quelqu'un d'autre
            - Si vous n'avez pas demandé cette connexion, ignorez cet email
            
            Cordialement,
            L'équipe CynaStore
          `
        });
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    verifyRequest: "/auth/verify?in=login",
  },
  theme: {
    brandColor: config.colors.main,
      logo: `https://${config.domainName}/logoAndName.png`,
  },
};
