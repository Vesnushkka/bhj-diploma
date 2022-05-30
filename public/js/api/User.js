/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */

class User {
    static URL = '/user';

    /**
     * Устанавливает текущего пользователя в
     * локальном хранилище.
     * */
    static setCurrent(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    /**
     * Удаляет информацию об авторизованном
     * пользователе из локального хранилища.
     * */
    static unsetCurrent() {
        return localStorage.removeItem('user');
    }

    /**
     * Возвращает текущего авторизованного пользователя
     * из локального хранилища
     * */
    static current() {
        return JSON.parse(localStorage.getItem('user'));
    }

    /**
     * Получает информацию о текущем
     * авторизованном пользователе.
     * */
    static fetch(callback) {
        createRequest({
            method: httpMethods.get,
            url: `${this.URL}/current`,
            callback: (err, response) => {
                if (response.success) {
                    callback(err, response);
                    this.setCurrent(response.user);
                } else {
                    this.unsetCurrent();
                }
            }
        });
    }

    /**
     * Производит попытку авторизации.
     * После успешной авторизации необходимо
     * сохранить пользователя через метод
     * User.setCurrent.
     * */
    static login(data, callback) {
        createRequest({
            url: this.URL + '/login',
            method: httpMethods.post,
            responseType: 'json',
            data,
            callback: (err, response) => {
                if (response?.user && response?.success) {
                    this.setCurrent(response.user);
                }
                callback(err, response);
            }
        });
    }

    /**
     * Производит попытку регистрации пользователя.
     * После успешной авторизации необходимо
     * сохранить пользователя через метод
     * User.setCurrent.
     * */
    static register(data, callback) {
        createRequest({
            method: httpMethods.post,
            url: `${this.URL}/register`,
            data,
            callback: (err, response) => {
                if (response?.success && response?.user) {
                    this.setCurrent(response.user);
                }
                callback(err, response);
            }
        });
    }

    /**
     * Производит выход из приложения. После успешного
     * выхода необходимо вызвать метод User.unsetCurrent
     * */
    static logout(callback) {
        createRequest({
            method: httpMethods.post,
            url: `${this.URL}/logout`,
            callback: (err, response) => {
                if (response.success) {
                    this.unsetCurrent();
                }
                callback(err, response);
            }
        });
    }
}
