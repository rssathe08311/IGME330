const load = () => {
    const url = "data/av-data.json";
    const xhr = new XMLHttpRequest();
    
    xhr.onload = (e) => {
        let json;
        // Try to parse the JSON response
        try {
            json = JSON.parse(e.target.responseText);
        } catch(error) {
            // Handle JSON parsing error
            document.querySelector("#output").innerHTML = "BAD JSON";
            console.error('Error parsing JSON:', error);
            return;
        }

        // Access the parsed JSON object
        const obj = json;

        // Build the HTML content
        let html = "";
        html += `<h2 class="title has-text-dark">${obj.title ? obj.title : "No title found"}</h2>`;
        html += `<p class="pt-4 subtitle has-text-dark">Music Selection</p>`;
        html += `<ol class="pl-6">${obj.audioFiles.map(w => `<li>${w}</li>`).join("")}</ol>`;
        html += `<p class="pt-4">${obj.instructions}</p>`;

        // Display the HTML content in the output element
        document.querySelector("#output").innerHTML = html;
    };

    // Handle XHR error
    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);

    // Open and send the XHR request
    xhr.open("GET", url);
    xhr.send();
};

export { load };
