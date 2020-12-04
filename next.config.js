// const withSass = require('@zeit/next-sass')
// module.exports = withSass()




const withPlugins = require('next-compose-plugins');
const sass = require('@zeit/next-sass');
const css = require('@zeit/next-css');
module.exports =  withPlugins([
    [css, {}],
    [sass, {}]
]);

// import withSass from '@zeit/next-sass';
// import withCss from '@zeit/next-css';
// // const withPurgeCss = require('next-purgecss')
// import withPlugins from 'next-compose-plugins';;

// export default withPlugins([
// [ withSass, {} ],
// [ withCss, {} ],
// [ withPurgeCss, {
// purgeCssPaths: [
// 'styles/**/*',
// 'pages/**/*.tsx',
// 'pages/**/*.js',
// 'app/**/*.tsx',
// 'app/**/*.js',

// ],
// purgeCss: {
// whitelist: whitelister([
// './styles/cropper.scss',
// './node_modules/rc-slider/assets/index.css',
// './node_modules/react-quill/dist/quill.snow.css',
// './node_modules/react-day-picker/lib/style.css',
// './node_modules/react-datasheet/lib/react-datasheet.css',
// ]),
// extractors: [
// {
// extractor: TailwindExtractor,
// extensions: ['js', 'html', 'tsx', 'scss']
// }
// ],
// }

// }],

// ]);




