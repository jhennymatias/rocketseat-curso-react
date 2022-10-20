import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { query as q } from "faunadb"
import { fauna } from '../../../services/fauna'

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            // @ts-ignore
            scope: 'read:user'
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            const data_email = user.email;

            try {
                await fauna.query(
                    q.If(
                        q.Not(
                            q.Exists(
                                q.Match(
                                    q.Index('user_by_email'),
                                    q.Casefold(data_email)
                                )
                            )
                        ),
                        q.Create(
                            q.Collection('users'),
                            { data: { email: data_email } }),

                        q.Get(
                            q.Match(
                                q.Index('user_by_email'),
                                q.Casefold(data_email)
                            )
                        )
                    )

                )
                return true;
            } catch {
                return false;
            }

        },
    }
})