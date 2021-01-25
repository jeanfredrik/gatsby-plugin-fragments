const collectGraphQLFragments = require("gatsby-util-fragments-extractor/collectGraphQLFragments");
const extractFragmentName = require("gatsby-util-fragments-extractor/extractFragmentName");

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  const typeDefs = `
    type GraphQlFragment implements Node @dontInfer {
      name: String!
      source: String!
    }
  `;
  createTypes(typeDefs);
};

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  pluginOptions = {},
) => {
  const { createNode } = actions;
  const { fragmentsDir } = pluginOptions;

  if (!fragmentsDir) {
    return;
  }

  const fragments = await collectGraphQLFragments(fragmentsDir);
  fragments.forEach((source) => {
    const name = extractFragmentName(source);
    const node = {
      name,
      source,
      id: createNodeId(`graphql-fragment-${name}`),
      parent: null,
      children: [],
      internal: {
        type: `GraphQlFragment`,
        mediaType: `text/graphql`,
        content: source,
        contentDigest: createContentDigest(source),
      },
    };
    createNode(node);
  });
};
