const YAML = require('yaml')
const fs = require('fs')

function readYamlFile(path) {
    if (!fs.existsSync(path)) {
        return false
    }
    const file = fs.readFileSync(path, 'utf8')
    return YAML.parse(file)
}

function writeYamlFile(path, object) {
    const str = YAML.stringify(object)
    fs.writeFileSync(path, str);
}

module.exports = {
    readYamlFile,
    writeYamlFile
};