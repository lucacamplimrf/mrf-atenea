const Utils = {

    getBindings: (template) => {
        let match;
        const BND_REGX = /__(.*?)__/g
        const results = new Set();
        while ((match = BND_REGX.exec(template)) !== null) {
            const binding = match[1];
            binding && results.add(binding);
        }
        return results;
    },

    buildContent: (template, bindings) => template.replace(/__.*?__/g, (token) => bindings[token.slice(2, -2)]),

    insertRefForImage: (template, title) => {
        const imageMatch = template.match(/<ri:attachment.*?>/g);
        if (imageMatch && imageMatch[0]) {
            const insertIndex = template.indexOf(imageMatch[0]) + imageMatch[0].length - 2;
            const ref = `><ri:page ri:content-title="${title}"/></ri:attachment>`;
            return template.slice(0, insertIndex) + ref + template.slice(insertIndex + 2);
        }
        return template;
    },

    prettyLogJSON: obj => console.log(JSON.stringify(obj, null, 4))

};

module.exports = Utils;
