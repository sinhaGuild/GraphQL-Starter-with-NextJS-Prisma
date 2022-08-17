import { objectType, queryField, mutationField, nonNull, list, nullable, inputObjectType, stringArg } from 'nexus'
import prisma from '../../../lib/prisma'
import { Post } from '../Post'

/**
 * Model
 */
export const User = objectType({
    name: 'User',
    definition(t) {
        t.int('id')
        t.string('name')
        t.string('email')
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

//Input Types
export const InputAuthorContentForCreateQuery = inputObjectType({
    name: "InputAuthorContentForCreateQuery",
    definition(t) {
        t.string("name")
        t.string("email")
    },
})
//Input Types
export const InputAuthorIdForFetch = inputObjectType({
    name: "InputAuthorIdForFetch",
    definition(t) {
        t.string("authorId")
    },
})


//Queries
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

//Mutations
export const signupUser = mutationField('signupUser', {
    type: nullable(User),
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

