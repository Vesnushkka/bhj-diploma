/**
 * Основная функция для совершения запросов
 * на сервер.
 * */

const httpMethods = {
    get: 'GET',
    put: 'PUT',
    delete: 'DELETE',
    post: 'POST'
};

const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest;
    let url = '';
    let formData = null;
    switch (options.method) {
        case httpMethods.get:
            url = `${options.url}${formatParams(options.data)}`;
            break;
        case httpMethods.put:
        case httpMethods.post:
        case httpMethods.delete:
            url = options.url;
            formData = formatFormData(options.data);
            break;
        default:
            throw new Error(`${options.method} doesn't implement!`);
    }

    try {
        xhr.open(options.method, url);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                options.callback(null, response);
            }
        };

        if (formData) {
            xhr.send(formData);
        } else {
            xhr.send();
        }
    } catch (err) {
        options.callback(err, null);
    }
};

function formatParams(params) {
    return params
        ? '?' + Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&')
        : '';
}

function formatFormData(data) {
    if (!data) {
        return;
    }
    const formData = new FormData;
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return formData;
}
