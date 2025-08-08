import { UserInfo } from "../../../../models/UserInfo";
import bcrypt from "bcrypt";
import dbConnect from '../../../../utils/dbConnect';
import { User } from '../../../../models/User';
import NextAuthModule, { getServerSession } from "next-auth";
import CredentialsProviderModule from "next-auth/providers/credentials";
import GoogleProviderModule from "next-auth/providers/google";
import GitHubProviderModule from "next-auth/providers/github";

const NextAuth = NextAuthModule.default;
const CredentialsProvider = CredentialsProviderModule.default;
const GoogleProvider = GoogleProviderModule.default;
const GitHubProvider = GitHubProviderModule.default;

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  debug: false, // Disable debug mode to reduce console noise
  logger: {
    error(code, metadata) {
      if (code !== 'CLIENT_FETCH_ERROR') {
        console.error('NextAuth Error:', code, metadata);
      }
    },
    warn(code) {
      if (code !== 'DEBUG_ENABLED') {
        console.warn('NextAuth Warning:', code);
      }
    },
    debug: () => {}, // Disable debug logs
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Always redirect to home page after sign in
      return baseUrl;
    },
    async jwt({ token, user, account }) {
      if (user?._id) token._id = user._id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      if (account?.provider && account.provider !== 'credentials') {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      if (token?.provider) session.user.provider = token.provider;
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          await dbConnect();

          // Check if user already exists
          let existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user for OAuth
            const username = user.email.split('@')[0] + '_' + account.provider;
            let finalUsername = username;

            // Ensure username is unique
            let counter = 1;
            while (await User.findOne({ username: finalUsername })) {
              finalUsername = `${username}_${counter}`;
              counter++;
            }

            existingUser = await User.create({
              username: finalUsername,
              email: user.email,
              name: user.name || user.email.split('@')[0],
              image: user.image,
              provider: account.provider,
              providerId: account.providerAccountId,
              password: null // OAuth users don't have passwords
            });

            // Create basic UserInfo for new OAuth users
            const userInfo = await UserInfo.create({
              name: user.name || user.email.split('@')[0],
              petEmoji: "🐱",
              currentRating: 800,
              problemsSolved: { total: 0, easy: 0, medium: 0, hard: 0 }
            });

            existingUser.userInfo = userInfo._id;
            await existingUser.save();

            // Mark as new user for profile setup redirect
            user.isNewUser = true;
          } else if (!existingUser.provider) {
            // Update existing user to include OAuth info
            existingUser.provider = account.provider;
            existingUser.providerId = account.providerAccountId;
            if (user.image && !existingUser.image) {
              existingUser.image = user.image;
            }
            await existingUser.save();
          }

          // Store user ID for JWT
          user._id = existingUser._id;
          user.isAdmin = existingUser.isAdmin || false;

          return true;
        } catch (error) {
          console.error('OAuth sign in error:', error);
          return false;
        }
      }
      return true;
    }
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email"
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email or Username" },
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const emailOrUsername = credentials?.email || credentials?.username;
        const password = credentials?.password;

        if (!emailOrUsername || !password) {
          return null;
        }

        await dbConnect();

        // Check if input is email or username
        let user;
        if (emailOrUsername.includes('@')) {
          // It's an email
          user = await User.findOne({ email: emailOrUsername });
        } else {
          // It's a username
          user = await User.findOne({ username: emailOrUsername });
        }

        if (!user) {
          return null;
        }

        const passwordOk = bcrypt.compareSync(password, user.password);
        if (passwordOk) {
          return {
            _id: user._id,
            email: user.email,
            username: user.username,
            userInfo: user.userInfo
          };
        }

        return null;
      }
    })
  ],
};

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return false;
  }
  const userInfo = await UserInfo.findOne({ email: userEmail });
  if (!userInfo) {
    return false;
  }
  return userInfo.admin;
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }