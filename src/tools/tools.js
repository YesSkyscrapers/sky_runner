import fs from 'fs/promises'

const fileExists = async (path) => {
    try {
        let fileInfo = fs.stat(path)
        return !!fileInfo
    } catch (err) {
        return false
    }
}

export { fileExists }
