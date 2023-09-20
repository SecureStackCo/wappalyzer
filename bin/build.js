const fs = require('fs')
const Zip = require('adm-zip')

const currentVersion = JSON.parse(
  fs.readFileSync('./src/manifest-v3.json')
).version

const version = process.argv[2]

if (!version) {
  // eslint-disable-next-line no-console
  console.error(
    `No version number specified. Current version is ${currentVersion}.`
  )

  process.exit(1)
}

;['./src/manifest-v2.json', './src/manifest-v3.json', './src/drivers/npm/package.json'].forEach((file) => {
  const json = JSON.parse(fs.readFileSync(file))

  json.version = version

  fs.writeFileSync(file, JSON.stringify(json, null, 2))
})

try { fs.copyFileSync(`./src/manifest.json`, './src/manifest.bak.json') } catch { }

fs.copyFileSync(`./src/manifest-v2.json`, './src/manifest.json')

let zip = new Zip()

zip.addLocalFolder('./src', '')

zip.writeZip('./build/webextension-v2.zip')

fs.copyFileSync(`./src/manifest-v3.json`, './src/manifest.json')

zip = new Zip()

zip.addLocalFolder('./src', '')

zip.writeZip('./build/webextension-v3.zip')

try { fs.copyFileSync(`./src/manifest.bak.json`, './src/manifest.json') } catch { }
