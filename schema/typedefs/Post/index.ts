import { objectType, queryField, mutationField, nonNull, list, nullable, inputObjectType, stringArg } from 'nexus'
import prisma from '../../../lib/prisma'
import { User } from '../User'

export const Post = objectType({
    name: 'Post',
    definition(t) {
        t.int('id')
        t.string('title')
        t.nullable.string('content')
        t.boolean('published')
        t.nullable.field('author', {
            type: User,
            resolve: (parent) =>
                prisma.post
                    .findUnique({
                        where: { id: Number(parent.id) },
                    })
                    .author(),
        })
    },
})

export const InputPostIdForPostsQuery = inputObjectType({
    name: "InputAuthorIdForPostsQuery",
    definition(t) {
        t.string("postId")
    },
})


export const InputPostContentForCreateQuery = inputObjectType({
    name: "InputPostContentForCreateQuery",
    definition(t) {
        t.nonNull.string('title')
        t.nonNull.string('content')
        t.nonNull.string('authorEmail')
    },
})

/** Queries */
export const post = queryField('post', {
    type: nullable(Post),
    args: {
        postId: nonNull(stringArg())
    },
    resolve: (_, args) => {
        return prisma.post.findUnique({
            where: { id: Number(args.postId) },
        })
    },
})

export const feed = queryField('feed', {
    type: list(nonNull(Post)),
    resolve: async (_root, _args) => {
        return prisma.post.findMany({
            where: { published: true }
        })
    }
})

export const drafts = queryField('drafts', {
    type: list(nonNull(Post)),
    resolve: (_parent, _args) => {
        return prisma.post.findMany({
            where: { published: false },
        })
    },
})

export const filterPosts = queryField('filterPosts', {
    type: list(nonNull(Post)),
    args: {
        searchString: nonNull(stringArg()),
    },
    resolve: (_, { searchString }) => {
        return prisma.post.findMany({
            where: {
                OR: [
                    { title: { contains: searchString } },
                    { content: { contains: searchString } },
                ],
            },
        })
    },
})

/** Mutations */

export const deletePost = mutationField('deletePost', {
    type: Post,
    args: {
        postId: nonNull(stringArg())
    },
    resolve: (_, { postId }) => {
        return prisma.post.delete({
            where: { id: Number(postId) },
        })
    },
})


export const createDraft = mutationField('createDraft', {
    type: Post,
    args: {
        title: nonNull(stringArg()),
        content: nonNull(stringArg()),
        authorEmail: nonNull(stringArg()),
    },
    resolve: (_, { title, content, authorEmail }) => {
        return prisma.post.create({
            data: {
                title,
                content,
                published: false,
                author: {
                    connect: { email: authorEmail },
                },
            },
        })
    },
})

export const publish = mutationField('publish', {
    type: Post,
    args: {
        postId: stringArg(),
    },
    resolve: (_, { postId }) => {
        return prisma.post.update({
            where: { id: Number(postId) },
            data: { published: true },
        })
    },
})