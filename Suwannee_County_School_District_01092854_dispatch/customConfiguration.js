/* eslint-disable new-cap */

(function () {
    let xhr,
        customConfig;

    var dispatchCustomConfigUrl = "https://cloud.scorm.com/api/cloud/dispatch/59b97d4e-50b2-454f-a7b7-a0d68dd6f7c4/customConfig?appId=1O71AUX42W";

    function addCustomConfigOptions(customConfig) {
        let key,
            configValueScript,
            html_doc = document.getElementsByTagName('head').item(0),
            js = document.createElement('script');

        js.setAttribute('language', 'javascript');
        js.setAttribute('type', 'text/javascript');

        for (key in customConfig) {
            if (customConfig.hasOwnProperty(key)) {
                configValueScript = document.createTextNode(key + "='" + customConfig[key] + "';");
                js.appendChild(configValueScript);
            }
        }

        html_doc.appendChild(js);

        if (customConfig.hasOwnProperty('DispatchClientLoaderFilename') && customConfig.DispatchClientLoaderFilename) {
            include_script(DispatchRoot + customConfig.DispatchClientLoaderFilename);
        } else {
            include_script(DispatchRoot + "dispatch.client.loader.v2.js");
        }
    }

    //Fix custom config URL protocol to match the window's
    if (window.location.protocol === "https:") {
        dispatchCustomConfigUrl = dispatchCustomConfigUrl.replace('http:', 'https:');
    } else {
        dispatchCustomConfigUrl = dispatchCustomConfigUrl.replace('https:', 'http:');
    }

    xhr = new XMLHttpRequest();
    xhr.open("GET", dispatchCustomConfigUrl, true);
    xhr.setRequestHeader("launchtoken", "5LbqIBPBq7pORWMqzAOIEC7kD9v6WHRfpqi7PcdP");
    xhr.onreadystatechange = function () {
        // eslint-disable-next-line no-magic-numbers
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    customConfig = JSON.parse(xhr.responseText);
                }
                catch (ex) {
                    // eslint-disable-next-line no-alert
                    alert("Failed to parse response from custom configuration URL as JSON, the launch has been halted. (" + ex + ")");
                    return;
                }

                addCustomConfigOptions(customConfig);

                return;
            }
            else if (xhr.status === 404) {
                // A 404 means that no custom configuration is set, so just continue on with the launch as normal
                include_script(DispatchRoot + "dispatch.client.loader.v2.js");
                return;
            }

            // eslint-disable-next-line no-alert
            alert("Unrecognized HTTP status returned from custom configuration URL (" + xhr.status + "), the launch has been halted.");
        }
    };

    try {
        xhr.send();
    }
    catch (ex) {
        // research indicates that IE is known to just throw exceptions
        // on .send and it seems everyone just ignores them
    }
}());
