const fs = require("fs").promises;//promises is a utility to create a file/folder
const path = require("path");

async function init() {
	const repoPath=path.resolve(process.cwd(),".customGit");
    const commitsPath=path.join(repoPath,"commits");
    try {
        
        await fs.mkdir(repoPath,{recursive:true});
        await fs.mkdir(commitsPath,{recursive:true});
        await fs.writeFile(path.join(repoPath,"config.json"),JSON.stringify({bucket:"S3 BUCKET"}));
        console.log("repository initialized");
    } catch (error) {
        console.log("error initializing error :"+error);
    }
}

module.exports = { init };
