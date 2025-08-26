// Test NextAuth provider imports
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

console.log('GoogleProvider:', typeof GoogleProvider);
console.log('GoogleProvider.default:', typeof GoogleProvider.default);
console.log('GoogleProvider keys:', Object.keys(GoogleProvider));

console.log('GitHubProvider:', typeof GitHubProvider);
console.log('GitHubProvider.default:', typeof GitHubProvider.default);

console.log('CredentialsProvider:', typeof CredentialsProvider);
console.log('CredentialsProvider.default:', typeof CredentialsProvider.default);

export { GoogleProvider, GitHubProvider, CredentialsProvider };
