import { objectType, queryField, mutationField, nonNull, list, nullable, stringArg } from 'nexus'
import prisma from '../../../lib/prisma'
import { Post } from '../Post'

/**
 * MODEL
 */
export const User = objectType({
    name: 'User',
    definition(t) {
        t.int('id')
        t.nonNull.string('name')
        t.nonNull.string('email')
        t.list.field('posts', {
            type: Post,
            resolve: (parent) =>
                prisma.user
                    .findUnique({
                        where: { id: Number(parent.id) },
                    })
                    .posts(),
        })
    },
})

/** QUERIES */
export const users = queryField('allUsers', {
    type: nullable(list(nonNull(User))),
    async resolve(_root, _args, ctx) {
        return await prisma.user.findMany({})
    }
})

export const user = queryField('user', {
    type: User,
    args: {
        authorId: nonNull(stringArg())
    },
    async resolve(_root, args) {
        return await prisma.user.findUnique({
            where: {
                id: Number(args.authorId)
            }
        })
    }
})

/** MUTATIONS */
export const signupUser = mutationField('signupUser', {
    type: User,
    args: {
        name: nonNull(stringArg()),
        email: nonNull(stringArg()),
    },
    resolve: (_, { name, email }) => {
        return prisma.user.create({
            data: {
                name,
                email,
            },
        })
    },
})

