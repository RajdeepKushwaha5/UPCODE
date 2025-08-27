import { UserInfo } from "../../../../models/UserInfo";
import bcrypt from "bcrypt";
import dbConnect from '../../../../utils/dbConnect';
import { User } from '../../../../models/User';
import NextAuth, { getServerSession } from "next-auth";
import CredentialsProviderModule from "next-auth/providers/credentials";
import GoogleProviderModule from "next-auth/providers/google";
import GitHubProviderModule from "next-auth/providers/github";

// Handle ES module / CommonJS compatibility
const CredentialsProvider = CredentialsProviderModule.default || CredentialsProviderModule;
const GoogleProvider = GoogleProviderModule.default || GoogleProviderModule;
const GitHubProvider = GitHubProviderModule.default || GitHubProviderModule;

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/auth/error",
    signOut: "/login",
  },
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug mode in development
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata);
    },
    warn(code) {
      console.warn('NextAuth Warning:', code);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === 'development') {
        console.log('NextAuth Debug:', code, metadata);
      }
    },
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      
      // For OAuth callbacks, check if we need to redirect new users to profile setup
      if (url.includes('/api/auth/callback/')) {
        // Default redirect for OAuth
        return `${baseUrl}/dashboard`;
      }
      
      return baseUrl;
    },
    async jwt({ token, user, account }) {
      if (user?._id) token._id = user._id;
      if (user?.username) token.username = user.username;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      if (user?.isNewUser !== undefined) token.isNewUser = user.isNewUser;
      if (user?.needsProfileSetup !== undefined) token.needsProfileSetup = user.needsProfileSetup;
      if (user?.hasProfile !== undefined) token.hasProfile = user.hasProfile;
      if (account?.provider && account.provider !== 'credentials') {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?.username) session.user.username = token.username;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      if (token?.provider) session.user.provider = token.provider;
      if (token?.isNewUser !== undefined) session.user.isNewUser = token.isNewUser;
      if (token?.needsProfileSetup !== undefined) session.user.needsProfileSetup = token.needsProfileSetup;
      if (token?.hasProfile !== undefined) session.user.hasProfile = token.hasProfile;
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          await dbConnect();

          // Check if user already exists by email
          let existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // NEW USER SCENARIO - Sign Up via OAuth
            console.log(`Creating new user for ${account.provider} OAuth: ${user.email}`);
            
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
              password: null, // OAuth users don't have passwords
              isEmailVerified: true, // OAuth emails are already verified
              createdAt: new Date()
            });

            // Create comprehensive UserInfo for new OAuth users
            const userInfo = await UserInfo.create({
              name: user.name || user.email.split('@')[0],
              petEmoji: "🐱",
              currentRating: 800,
              problemsSolved: { total: 0, easy: 0, medium: 0, hard: 0 },
              achievements: [],
              streak: { current: 0, longest: 0 },
              preferences: {
                theme: "dark",
                language: "javascript"
              }
            });

            existingUser.userInfo = userInfo._id;
            await existingUser.save();

            // Mark as new user for profile setup redirect
            user.isNewUser = true;
            user.needsProfileSetup = true;
            
            console.log(`Successfully created new user: ${existingUser.username}`);
            
          } else {
            // EXISTING USER SCENARIO - Sign In via OAuth
            console.log(`Existing user signing in via ${account.provider}: ${user.email}`);
            
            // If user exists but doesn't have OAuth info, link the accounts
            if (!existingUser.provider || existingUser.provider !== account.provider) {
              // Update existing user to include OAuth info (account linking)
              if (!existingUser.provider) {
                existingUser.provider = account.provider;
                existingUser.providerId = account.providerAccountId;
              }
              
              // Update profile image if not set
              if (user.image && !existingUser.image) {
                existingUser.image = user.image;
              }
              
              // Update name if not set or empty
              if (user.name && (!existingUser.name || existingUser.name.trim() === '')) {
                existingUser.name = user.name;
              }
              
              existingUser.lastLoginAt = new Date();
              await existingUser.save();
              
              console.log(`Linked ${account.provider} account to existing user: ${existingUser.username}`);
            } else {
              // Just update last login time for existing OAuth user
              existingUser.lastLoginAt = new Date();
              await existingUser.save();
            }
            
            user.isNewUser = false;
            user.needsProfileSetup = false;
          }

          // Store user data for JWT and session
          user._id = existingUser._id;
          user.username = existingUser.username;
          user.isAdmin = existingUser.isAdmin || false;
          user.hasProfile = !!existingUser.userInfo;
          
          console.log(`OAuth sign-in successful for ${account.provider}: ${user.email}`);
          return true;
          
        } catch (error) {
          console.error(`OAuth sign-in error for ${account.provider}:`, error);
          // Return false to show error page
          return false;
        }
      }
      
      // For credentials provider, continue with existing flow
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