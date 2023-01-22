function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const makeRequest = async (url, apiKey, modelVersion, input) => {
    console.log("making request");
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'version': modelVersion,
            'input': input
        })
    })
    const data = await resp.json();
    return data;
};

const getResult = async (url, apiKey, id) => {
    const resp = await fetch(`${url}/${id}`, {
        method: 'GET',
        allow_redirects: true,
        headers: {
            'Authorization': `Token ${apiKey}`,
        }
    })
    const data = await resp.json();
    return data;
}

export const predict = async (url, apiKey, modelVersion, input) => {
    const requestData = await makeRequest(url, apiKey, modelVersion, input);
    const id = requestData['id'];

    let output = null;
    while(output == null){
        await sleep(500);
        const data = await getResult(url, apiKey, id);
        
        if(data['status']==="failed" || data['status']==="canceled"){
            throw `Prediction failed, Status: ${data['status']}`
        }
        if(data['error'] != null){
            throw `Error: ${data['error']}`
        }

        output = data['output'];        
    }

    return output;
}
