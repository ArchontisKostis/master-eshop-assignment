// orval.config.cjs
module.exports = {
  api: {
    input: {
      target: 'http://localhost:8080/v3/api-docs',
      // validation: true,
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/generated.ts',
      client: 'axios',
      override: true,
      hooks: true
    },
  },
};
