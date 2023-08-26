import fs from 'fs/promises'
import { fileExists } from '../tools/tools'
import moment from 'moment'

const logsFileName = 'logs.txt'

const init = async () => {
    let exists = await fileExists(logsFileName)
    if (!exists) {
        await fs.writeFile(logsFileName, '', 'utf8')
    }
}

const append = async (log) => {
    await fs.appendFile(logsFileName, `${moment().format()}: ${log}\n`, 'utf8')
}

const clear = async () => {
    await fs.writeFile(logsFileName, '', 'utf8')
}

const read = async () => {
    return await fs.readFile(logsFileName, 'utf8')
}

export default {
    append,
    clear,
    read,
    init
}
