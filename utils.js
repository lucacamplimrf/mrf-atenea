const Utils = {

  getBindings: (template) => {
    let match;
    const BND_REGX = /__(.*?)__/g
    const results = new Set();
    while ( (match = BND_REGX.exec(template)) !== null ) {
      const binding = match[1];
      binding && results.add(binding);
    }
    return results;
  },

  buildContent: (bindings, template) => template.replace(/__.*?__/g, (token) => bindings[token.slice(2, -2)]),
  
};

module.exports = Utils;
