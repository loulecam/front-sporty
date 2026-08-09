// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, { isCSSEnabled: true })

if (!config.resolver) {
    config.resolver = {};
}
if (!config.resolver.assetExts) {
    config.resolver.assetExts = [];
}

["glb", "gltf", "png", "fbx", "jpg"].forEach((ext) => {
    if(config.resolver.assetExts.indexOf(ext) === -1) {
        config.resolver.assetExts.push(ext);
    }

});

module.exports = withNativeWind(config, { input: './global.css' })
