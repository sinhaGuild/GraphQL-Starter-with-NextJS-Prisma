import { declarativeWrappingPlugin, makeSchema } from 'nexus'
import path from 'path'
import * as types from './typedefs'


export const schema =
    makeSchema({
        types,
        plugins: [declarativeWrappingPlugin({ disable: true })],
        //Important! for resolve()
        sourceTypes: {
            modules: [{ module: '.prisma/client', alias: 'PrismaClient' }],
        },
        outputs: {
            schema: path.join(__dirname, "../schema.graphql"),
            typegen: path.join(__dirname, "schema-typegen.ts")
        },
        // contextType: {
        //     module: require.resolve('./context'),
        //     alias: 'Context',
        //     export: "Context"
        // },
        nonNullDefaults: {
            output: true
        }
    });


