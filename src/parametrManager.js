import fs from 'fs/promises'
import { fileExists } from './tools/tools'

const parametrsFileName = 'parametrs.json'

const init = async () => {
    let exists = await fileExists(parametrsFileName)
    if (!exists) {
        await fs.writeFile(parametrsFileName, '[]', 'utf8')
    }
}

const save = async (parametrs) => {
    await fs.writeFile(parametrsFileName, JSON.stringify(parametrs), 'utf8')
}

const load = async () => {
    return JSON.parse(await fs.readFile(parametrsFileName, 'utf8'))
}

export default {
    init,
    save,
    load
}
